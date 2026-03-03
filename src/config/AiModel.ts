import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// 1. Get your API Key from https://aistudio.google.com/
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

// 2. Configure the model (Gemini 1.5 Flash is recommended for speed)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json", // Forces the AI to return valid JSON
};

// 3. Export the session for your Worker and Layout APIs
export const generateCourseLayoutAI = model.startChat({
  generationConfig,
  history: [],
});