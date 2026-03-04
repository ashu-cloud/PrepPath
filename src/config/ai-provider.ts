import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// ═══════════════════════════════════════════════════════════════════════════
// AI PROVIDER — multi-key Gemini rotation + Groq fallback
// Shared across all API routes that need AI generation.
// ═══════════════════════════════════════════════════════════════════════════

// Gemini: supports comma-separated keys for rotation (each gets 20 RPD free)
const geminiKeys = (process.env.GEMINI_API_KEY || "")
    .split(",")
    .map(k => k.trim())
    .filter(Boolean);

const geminiClients = geminiKeys.map(key => new GoogleGenAI({ apiKey: key }));

// Track which Gemini keys have hit their daily quota (resets on server restart)
const exhaustedKeys = new Set<number>();

// Groq: optional fallback (free tier: 14,400 RPD)
const groqClient = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Parse retry delay from Gemini error (e.g. "retryDelay":"36s") ──────────
function parseRetryDelay(error: any): number | null {
    try {
        const msg = error?.message || JSON.stringify(error);
        const match = msg.match(/"retryDelay"\s*:\s*"(\d+)s?"/);
        if (match) return parseInt(match[1], 10) * 1000;
    } catch { /* ignore */ }
    return null;
}

// ── Check if Gemini error is daily quota exhaustion ────────────────────────
function isDailyQuotaExhausted(error: any): boolean {
    try {
        const msg = error?.message || JSON.stringify(error);
        return msg.includes("PerDay") || msg.includes("per day") || msg.includes("GenerateRequestsPerDay");
    } catch { return false; }
}

