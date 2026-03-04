import { NextResponse } from "next/server";
import db from "@/config/db";
import { chaptersContentTable, chapterProgressTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const { userId } = await auth();
        const user = await currentUser();

        if (!courseId) return NextResponse.json({ error: "Missing CID" }, { status: 400 });
        if (!userId || !user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = user.primaryEmailAddress.emailAddress;

        // 🚀 THE CRITICAL FIX: Left Join the progress table
        const lessons = await db.select({
            id: chaptersContentTable.id,
            chapterId: chaptersContentTable.chapterId,
            content: chaptersContentTable.content,
            videoId: chaptersContentTable.videoId,
            // Select the completion status from the progress table
            isCompleted: chapterProgressTable.isCompleted 
        })
        .from(chaptersContentTable)
        .leftJoin(
            chapterProgressTable, 
            and(
                eq(chapterProgressTable.courseCid, courseId),
                eq(chapterProgressTable.userEmail, userEmail),
                eq(chapterProgressTable.chapterId, chaptersContentTable.chapterId)
            )
        )
        .where(eq(chaptersContentTable.cid, courseId))
        .orderBy(chaptersContentTable.chapterId);

        // Standardize the boolean value (handle nulls from the Left Join)
        const standardizedLessons = lessons.map(lesson => ({
            ...lesson,
            isCompleted: !!lesson.isCompleted // Force to true/false
        }));

        const res = NextResponse.json(standardizedLessons);
        // Short cache — lessons rarely change, but progress can update
        res.headers.set("Cache-Control", "private, max-age=10, stale-while-revalidate=30");
        return res;
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}