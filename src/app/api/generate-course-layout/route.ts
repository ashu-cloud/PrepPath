import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, enrollmentsTable } from "@/config/schema"; 
import { ilike } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from 'cloudinary';
import { generateWithFallback } from "@/config/ai-provider";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const Prompt = `You are an expert Instructional Designer building a personalized course curriculum.

### LEARNER PROFILE:
- Topic: {courseName}
- Goal: {courseDescription}
- Category: {category}
- Level: {difficultyLevel}
- Number of chapters: {numberOfModules}
- Include video suggestions: {includeLectures}

### PERSONALIZATION RULES (CRITICAL):
- BEGINNER: Assume zero prior knowledge. Start from first principles. Use analogies. Build confidence with quick wins.
- INTERMEDIATE: Assume the learner knows the basics. DO NOT explain fundamentals. Jump straight to real-world patterns, industry tooling, and best practices.
- ADVANCED: Assume strong working knowledge. Skip all introductory content. Focus exclusively on edge cases, system design, performance, and production concerns.

The curriculum must respect the learner's level. An advanced learner should never see a chapter they already know.

### OUTPUT RULES:
- Generate EXACTLY {numberOfModules} chapters. No more, no less.
- Respond with VALID JSON only. No markdown. No backticks. No prose before or after.
- Do not use unescaped quotes inside string values.

### REQUIRED JSON STRUCTURE:
{
  "course": {
    "name": "A specific, compelling course title",
    "description": "Two sentences: what this course teaches and what the learner can do after completing it.",
    "category": "{category}",
    "level": "{difficultyLevel}",
    "includeVideo": {includeLectures},
    "noOfChapters": {numberOfModules},
    "chapters": [
      {
        "chapterName": "Specific, outcome-oriented chapter title",
        "about": "One sentence describing exactly what this chapter covers and why it matters at this level.",
        "duration": "Estimated time to complete (e.g., 45 Minutes, 1.5 Hours)",
        "topics": [
          "Specific topic 1",
          "Specific topic 2",
          "Specific topic 3"
        ]
      }
    ]
  }
}`

export const POST = async (req: Request) => {
    try {
        const formData = await req.json();
        const { userId } = await auth();
        const user = await currentUser();
        
        console.log("CLERK USER ID:", userId);
        console.log("CLERK EMAIL:", user?.primaryEmailAddress?.emailAddress);

        if (!userId) {
            return NextResponse.json({ error: "Clerk did not send a session cookie to the backend." }, { status: 401 });
        }
        
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "User is logged in, but has no primary email address." }, { status: 401 });
        }

        const safeUserEmail = user.primaryEmailAddress.emailAddress;

        // Check for existing course to prevent duplicates
        const existingCourse = await db
            .select()
            .from(coursesTable)
            .where(ilike(coursesTable.name, formData.courseName))
            .limit(1);

        if (existingCourse.length > 0) {
            return NextResponse.json(
                { error: "A course with this exact name already exists." }, 
                { status: 409 }
            );
        }

        // Build prompt from template (cap modules at 10)
        const safeModules = Math.min(Math.max(Number(formData.numberOfModules) || 5, 1), 10);
        const finalPrompt = Prompt
            .replaceAll("{courseName}", formData.courseName || "General Topic")
            .replaceAll("{courseDescription}", formData.courseDescription || "")
            .replaceAll("{category}", formData.category || "Technology")
            .replaceAll("{difficultyLevel}", formData.difficultyLevel || "Beginner")
            .replaceAll("{numberOfModules}", String(safeModules))
            .replaceAll("{includeLectures}", String(formData.includeLectures || false));

        // Generate course layout with AI (multi-key Gemini + Groq fallback)
        const { text: aiResponseText, provider } = await generateWithFallback({
            prompt: finalPrompt,
            jsonMode: true,
            systemMsg: "You are an expert Instructional Designer. Respond with valid JSON only. No markdown, no code fences, no prose outside the JSON.",
            geminiConfig: { responseMimeType: "application/json" },
        });
        console.log(`Course layout generated via ${provider}`);

        let generatedCourse;
        try {
            let cleanJsonText = aiResponseText.replace(/```json/g, "").replace(/```/g, "");
            generatedCourse = JSON.parse(cleanJsonText);
        } catch (parseError) {
            console.log("BROKEN JSON RESPONSE FROM AI:", aiResponseText);
            throw new Error("The AI generated invalid course data. Please click Generate again.");
        }

       let finalImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1080&auto=format&fit=crop"; 

        try {
            const searchQuery = encodeURIComponent(`${formData.category} technology`);
            const unsplashResponse = await fetch(
                `https://api.unsplash.com/photos/random?query=${searchQuery}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
            );

            if (unsplashResponse.ok) {
                const unsplashData = await unsplashResponse.json();
                finalImageUrl = unsplashData.urls.regular; 
                console.log("✅ Successfully grabbed Unsplash image:", finalImageUrl);
            } else {
                console.warn("⚠️ Unsplash API missed, using default fallback image.");
            }

        } catch (imageError) {
            console.error("⚠️ Unsplash fetch error:", imageError);
        }

        const newCid = uuidv4();

        // 1. Insert into courses table
        const [insertedCourse] = await db.insert(coursesTable).values({
            cid: newCid, 
            name: formData.courseName,
            description: formData.courseDescription || "",
            numberOfModules: Number(formData.numberOfModules),
            difficultyLevel: formData.difficultyLevel,
            category: formData.category,
            includeVideo: Boolean(formData.includeLectures),
            courseJson: aiResponseText, 
            userEmail: safeUserEmail, 
            bannerImage: finalImageUrl, 
            status: 'ready' // Marking as ready since we are generating synchronously
        }).returning();

        // 2. 🚀 NEW: Auto-enroll the creator!
        await db.insert(enrollmentsTable).values({
            userEmail: safeUserEmail,
            courseCid: newCid
        });

        return NextResponse.json({
            dbId: insertedCourse.id,
            cid: insertedCourse.cid,
            ...generatedCourse
        }, { status: 200 });

    } catch (error: any) {
        console.error("Course Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate course. Please try again." }, 
            { status: 500 }
        );
    }
}