function isRateLimitError(error: any): boolean {
    return (
        error?.status === 429 ||
        error?.message?.includes("Quota") ||
        error?.message?.includes("Too Many") ||
        error?.message?.includes("RESOURCE_EXHAUSTED")
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// generateWithFallback — the main export
//
// Options:
//   prompt      — the text prompt to send
//   systemMsg   — optional system message (used by Groq, ignored by Gemini)
//   jsonMode    — if true, ask Gemini for JSON output & tell Groq to output JSON
//   geminiConfig— extra config to pass to Gemini's generateContent (e.g. responseMimeType)
// ═══════════════════════════════════════════════════════════════════════════

interface GenerateOptions {
    prompt: string;
    systemMsg?: string;
    jsonMode?: boolean;
    geminiConfig?: Record<string, any>;
    maxTokens?: number; // Groq output token cap — keep low to save daily quota
}

export async function generateWithFallback(
    options: GenerateOptions
): Promise<{ text: string; provider: string }> {
    const { prompt, systemMsg, jsonMode, geminiConfig, maxTokens } = options;
    const geminiModel = process.env.GEMINI_CONTENT_MODEL || "gemini-2.5-flash";
    const groqModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    // Smart token defaults: JSON needs less, HTML content needs more
    const resolvedMaxTokens = maxTokens ?? (jsonMode ? 4096 : 16384);
    // Groq hard limit is 32768 — clamp to stay safe
    const groqMaxTokens = Math.min(resolvedMaxTokens, 32768);
    const errors: string[] = [];

    // ── Try each Gemini key ────────────────────────────────────────────
    for (let k = 0; k < geminiClients.length; k++) {
        if (exhaustedKeys.has(k)) {
            console.log(`Gemini key ${k + 1}/${geminiClients.length} already exhausted, skipping.`);
            continue;
        }

        const config: Record<string, any> = { ...geminiConfig };
        if (jsonMode && !config.responseMimeType) {
            config.responseMimeType = "application/json";
        }

        try {
            console.log(`Trying Gemini key ${k + 1}/${geminiClients.length}...`);
            const response = await geminiClients[k].models.generateContent({
                model: geminiModel,
                contents: prompt,
                ...(Object.keys(config).length > 0 ? { config } : {}),
            });
            const text = response?.text ?? "";
            if (text) {
                console.log(`✅ Gemini key ${k + 1} succeeded.`);
                return { text, provider: `gemini-key-${k + 1}` };
            }
        } catch (error: any) {
            if (isDailyQuotaExhausted(error)) {
                console.warn(`Gemini key ${k + 1} daily quota exhausted. Marking as exhausted.`);
                exhaustedKeys.add(k);
                errors.push(`Gemini key ${k + 1}: daily quota exhausted`);
                continue;
            }
            if (isRateLimitError(error)) {
                const apiDelay = parseRetryDelay(error);
                const waitMs = apiDelay ? apiDelay + 5000 : 40000;
                console.warn(`Gemini key ${k + 1} rate limited. Waiting ${Math.round(waitMs / 1000)}s...`);
                await sleep(waitMs);
                try {
                    const retryResponse = await geminiClients[k].models.generateContent({
                        model: geminiModel,
                        contents: prompt,
                        ...(Object.keys(config).length > 0 ? { config } : {}),
                    });
                    const text = retryResponse?.text ?? "";
                    if (text) return { text, provider: `gemini-key-${k + 1}` };
                } catch (retryError: any) {
                    if (isDailyQuotaExhausted(retryError)) {
                        exhaustedKeys.add(k);
                    }
                    errors.push(`Gemini key ${k + 1}: ${retryError?.message?.slice(0, 100)}`);
                    continue;
                }
            }
            errors.push(`Gemini key ${k + 1}: ${error?.message?.slice(0, 100)}`);
        }
    }

    // ── Fallback to Groq ───────────────────────────────────────────────
    if (groqClient) {
        try {
            console.log("All Gemini keys exhausted. Falling back to Groq...");

            const defaultHtmlSystemMsg = `You are an expert educational content writer producing premium course material. You always write long, thorough, textbook-quality content. You never write short or summarized responses.`;

            const defaultJsonSystemMsg = `You are an expert Instructional Designer. Respond with valid JSON only. No markdown, no code fences. Make chapter descriptions specific with 3-5 well-defined topics each.`;

            const sysContent = systemMsg || (jsonMode ? defaultJsonSystemMsg : defaultHtmlSystemMsg);

            // For HTML content: wrap the user prompt with explicit length/detail requirements
            // LLaMA models respond to in-prompt instructions much better than system messages
            const enhancedPrompt = (!jsonMode && !systemMsg) ? `${prompt}

MANDATORY OUTPUT REQUIREMENTS — DO NOT IGNORE:
1. Your response MUST be at least 2000 words long. Short responses are unacceptable.
2. For EACH major topic, write AT LEAST 3 full paragraphs of explanation.
3. Include AT LEAST 3 complete code examples, each followed by a detailed explanation of every line.
4. Add a "Key Takeaways" section with bullet points at the end.
5. Add a "Common Mistakes & Pitfalls" section with examples of what NOT to do.
6. Use <h2> for main sections and <h3> for subsections. Have at least 5 sections.
7. Output raw HTML only. No markdown. No \`\`\` code fences wrapping response.
8. Use <pre><code class="language-X">...</code></pre> for all code blocks.
9. Do NOT be brief. Write as if this is a paid textbook chapter. Be EXHAUSTIVE.` : prompt;

            const response = await groqClient.chat.completions.create({
                model: groqModel,
                messages: [
                    { role: "system", content: sysContent },
                    { role: "user", content: enhancedPrompt }
                ],
                temperature: 0.7,
                max_tokens: groqMaxTokens,
                ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
            });
            const text = response.choices?.[0]?.message?.content ?? "";
            if (text) {
                console.log("✅ Groq fallback succeeded.");
                return { text, provider: "groq" };
            }
        } catch (groqError: any) {
            errors.push(`Groq: ${groqError?.message?.slice(0, 100)}`);
            console.error("Groq fallback failed:", groqError?.message);
        }
    } else {
        errors.push("Groq: not configured (no GROQ_API_KEY)");
    }

    // All providers failed
    const allExhausted = exhaustedKeys.size >= geminiClients.length;
    const errorMsg = allExhausted && !groqClient
        ? "All Gemini API keys' daily quota exhausted. Add GROQ_API_KEY to .env for free fallback (groq.com), or try again tomorrow."
        : `All AI providers failed:\n${errors.join("\n")}`;

    throw new Error(errorMsg);
}
