import { NextResponse } from "next/server";
import db from "@/config/db";
import { chaptersContentTable } from "@/config/schema";
import youtubeSearchApi from "youtube-search-api";
import { eq, and } from "drizzle-orm";
import { generateWithFallback } from "@/config/ai-provider";
import { marked } from "marked";

// Convert AI response to clean HTML.
// Gemini sometimes returns markdown (** bold **, ## headings) despite being
// asked for HTML. marked.parse() converts any markdown to HTML while
// transparently passing through content that is already valid HTML.
function ensureHtml(text: string): string {
    // Strip outer markdown code fences if the model wrapped the whole response
    const stripped = text.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "").trim();
    return marked.parse(stripped) as string;
}

// ── Parse YouTube duration string like "12:34" or "1:02:30" into seconds ───
function parseDuration(durationStr: string): number {
    if (!durationStr) return 0;
    const parts = durationStr.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
}

// ── Fetch a YouTube video ID matching a chapter heading (non-fatal) ────────
async function fetchVideoId(courseName: string, chapterName: string, topic: string): Promise<string> {
    // Try most-specific query first, then broaden
    const queries = [
        `${chapterName} ${courseName} tutorial`,      // e.g. "Goroutines and Channels Go Lang tutorial"
        `${chapterName} programming tutorial`,          // drop course name
        `${courseName} ${topic} explained`,             // fallback to topic keyword
    ];

    for (const searchQuery of queries) {
        try {
            const ytResults = await youtubeSearchApi.GetListByKeyword(searchQuery, false, 10);
            if (!ytResults?.items) continue;

            // Filter: must be a real video (not Short, not livestream), 2+ minutes long
            const validVideo = ytResults.items.find((item: any) => {
                if (item.type !== "video" || !item.id) return false;
                const duration = item.length?.simpleText || "";
                const seconds = parseDuration(duration);
                // Skip Shorts (<60s), very long videos (>45min), and missing duration
                if (seconds < 120 || seconds > 2700) return false;
                // Skip if title contains "#shorts" or "short"
                const title = (item.title || "").toLowerCase();
                if (title.includes("#shorts") || title.includes("#short")) return false;
                return true;
            });

            if (validVideo) {
                console.log(`YouTube match for "${chapterName}": "${validVideo.title}" (${validVideo.length?.simpleText})`);
                return validVideo.id;
            }
        } catch (ytError) {
            console.error(`YouTube search failed for query "${searchQuery}":`, ytError);
        }
    }

    console.warn(`No suitable YouTube video found for chapter: "${chapterName}"`);
    return "";
}

// ── POST handler — supports single chapter OR batch ────────────────────────
// Batch mode: ONE AI call for all chapters (2 total calls per course: layout + content)
export const maxDuration = 300; // allow up to 5 min for batch generation

