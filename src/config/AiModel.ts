import { GoogleGenAI } from "@google/genai";

// 1. Get your API Key from https://aistudio.google.com/
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey });

// 2. Configure the model
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json", // Forces the AI to return valid JSON
};

// 3. Export a helper that sends a prompt and returns the response text
export async function generateWithAI(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: generationConfig,
  });
  return response.text ?? "";
}