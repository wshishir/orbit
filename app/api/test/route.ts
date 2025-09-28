// app/api/test-gemini/route.ts
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set" })
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const result = await model.generateContent("Say hello in one word")
    const response = await result.response
    const text = response.text()
    
    return NextResponse.json({ 
      success: true, 
      response: text,
      keyPresent: !!process.env.GEMINI_API_KEY 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      keyPresent: !!process.env.GEMINI_API_KEY
    })
  }
}