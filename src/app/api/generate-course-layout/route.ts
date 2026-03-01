import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import db from "@/conifg/db"; // Note: Ensure this folder is actually named 'conifg' and not 'config'
import { couresesTable } from "@/conifg/schema";
import { ilike } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const Prompt = `You are an elite Instructional Designer and Subject Matter Expert from a top-tier tech academy. Your objective is to architect a world-class, premium learning curriculum that is HYPER-PERSONALIZED to the user's exact profile, industry, and skill level.

### 1. THE LEARNER'S PROFILE:
* Course Target: {courseName}
* Learner's Goal/Description: {courseDescription}
* Industry/Category: {category}
* Target Difficulty: {difficultyLevel}
* Requested Modules: {numberOfModules}
* Requires Video/Lectures: {includeLectures}

### 2. ELITE PEDAGOGY GUIDELINES (STRICT ADHERENCE REQUIRED):
* **Difficulty Calibration (Crucial):**
  - IF BEGINNER: Focus on foundational analogies, "the why," and quick wins. Strip away intimidating jargon. 
  - IF INTERMEDIATE: Bridge theory and practice. Focus on industry tooling, best practices, and building complete features.
  - IF ADVANCED: Skip the basics entirely. Dive straight into complex architecture, edge cases, system design, and performance optimization.
* **Industry Context:** Ensure all \`topics\` and chapter titles are deeply relevant to the "{category}" industry. Use real-world scenarios (e.g., if category is Finance, use topics like "Building a Real-Time Ticker" rather than "Using WebSockets").
* **Constraint Matching:** You MUST generate exactly {numberOfModules} chapters. Distribute the cognitive load logically across this exact number.
* **Action-Oriented Milestones:** Frame \`chapterName\` and \`topics\` as active, exciting achievements. (e.g., Use "Architecting Scalable Global State" instead of just "State Management").
* **The Capstone Effect:** The final chapter must be a practical, real-world project that synthesizes everything learned in the previous modules.

### 3. BANNER IMAGE INSTRUCTIONS:
Generate a highly detailed \`bannerImagePrompt\` using this exact template:
"A highly polished, premium 3D isometric illustration representing {courseName}. Include sleek modern UI/UX elements, glowing tech accents, and creative tools relevant to the {category} industry. The color palette should be deep dark mode backgrounds (#13131a) with vibrant glowing accents of violet, purple, and cyan. The image must look highly technical, cinematic, and inspiring, perfectly suited for a(n) {difficultyLevel} audience."

### 4. OUTPUT CONSTRAINTS (SYSTEM CRITICAL):
You must respond STRICTLY with valid JSON matching the exact schema below. Do not include markdown formatting blocks (like \`\`\`json), conversational text, or explanations. Failure to provide raw JSON will crash the application.

### SCHEMA:
{
  "course": {
    "name": "string (A catchy, premium title based on the input)",
    "description": "string (A compelling 2-sentence hook selling the outcome of the course)",
    "category": "{category}",
    "level": "{difficultyLevel}",
    "includeVideo": {includeLectures},
    "noOfChapters": {numberOfModules},
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string (e.g., '2 Hours', '45 Mins' - scale based on difficulty)",
        "topics": [
          "string"
        ]
      }
    ]
  }
}`

export const POST = async (req: Request) => {
    try {
        const formData = await req.json();
        const user = await currentUser();
        

        // 🛑 AUTH GUARD: Prevent the Foreign Key Crash
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in to generate a course." }, 
                { status: 401 }
            );
        }

        const safeUserEmail = user.primaryEmailAddress.emailAddress;

        // Check for existing course to prevent duplicates
        const existingCourse = await db
            .select()
            .from(couresesTable)
            .where(ilike(couresesTable.name, formData.courseName))
            .limit(1);

        if (existingCourse.length > 0) {
            return NextResponse.json(
                { error: "A course with this exact name already exists." }, 
                { status: 409 }
            );
        }

        // Initialize AI
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

        // Use replaceAll to ensure all template tags are filled
        const finalPrompt = Prompt
            .replaceAll("{courseName}", formData.courseName || "General Topic")
            .replaceAll("{courseDescription}", formData.courseDescription || "")
            .replaceAll("{category}", formData.category || "Technology")
            .replaceAll("{difficultyLevel}", formData.difficultyLevel || "Beginner")
            .replaceAll("{numberOfModules}", String(formData.numberOfModules || 5))
            .replaceAll("{includeLectures}", String(formData.includeLectures || false));

        // Generate Content
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: finalPrompt,
            config: {
                responseMimeType: "application/json", 
            }
        });

        if (!response.text) {
            throw new Error("The AI returned an empty response.");
        }

        const generatedCourse = JSON.parse(response.text);

       let finalImageUrl = ""; // We will save this URL to your Neon DB

        try {
            // 1. Ask Gemini to generate the image
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-001',
                prompt: generatedCourse.course.bannerImagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: "image/jpeg",
                    aspectRatio: "16:9",
                }
            });

            const rawBase64 = imageResponse.generatedImages?.[0].image?.imageBytes;
            
            // 2. Format it properly for Cloudinary
            const base64DataUri = `data:image/jpeg;base64,${rawBase64}`;

            // 3. Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(base64DataUri, {
                folder: "preppath_courses", // Keeps your Cloudinary dashboard organized
            });

            // 4. Extract the secure URL!
            finalImageUrl = uploadResult.secure_url;
            console.log("✅ Image successfully uploaded to Cloudinary:", finalImageUrl);

        } catch (imageError) {
            console.error("⚠️ Image generation or upload failed:", imageError);
            finalImageUrl = "https://your-default-placeholder-image-url.com/placeholder.jpg"; 
        }

        // Insert into database
        const [insertedCourse] = await db.insert(couresesTable).values({
          
            cid: uuidv4(), 
            
            name: formData.courseName,
            description: formData.courseDescription || "",
            numberOfModules: Number(formData.numberOfModules),
            difficultyLevel: formData.difficultyLevel,
            category: formData.category,
            includeVideo: Boolean(formData.includeLectures),
            courseJson: response.text, 
            
            userEmail: safeUserEmail, 
            bannerImage: finalImageUrl, // Save the Cloudinary URL to your database
        }).returning();

        return NextResponse.json({
            dbId: insertedCourse.id,
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