import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Neural link key missing. Protocol offline." }, { status: 500 });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an elite, highly logical mentor for an 18-year-old ICS student preparing for Lahore Board exams. 
    Expertise: C Programming and Physics. 
    Style: Keep answers extremely brief and elegant. Guide logic; do not give direct answers to puzzles. 
    Persona: Professional, encouraging, and focused.`;

    const lastMessage = messages[messages.length - 1].content;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `User: ${lastMessage}` }
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Focus field interrupted. AI unable to assist." }, { status: 500 });
  }
}