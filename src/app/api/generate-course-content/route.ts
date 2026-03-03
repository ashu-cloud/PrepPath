import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import db from "@/config/db";
import { chaptersContentTable } from "@/config/schema";
import youtubeSearchApi from "youtube-search-api";
import { eq, and } from "drizzle-orm"; // Added for idempotency check

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({
    apiKey: geminiKey,
});

export const POST = async (req: Request) => {
    try {
        const { chapterName, topic, courseId, index, courseName } = await req.json();

        if (!chapterName || !topic || !courseId || index == null) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // --- 1. IDEMPOTENCY CHECK (Resumability) ---
        // If a user refreshes the page mid-way, this checks if the chapter was already generated
        const existingChapter = await db.select()
            .from(chaptersContentTable)
            .where(and(
                eq(chaptersContentTable.cid, courseId),
                eq(chaptersContentTable.chapterId, Number(index))
            ));

        // If it exists, immediately return the cached content
        if (existingChapter.length > 0) {
            console.log(`Chapter ${index} already exists. Skipping generation. Resuming...`);
            return NextResponse.json({ 
                success: true, 
                content: existingChapter[0].content, 
                videoId: existingChapter[0].videoId 
            });
        }
        // -------------------------------------------

        const prompt = `Generate highly detailed educational content in HTML format for the topic: "${topic}" 
        under the chapter "${chapterName}" for the course "${courseName}". 
        Include code examples, bullet points, and clear explanations. 
        
        FORMATTING RULES:
        1. Use proper HTML tags like <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>.
        2. IMPORTANT: Wrap ALL code snippets strictly inside <pre><code class="language-[name]">...</code></pre> tags (replace [name] with the language like cpp, javascript, python).
        3. Response must be raw HTML without <html> or <body> tags.`;

        let htmlContent = "";
        let videoId = "";

        try {
            if (process.env.DATABASE_URL?.includes("api.")) {
                console.error("Detected DATABASE_URL with api host, this will fail:", process.env.DATABASE_URL);
            }

            // Ask Gemini for the Text
            const response = await ai.models.generateContent({
                model: process.env.GEMINI_CONTENT_MODEL || "gemini-2.5-flash",
                contents: prompt,
            });
            htmlContent = response.text ?? "";

            // SMART YouTube Search
            try {
                const safeCourseName = courseName || "Computer Science";
                const searchQuery = `${safeCourseName} ${topic} tutorial explanation`;
                
                const ytResults = await youtubeSearchApi.GetListByKeyword(searchQuery, false, 5);
                
                if (ytResults && ytResults.items) {
                    const validVideo = ytResults.items.find((item: any) => {
                        return (
                            item.type === "video" && 
                            item.id && 
                            item.length?.simpleText 
                        );
                    });

                    if (validVideo) {
                        videoId = validVideo.id;
                    }
                }
            } catch (ytError) {
                console.error("YouTube Fetch Failed:", ytError);
            }

        } catch (error: any) {
            console.error("API Error (Gemini):", error);
            const isQuota = error?.status === 429 || error?.message?.includes("Quota");
            if (isQuota) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

            if (error?.status === 404 && String(error?.message).includes("model")) {
                return NextResponse.json({
                    error: "Gemini model not found. Check GEMINI_CONTENT_MODEL or update to a supported model name."
                }, { status: 500 });
            }
            throw error; 
        }

        // Save Both to Neon Database
        await db.insert(chaptersContentTable).values({
            cid: courseId,
            chapterId: Number(index),
            content: htmlContent,
            videoId: videoId,
        });

        return NextResponse.json({ success: true, content: htmlContent, videoId });

    } catch (error: any) {
        console.error("Lesson generation failed:", error);
        return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
    }
}