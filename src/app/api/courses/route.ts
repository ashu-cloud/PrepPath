import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, chaptersContentTable } from "@/config/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const email = searchParams.get("email");

    try {
        // Scenario 1: Fetching a single course for the Edit/Study Page
        if (courseId) {
            // support legacy numeric ids as well as the UUID-based `cid`
            let result;
            if (/^[0-9]+$/.test(courseId)) {
                result = await db.select().from(coursesTable)
                    .where(eq(coursesTable.id, Number(courseId)));
            } else {
                result = await db.select().from(coursesTable)
                    .where(eq(coursesTable.cid, courseId));
            }

            if (result.length === 0) {
                return NextResponse.json({ error: "Course not found" }, { status: 404 });
            }
            // Return the single object
            return NextResponse.json(result[0]);
        }

        // Scenario 2: Fetching ALL courses for the user's Dashboard
        if (email) {
            // 1. Fetch all courses for this user
            const courses = await db.select().from(coursesTable)
                .where(eq(coursesTable.userEmail, email)); 
                
            if (courses.length === 0) return NextResponse.json([]);

            // 2. Fetch all generated chapters for these courses
            const courseIds = courses.map(c => c.cid);
            const allChapters = await db.select().from(chaptersContentTable)
                .where(inArray(chaptersContentTable.cid, courseIds));

            // 3. Calculate the progress percentage for each course
            // Replace lines 51-76 in src/app/api/courses/route.ts with this:

            const enrichedCourses = courses.map(course => {
                let totalChapters = 0;
                
                // 1. Get the planned total from the JSON
                try {
                    const jsonData: any = course.courseJson;
                    if (typeof jsonData === 'string') {
                        const cleanedJson = jsonData.replace(/```json/g, '').replace(/```/g, '').trim();
                        const parsed = JSON.parse(cleanedJson);
                        totalChapters = parsed?.course?.chapters?.length || course.numberOfModules || 0;
                    } else {
                        totalChapters = jsonData?.course?.chapters?.length || course.numberOfModules || 0;
                    }
                } catch (e) {
                    totalChapters = course.numberOfModules || 0;
                }

                // 2. SMART COUNT: Only count UNIQUE chapter IDs that are completed
                // This prevents the "200% bug" if you have duplicate records in the database
                const completedChapterIds = new Set(
                    allChapters
                        .filter(ch => ch.cid === course.cid && ch.isCompleted)
                        .map(ch => ch.chapterId)
                );
                
                const completedCount = completedChapterIds.size;
                
                // 3. Ensure we never exceed 100%
                let progress = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
                if (progress > 100) progress = 100;

                return {
                    ...course,
                    progress 
                };
            });
            return NextResponse.json(enrichedCourses);
        }

        return NextResponse.json({ error: "Missing courseId or email" }, { status: 400 });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}