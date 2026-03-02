import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, chaptersContentTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cid = searchParams.get('cid');
        const { userId } = await auth();

        if (!userId || !cid) {
            return NextResponse.json({ error: "Unauthorized or missing ID" }, { status: 400 });
        }

        // Delete the course content (lessons) first to maintain referential integrity
        await db.delete(chaptersContentTable).where(eq(chaptersContentTable.cid, cid));
        
        // Delete the main course record
        await db.delete(coursesTable).where(eq(coursesTable.cid, cid));

        return NextResponse.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}