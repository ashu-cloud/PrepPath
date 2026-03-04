import { NextResponse } from "next/server";
import { generateWithAI } from "@/config/AiModel";
import db from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const PromptTemplate = `You are an elite Instructional Designer. Your objective is to architect a world-class, premium learning curriculum.

### 1. THE LEARNER'S PROFILE:
* Course Target: {courseName}
* Learner's Goal: {courseDescription}
* Category: {category}
* Difficulty: {difficultyLevel}
* Modules: {numberOfModules}
* Video: {includeLectures}

### 2. PEDAGOGY GUIDELINES:
* IF BEGINNER: Focus on foundational analogies and quick wins. 
* IF INTERMEDIATE: Focus on industry tooling and best practices.
* IF ADVANCED: Dive straight into complex architecture and system design.
* You MUST generate exactly {numberOfModules} chapters.
* Frame chapterNames and topics as active, exciting achievements.

### 3. OUTPUT CONSTRAINTS (CRITICAL):
You must respond STRICTLY with valid JSON. Do not include markdown formatting blocks.

EXPECTED EXACT JSON STRUCTURE:
{
  "course": {
    "name": "Catchy premium title",
    "description": "Compelling 2-sentence hook",
    "chapters": [
      {
        "chapterName": "Name of the chapter",
        "duration": "Scale based on difficulty",
        "topics": ["Topic 1", "Topic 2"]
      }
    ]
  }
}`;

export async function POST(req: Request) {
    const body = await req.json();
    const { cid, courseName, courseDescription, category, difficultyLevel, numberOfModules, includeLectures } = body;

    try {
        // 1. Fetch Unsplash Image
        let finalImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1080&auto=format&fit=crop"; 
        try {
            const searchQuery = encodeURIComponent(`${category} technology`);
            const unsplashResponse = await fetch(
                `https://api.unsplash.com/photos/random?query=${searchQuery}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
            );
            if (unsplashResponse.ok) {
                const unsplashData = await unsplashResponse.json();
                finalImageUrl = unsplashData.urls.regular;
            }
        } catch (imageErr) { console.error("Unsplash error:", imageErr); }

        // 2. Prepare AI Prompt
        const finalPrompt = PromptTemplate
            .replaceAll("{courseName}", courseName || "")
            .replaceAll("{courseDescription}", courseDescription || "")
            .replaceAll("{category}", category || "")
            .replaceAll("{difficultyLevel}", difficultyLevel || "")
            .replaceAll("{numberOfModules}", String(numberOfModules || 5))
            .replaceAll("{includeLectures}", String(includeLectures || false));

        // 3. Generate AI Content
        const rawText = await generateWithAI(finalPrompt);
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const courseJson = JSON.parse(cleanJson);

        // 4. Update Database to 'ready'
        await db.update(coursesTable)
            .set({ 
                courseJson: courseJson,
                bannerImage: finalImageUrl,
                status: 'ready' 
            })
            .where(eq(coursesTable.cid, cid));

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Worker failed:", e);
        // 5. Mark as failed so UI can notify user
        await db.update(coursesTable).set({ status: 'failed' }).where(eq(coursesTable.cid, cid));
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}