import { NextResponse } from "next/server";
import db from "@/config/db"; 
import { coursesTable } from "@/config/schema"; 
import { desc, eq } from "drizzle-orm"; // Add eq

export async function GET() {
    try {
        
        const allCourses = await db.select()
            .from(coursesTable)
            .where(eq(coursesTable.isCloned, false)) 
            .orderBy(desc(coursesTable.id));

        return NextResponse.json(allCourses);
    } catch (error) {
        console.error("Explore API Error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}