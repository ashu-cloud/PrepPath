import { NextResponse } from "next/server";
import db from "@/config/db";
import { chaptersContentTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    try {
        // 1. Verify the user is logged in
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Extract the courseId from the URL (e.g., ?courseId=123)
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        // 3. Query Neon for all lessons attached to this course
        const lessons = await db.select()
            .from(chaptersContentTable)
            .where(eq(chaptersContentTable.cid, courseId));

        return NextResponse.json(lessons, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
    }
}