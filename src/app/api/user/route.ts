import { NextResponse } from "next/server";
import { usersTable } from "@/conifg/schema";
import db from "@/conifg/db";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // check if user already exists
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (!user || user.length === 0) {
            const newUser = await db
                .insert(usersTable)
                .values({ name, email })
                .returning();

            return NextResponse.json({ message: "User created", user: newUser });
        } else {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
    } catch (err) {
        return NextResponse.json({ message: "Internal server error", error: (err as Error).message }, { status: 500 });
    }
}