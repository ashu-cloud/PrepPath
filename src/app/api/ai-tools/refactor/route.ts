import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
    try {
        const { code, language } = await req.json();

        const prompt = `You are an expert senior software engineer. Refactor the following ${language} code for better performance, readability, and industry best practices. 
        
        CODE TO REFACTOR:
        ${code}

        RESPONSE FORMAT:
        Return your response in a clear format:
        1. The Refactored Code (wrapped in markdown code blocks).
        2. A list of specific improvements made.
        3. Complexity analysis (Time and Space).`;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return NextResponse.json({ result: result.text });
    } catch (error) {
        console.error("Refactor API Error:", error);
        return NextResponse.json({ error: "Failed to refactor code" }, { status: 500 });
    }
}