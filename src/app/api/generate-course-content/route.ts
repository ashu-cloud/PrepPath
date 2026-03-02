import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import db from "@/config/db";
import { chaptersContentTable } from "@/config/schema";
import youtubeSearchApi from "youtube-search-api";

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

            // 1. Ask Gemini for the Text
            const response = await ai.models.generateContent({
                model: process.env.GEMINI_CONTENT_MODEL || "gemini-2.5-flash",
                contents: prompt,
            });
            htmlContent = response.text ?? "";

            // 2. SMART YouTube Search (Filters out Ads, Pranks, and Channels)
            try {
                // Create a highly specific educational query
                const safeCourseName = courseName || "Computer Science";
                const searchQuery = `${safeCourseName} ${topic} tutorial explanation`;
                
                // Fetch the top 5 results so we have options to filter through
                const ytResults = await youtubeSearchApi.GetListByKeyword(searchQuery, false, 5);
                
                if (ytResults && ytResults.items) {
                    // Filter the results to ONLY grab real, standalone videos (no playlists or ads)
                    const validVideo = ytResults.items.find((item: any) => {
                        return (
                            item.type === "video" && // Must be a video (not a channel)
                            item.id && // Must have a valid ID
                            item.length?.simpleText // Must have a time length (Ads usually don't have this in scrapes)
                        );
                    });

                    if (validVideo) {
                        videoId = validVideo.id;
                    }
                }
            } catch (ytError) {
                console.error("YouTube Fetch Failed:", ytError);
                // We DO NOT throw an error here. If YouTube fails, we still want to save the AI text!
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

        // 3. Save Both to Neon Database
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