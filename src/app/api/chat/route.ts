import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Neural link key missing. Protocol offline.");
      return NextResponse.json({ error: "Gemini API key is not configured locally." }, { status: 500 });
    }

    // Initialize inside handler for robustness
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using modern systemInstruction for version 0.24.1+
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash",
      systemInstruction: "You are an elite, highly logical mentor for an 18-year-old ICS student preparing for Lahore Board exams. Expertise: C Programming and Physics. Style: Keep answers extremely brief and elegant. Guide logic; do not give direct answers to puzzles. Persona: Professional, encouraging, and focused."
    });

    const chatHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message || error);
    
    // Provide more specific error messages for local debugging
    let errorMessage = "Focus field interrupted. AI unable to assist.";
    if (error.message?.includes("API key")) {
      errorMessage = "Invalid API Key. Please check your .env.local file.";
    } else if (error.message?.includes("block")) {
      errorMessage = "Request blocked by safety filters or region restrictions.";
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: error.message 
    }, { status: 500 });
  }
}