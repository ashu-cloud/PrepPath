import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, enrollmentsTable } from "@/config/schema"; // Ensure enrollmentsTable is imported
import { ilike } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const Prompt = `You are an elite Instructional Designer. Your objective is to architect a world-class, premium learning curriculum.

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
You must respond STRICTLY with valid JSON. Do not include markdown formatting blocks (like \`\`\`json). Do not use unescaped quotation marks inside your strings. Failure to provide perfectly formatted JSON will crash the application.

EXPECTED EXACT JSON STRUCTURE:
{
  "course": {
    "name": "Catchy premium title",
    "description": "Compelling 2-sentence hook",
    "category": "{category}",
    "level": "{difficultyLevel}",
    "includeVideo": {includeLectures},
    "noOfChapters": {numberOfModules},
    "chapters": [
      {
        "chapterName": "Name of the chapter",
        "duration": "Scale based on difficulty (e.g., 2 Hours)",
        "topics": [
          "Topic 1",
          "Topic 2"
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

        // Initialize AI and guard API key
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
        }
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        // Use replaceAll to ensure all template tags are filled
        const finalPrompt = Prompt
            .replaceAll("{courseName}", formData.courseName || "General Topic")
            .replaceAll("{courseDescription}", formData.courseDescription || "")
            .replaceAll("{category}", formData.category || "Technology")
            .replaceAll("{difficultyLevel}", formData.difficultyLevel || "Beginner")
            .replaceAll("{numberOfModules}", String(formData.numberOfModules || 5))
            .replaceAll("{includeLectures}", String(formData.includeLectures || false));

        // Generate Content with retry/backoff for transient failures
        const maxAttempts = 3;
        let response: any = null;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                response = await ai.models.generateContent({
                    model: process.env.GEMINI_CONTENT_MODEL || "gemini-2.5-flash",
                    contents: finalPrompt,
                    config: { responseMimeType: "application/json" }
                });
                if (!response || !response.text) {
                    throw new Error("Empty AI response");
                }
                break; // success
            } catch (gErr: any) {
                console.warn(`AI request attempt ${attempt} failed:`, gErr?.message || gErr);
                const isQuota = gErr?.status === 429 || gErr?.code === 429 || String(gErr?.message).includes('QuotaFailure') || String(gErr?.message).toLowerCase().includes('rate limit');
                if (isQuota) {
                    return NextResponse.json({ error: 'AI quota exceeded, try again later.' }, { status: 429 });
                }
                if (attempt === maxAttempts) throw gErr;
                const delayMs = 1000 * Math.pow(2, attempt);
                await new Promise((r) => setTimeout(r, delayMs));
            }
        }

        let generatedCourse;
        try {
            let cleanJsonText = response.text.replace(/```json/g, "").replace(/```/g, "");
            generatedCourse = JSON.parse(cleanJsonText);
        } catch (parseError) {
            console.log("🔥 BROKEN JSON RESPONSE FROM AI:", response.text);
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
            courseJson: response.text, 
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