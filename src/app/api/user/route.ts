import { NextResponse } from "next/server";
import { usersTable, chapterProgressTable, enrollmentsTable, coursesTable } from "@/config/schema";
import db from "@/config/db";
import { eq, and, inArray } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // 1. Check/Create User
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!user || user.length === 0) {
            await db.insert(usersTable).values({ name, email }).returning();
        }

        // 2. Fetch User Stats for Profile
        const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.userEmail, email));
        const courseCids = enrollments.map(e => e.courseCid);

        let totalModules = 0;
        let completedModules = 0;

        if (courseCids.length > 0) {
            // Calculate Total Modules
            const courses = await db.select().from(coursesTable).where(inArray(coursesTable.cid, courseCids));
            totalModules = courses.reduce((acc, c) => acc + (c.numberOfModules || 0), 0);

            // Calculate Completed Modules
            const progress = await db.select().from(chapterProgressTable).where(
                and(
                    eq(chapterProgressTable.userEmail, email),
                    eq(chapterProgressTable.isCompleted, true)
                )
            );
            completedModules = progress.length;
        }

        const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return NextResponse.json({ 
            user: user[0],
            stats: {
                totalCourses: enrollments.length,
                totalModules,
                completedModules,
                overallProgress
            }
        });
    } catch (err) {
        return NextResponse.json({ message: "Error syncing profile", error: (err as Error).message }, { status: 500 });
    }
}