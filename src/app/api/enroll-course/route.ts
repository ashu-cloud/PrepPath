import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, chaptersContentTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { sourceCid } = await req.json();
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = user.primaryEmailAddress.emailAddress;

        // 1. Fetch the original course
        const [sourceCourse] = await db.select().from(coursesTable).where(eq(coursesTable.cid, sourceCid));
        if (!sourceCourse) return NextResponse.json({ error: "Source course not found" }, { status: 404 });

        // 2. Check if user already has an EXACT copy (optional, prevents spam)
        // You can skip this if you want users to be able to enroll multiple times.

        // 3. Create a NEW unique ID for the user's version
        const newUserCid = uuidv4();

        // 4. Duplicate the Course Header
        const { id: _courseId, ...courseData } = sourceCourse;
        await db.insert(coursesTable).values({
            ...courseData,
            cid: newUserCid,
            userEmail: userEmail,
            isCloned: true, 
        });

        // 5. Duplicate the Chapter Content (so the user doesn't have to re-bake them)
        const sourceChapters = await db.select().from(chaptersContentTable).where(eq(chaptersContentTable.cid, sourceCid));
        
        if (sourceChapters.length > 0) {
            const newChapters = sourceChapters.map(ch => {
                const { id: _chId, ...chData } = ch;
                return {
                    ...chData,
                    cid: newUserCid,
                    isCompleted: false // Reset progress for the new user
                };
            });
            await db.insert(chaptersContentTable).values(newChapters);
        }

        return NextResponse.json({ newCid: newUserCid });
    } catch (error) {
        console.error("Enrollment Error:", error);
        return NextResponse.json({ error: "Failed to enroll in course" }, { status: 500 });
    }
}