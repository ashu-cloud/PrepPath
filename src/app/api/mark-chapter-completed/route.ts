import { NextResponse } from "next/server";
import db from "@/config/db"; // (Update to "@/conifg/db" if your folder has the typo!)
import { chaptersContentTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { courseId, chapterId } = await req.json();

        if (!courseId || chapterId == null) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Update the specific chapter to isCompleted = true
        await db.update(chaptersContentTable)
            .set({ isCompleted: true })
            .where(and(
                eq(chaptersContentTable.cid, courseId),
                eq(chaptersContentTable.chapterId, chapterId)
            ));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Failed to mark completed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}