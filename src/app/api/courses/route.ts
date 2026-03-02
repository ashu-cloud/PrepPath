import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

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
            const result = await db.select().from(coursesTable)
                .where(eq(coursesTable.userEmail, email)); // <-- Update this to userEmail
                
            // Return the full array of courses
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: "Missing courseId or email" }, { status: 400 });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}