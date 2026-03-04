import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, chaptersContentTable, enrollmentsTable, chapterProgressTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cid = searchParams.get('cid');
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !cid || !user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized or missing ID" }, { status: 400 });
        }

        const userEmail = user.primaryEmailAddress.emailAddress;

        // Check if the user is the CREATOR of this course
        const course = await db.select()
            .from(coursesTable)
            .where(eq(coursesTable.cid, cid))
            .limit(1);

        const isCreator = course.length > 0 && course[0].userEmail === userEmail;

        if (isCreator) {
            // Creator: delete the entire course + content + all enrollments + all progress
            await db.delete(chapterProgressTable).where(eq(chapterProgressTable.courseCid, cid));
            await db.delete(enrollmentsTable).where(eq(enrollmentsTable.courseCid, cid));
            await db.delete(chaptersContentTable).where(eq(chaptersContentTable.cid, cid));
            await db.delete(coursesTable).where(eq(coursesTable.cid, cid));

            return NextResponse.json({ message: "Course deleted successfully" });
        } else {
            // Enrolled user: only remove their enrollment + their progress
            await db.delete(chapterProgressTable).where(
                and(
                    eq(chapterProgressTable.courseCid, cid),
                    eq(chapterProgressTable.userEmail, userEmail)
                )
            );
            await db.delete(enrollmentsTable).where(
                and(
                    eq(enrollmentsTable.courseCid, cid),
                    eq(enrollmentsTable.userEmail, userEmail)
                )
            );

            return NextResponse.json({ message: "Course removed from your library" });
  
        }
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}