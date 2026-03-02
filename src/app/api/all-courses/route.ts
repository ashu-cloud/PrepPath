import { NextResponse } from "next/server";
import db from "@/config/db"; 
import { coursesTable } from "@/config/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        // Fetch every course in the DB, newest first
        const allCourses = await db.select().from(coursesTable)
            .orderBy(desc(coursesTable.id));

        return NextResponse.json(allCourses);
    } catch (error) {
        console.error("Explore API Error:", error);
        return NextResponse.json({ error: "Failed to fetch community courses" }, { status: 500 });
    }
}