import { NextResponse } from "next/server";
import { generateWithFallback } from "@/config/ai-provider";

export async function POST(req: Request) {
    try {
        const { code, language } = await req.json();

        const prompt = `You are an expert senior software engineer. Refactor the following ${language} code for better performance, readability, and industry best practices. 
        
        CODE TO REFACTOR:
        ${code}

        RESPONSE FORMAT:
        Return your response in a clear format:
        1. The Refactored Code (wrapped in markdown code blocks).
        2. A list of specific improvements made.
        3. Complexity analysis (Time and Space).`;

        const { text, provider } = await generateWithFallback({
            prompt,
            systemMsg: "You are an expert senior software engineer. Respond in clean Markdown format. Use markdown headings (##, ###), markdown code blocks (```language), bullet points, and numbered lists. Do NOT use HTML tags like <h2>, <pre>, <code>, <ul>, <li>, etc. Pure Markdown only.",
        });
        console.log(`Refactor tool used provider: ${provider}`);
        
        return NextResponse.json({ result: text });
    } catch (error: any) {
        console.error("Refactor API Error:", error);
        const msg = error?.message?.includes("daily quota") || error?.message?.includes("All AI providers")
            ? error.message
            : "Failed to refactor code";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}