import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; 
import { coursesTable } from "@/config/schema"; 
import { desc, isNotNull, sql } from "drizzle-orm"; 

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const offset = (page - 1) * PAGE_SIZE;

        const [courses, countResult] = await Promise.all([
            db.select()
                .from(coursesTable)
                .where(isNotNull(coursesTable.courseJson))
                .orderBy(desc(coursesTable.id))
                .limit(PAGE_SIZE)
                .offset(offset),
            db.select({ count: sql<number>`count(*)` })
                .from(coursesTable)
                .where(isNotNull(coursesTable.courseJson)),
        ]);

        const total = Number(countResult[0]?.count ?? 0);

        const res = NextResponse.json({
            courses,
            page,
            pageSize: PAGE_SIZE,
            total,
            hasMore: offset + courses.length < total,
        });

        // Cache for 30s in browser, allow CDN to serve stale while revalidating
        res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
        return res;
    } catch (error) {
        console.error("Explore API Error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}