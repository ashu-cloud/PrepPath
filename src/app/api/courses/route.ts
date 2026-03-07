import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, enrollmentsTable, chapterProgressTable } from "@/config/schema";
import { eq, inArray, and } from "drizzle-orm"; 

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const email = searchParams.get("email");

    try {
        // --- 1. HANDLE SINGLE COURSE FETCH (For Study Page) ---
        if (courseId) {
            let result;
            if (/^[0-9]+$/.test(courseId)) {
                result = await db.select().from(coursesTable).where(eq(coursesTable.id, Number(courseId)));
            } else {
                result = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId));
            }
            if (result.length === 0) return NextResponse.json({ error: "Course not found" }, { status: 404 });
            const res = NextResponse.json(result[0]);
            // Public course data — cache for 60s, serve stale while revalidating
            res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
            return res;
        }

        // --- 2. HANDLE ALL USER COURSES FETCH (For Dashboard & My Learning) ---
        if (email) {
            // A. Fetch courses the user CREATED
            const createdCourses = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, email));
            const createdCids = createdCourses.map(c => c.cid);

            // B. Fetch courses the user ENROLLED in
            const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.userEmail, email));
            const enrolledCids = enrollments.map(e => e.courseCid);

            // C. Combine and remove duplicates
            const allRelevantCids = Array.from(new Set([...createdCids, ...enrolledCids]));

            if (allRelevantCids.length === 0) return NextResponse.json([]);

            // D. Fetch actual course data for all relevant CIDs
            const courses = await db.select().from(coursesTable).where(inArray(coursesTable.cid, allRelevantCids));
            
            // E. Fetch user's completion progress for these courses
            const userProgress = await db.select().from(chapterProgressTable).where(
                and(
                    eq(chapterProgressTable.userEmail, email),
                    inArray(chapterProgressTable.courseCid, allRelevantCids)
                )
            );

            // F. Calculate progress percentages
            const enrichedCourses = courses.map(course => {
                let totalChapters = 0;
                try {
                    const jsonData: any = course.courseJson;
                    if (typeof jsonData === 'string') {
                        const parsed = JSON.parse(jsonData.replace(/```json/g, '').replace(/```/g, '').trim());
                        totalChapters = parsed?.course?.chapters?.length || course.numberOfModules || 0;
                    } else {
                        totalChapters = jsonData?.course?.chapters?.length || course.numberOfModules || 0;
                    }
                } catch { 
                    totalChapters = course.numberOfModules || 0; 
                }

                // Count completed chapters for this specific course
                const completedChapterIds = new Set(
                    userProgress.filter(p => p.courseCid === course.cid && p.isCompleted).map(p => p.chapterId)
                );
                
                let progress = totalChapters > 0 ? Math.round((completedChapterIds.size / totalChapters) * 100) : 0;
                if (progress > 100) progress = 100;

                return { 
                    ...course, 
                    progress,
                    // If the creator's email doesn't match the logged-in email, it's an enrolled course!
                    isCloned: course.userEmail !== email 
                };
            });

            // Sort by most recently interacted/created (newest first)
            enrichedCourses.reverse();

            const res = NextResponse.json(enrichedCourses);
            // User-specific — private cache, short TTL
            res.headers.set("Cache-Control", "private, max-age=10, stale-while-revalidate=30");
            return res;
        }

        return NextResponse.json({ error: "Missing courseId or email" }, { status: 400 });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}