export const POST = async (req: Request) => {
    try {
        const body = await req.json();

        // ══════════════════════════════════════════════════════════════════
        // BATCH MODE — ONE AI call for ALL chapters
        // ══════════════════════════════════════════════════════════════════
        if (body.chapters && Array.isArray(body.chapters)) {
            const { chapters, courseId, courseName } = body;
            if (!courseId || !courseName || chapters.length === 0) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            // Figure out which chapters still need generating
            const toGenerate: Array<{ chapterName: string; topic: string; index: number }> = [];
            const alreadyDone: number[] = [];

            for (const ch of chapters) {
                const idx = ch.index ?? chapters.indexOf(ch);
                const existing = await db.select()
                    .from(chaptersContentTable)
                    .where(and(
                        eq(chaptersContentTable.cid, courseId),
                        eq(chaptersContentTable.chapterId, idx)
                    ));
                if (existing.length > 0) {
                    alreadyDone.push(idx);
                } else {
                    toGenerate.push({ chapterName: ch.chapterName, topic: ch.topic, index: idx });
                }
            }

            // Stream progress via newline-delimited JSON
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                async start(controller) {
                    const send = (data: object) => {
                        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
                    };

                    // Report already-done chapters immediately
                    for (const idx of alreadyDone) {
                        send({ type: "progress", chapter: idx, total: chapters.length, status: "skipped" });
                    }

                    if (toGenerate.length === 0) {
                        send({ type: "done", results: alreadyDone.map(i => ({ index: i, status: "skipped" })) });
                        controller.close();
                        return;
                    }

                    // Build ONE prompt for all chapters
                    const chapterList = toGenerate.map((ch, i) =>
                        `CHAPTER_${i} (index=${ch.index}): "${ch.chapterName}" — topic: "${ch.topic}"`
                    ).join("\n");

                    const batchPrompt = `You are a world-class educator writing a premium paid online course called "${courseName}".
Generate DETAILED, TEXTBOOK-QUALITY HTML content for ALL ${toGenerate.length} chapters below in a SINGLE response.

${chapterList}

FOR EACH CHAPTER, YOU MUST INCLUDE ALL OF THESE SECTIONS:

1. <h2>Introduction</h2>
   - 1-2 paragraphs: What this topic is and WHY it matters. Include a real-world motivation.

2. MULTIPLE <h2> CONTENT SECTIONS (at least 3-4 per chapter)
   For each concept:
   - <h3> sub-heading
   - 1-2 paragraphs of clear explanation with analogies.
   - A COMPLETE code example in <pre><code class="language-[name]">...</code></pre>
   - Brief explanation of what the code does.

3. <h2>Common Mistakes & Pitfalls</h2>
   - 3-4 common errors with wrong vs correct code examples.

4. <h2>Key Takeaways</h2>
   - 5-8 bullet points summarizing the chapter.

FORMATTING RULES:
- Use <h2> for sections, <h3> for sub-sections, <p> for paragraphs, <ul>/<li> for lists.
- ALL code in <pre><code class="language-[name]">...</code></pre>.
- Raw HTML only — NO <html>, <body>, NO markdown, NO code fences wrapping the response.
- Each chapter should be 800-1500 words. Be thorough but focused.

OUTPUT FORMAT:
- Separate chapters with this EXACT delimiter on its own line: ===CHAPTER_SEPARATOR===
- Output chapters in the EXACT order listed above.
- Do NOT include the separator before the first chapter or after the last.

Write like a teacher who genuinely wants students to understand. Be detailed and practical.
Begin generating all ${toGenerate.length} chapters now:`;

                    try {
                        for (const ch of toGenerate) {
                            send({ type: "progress", chapter: ch.index, total: chapters.length, status: "generating" });
                        }

                        // ★ SINGLE AI CALL for all chapters ★
                        console.log(`Generating ${toGenerate.length} chapters in ONE AI call for "${courseName}"...`);
                        const { text: fullText, provider } = await generateWithFallback({
                            prompt: batchPrompt,
                            maxTokens: 32000,
                            geminiConfig: { maxOutputTokens: 65000 },
                        });
                        send({ type: "info", message: `Using provider: ${provider}` });

                        const chapterContents = fullText.split("===CHAPTER_SEPARATOR===").map((s: string) => s.trim());
                        console.log(`AI returned ${chapterContents.length} sections for ${toGenerate.length} chapters via ${provider}.`);

                        const results: Array<{ index: number; status: string; error?: string }> = [
                            ...alreadyDone.map(i => ({ index: i, status: "skipped" }))
                        ];

                        // Save each chapter to DB + fetch YouTube videos
                        for (let i = 0; i < toGenerate.length; i++) {
                            const ch = toGenerate[i];
                            const htmlContent = ensureHtml(chapterContents[i] || "");

                            if (!htmlContent || htmlContent.length < 100) {
                                console.warn(`Chapter ${ch.index} got empty/short content.`);
                                results.push({ index: ch.index, status: "error", error: "Empty content from AI" });
                                send({ type: "progress", chapter: ch.index, total: chapters.length, status: "error", error: "Empty content" });
                                continue;
                            }

                            const videoId = await fetchVideoId(courseName, ch.chapterName, ch.topic);

                            await db.insert(chaptersContentTable).values({
                                cid: courseId,
                                chapterId: ch.index,
                                content: htmlContent,
                                videoId,
                            });

                            results.push({ index: ch.index, status: "ok" });
                            send({ type: "progress", chapter: ch.index, total: chapters.length, status: "ok" });
                        }

                        send({ type: "done", results });
                    } catch (error: any) {
                        console.error("Batch generation failed:", error?.message);
                        send({ type: "error", error: error?.message || "Generation failed" });
                    }

                    controller.close();
                },
            });

            return new Response(stream, {
                headers: {
                    "Content-Type": "application/x-ndjson",
                    "Cache-Control": "no-cache",
                    "Transfer-Encoding": "chunked",
                },
            });
        }

        // ── Single chapter mode (backwards compatible) ─────────────────────
        const { chapterName, topic, courseId, index, courseName } = body;

        if (!chapterName || !topic || !courseId || index == null) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Idempotency check
        const existingChapter = await db.select()
            .from(chaptersContentTable)
            .where(and(
                eq(chaptersContentTable.cid, courseId),
                eq(chaptersContentTable.chapterId, Number(index))
            ));

        if (existingChapter.length > 0) {
            return NextResponse.json({
                success: true,
                content: existingChapter[0].content,
                videoId: existingChapter[0].videoId,
            });
        }

        try {
            const prompt = `Generate highly detailed educational content in HTML format for the topic: "${topic}" 
        under the chapter "${chapterName}" for the course "${courseName}". 
        Include code examples, bullet points, and clear explanations. 
        
        FORMATTING RULES:
        1. Use proper HTML tags like <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>.
        2. IMPORTANT: Wrap ALL code snippets strictly inside <pre><code class="language-[name]">...</code></pre> tags (replace [name] with the language like cpp, javascript, python).
        3. Response must be raw HTML without <html> or <body> tags.`;

            const { text: rawContent, provider } = await generateWithFallback({ prompt });
            console.log(`Single chapter generated via ${provider}`);
            const htmlContent = ensureHtml(rawContent);
            const videoId = await fetchVideoId(courseName, chapterName, topic);

            await db.insert(chaptersContentTable).values({
                cid: courseId,
                chapterId: Number(index),
                content: htmlContent,
                videoId,
            });

            return NextResponse.json({ success: true, content: htmlContent, videoId });
        } catch (error: any) {
            console.error("Gemini API error:", error);
            const isRateLimit =
                error?.status === 429 ||
                error?.message?.includes("Quota") ||
                error?.message?.includes("Too Many") ||
                error?.message?.includes("RESOURCE_EXHAUSTED");
            if (isRateLimit) {
                return NextResponse.json({ error: "Rate limit exceeded. Please try again shortly." }, { status: 429 });
            }
            if (error?.status === 404 && String(error?.message).includes("model")) {
                return NextResponse.json({
                    error: "Gemini model not found. Check GEMINI_CONTENT_MODEL env variable.",
                }, { status: 500 });
            }
            throw error;
        }

    } catch (error: any) {
        console.error("Lesson generation failed:", error);
        return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
    }
};