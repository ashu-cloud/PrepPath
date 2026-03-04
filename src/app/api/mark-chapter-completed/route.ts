import { NextResponse } from "next/server";
import db from "@/config/db"; 
import { chapterProgressTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache"; 

export async function POST(req: Request) {
    try {
        const { courseId, chapterId } = await req.json();
        
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!courseId || chapterId == null) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const userEmail = user.primaryEmailAddress.emailAddress;

        // 1. Update/Insert progress in DB
        const existingProgress = await db.select()
            .from(chapterProgressTable)
            .where(and(
                eq(chapterProgressTable.userEmail, userEmail),
                eq(chapterProgressTable.courseCid, courseId),
                eq(chapterProgressTable.chapterId, chapterId)
            ));

        if (existingProgress.length > 0) {
            await db.update(chapterProgressTable)
                .set({ isCompleted: true })
                .where(eq(chapterProgressTable.id, existingProgress[0].id));
        } else {
            await db.insert(chapterProgressTable).values({
                userEmail: userEmail,
                courseCid: courseId,
                chapterId: chapterId,
                isCompleted: true
            });
        }

        // 2. Revalidate cached pages so progress is reflected
        try {
            revalidatePath("/workspace");
            revalidatePath(`/workspace/study/${courseId}`);
        } catch (e) {
            console.error("Cache revalidation failed, but DB updated:", e);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Failed to mark completed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}