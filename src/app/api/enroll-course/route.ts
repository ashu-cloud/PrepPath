// src/app/api/enroll-course/route.ts
import { NextResponse } from "next/server";
import db from "@/config/db";
import { coursesTable, enrollmentsTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { sourceCid } = await req.json();
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userEmail = user.primaryEmailAddress.emailAddress;

        // 1. Verify course exists
        const [course] = await db.select().from(coursesTable).where(eq(coursesTable.cid, sourceCid));
        if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

        // 2. Prevent duplicate enrollments for the same user
        const existingEnrollment = await db.select().from(enrollmentsTable)
            .where(and(
                eq(enrollmentsTable.userEmail, userEmail),
                eq(enrollmentsTable.courseCid, sourceCid)
            ));

        if (existingEnrollment.length > 0) {
            return NextResponse.json({ message: "Already enrolled", cid: sourceCid }, { status: 200 });
        }

        // 3. Insert ONLY a relationship record (Zero Redundancy)
        await db.insert(enrollmentsTable).values({
            userEmail: userEmail,
            courseCid: sourceCid,
        });

        return NextResponse.json({ newCid: sourceCid, message: "Successfully enrolled" });
    } catch (error) {
        console.error("Enrollment Error:", error);
        return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
    }
}