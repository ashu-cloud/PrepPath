import { NextResponse } from "next/server";
import db from "@/config/db"; 
import { coursesTable } from "@/config/schema"; 
import { desc, isNotNull } from "drizzle-orm"; 

export const revalidate = 30; 

export async function GET() {
    try {
        const allCourses = await db.select()
            .from(coursesTable)
            .where(isNotNull(coursesTable.courseJson)) 
            .orderBy(desc(coursesTable.id));

        return NextResponse.json(allCourses);
    } catch (error) {
        console.error("Explore API Error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}