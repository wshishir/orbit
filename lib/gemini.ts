
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Get the model - using Gemini Pro
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

// Content type prompts
const contentTypePrompts = {
  ARTICLE: "Write a detailed, well-structured article about: ",
  REPORT: "Create a professional report with clear sections about: ",
  LINKEDIN_POST: "Write an engaging LinkedIn post (keep it professional, under 1300 characters) about: ",
  TWEET: "Write a concise, engaging tweet (max 280 characters) about: ",
  GENERAL: "Please help with: ",
}

// Function to generate content
export async function generateContent(
  prompt: string,
  contentType: keyof typeof contentTypePrompts = "GENERAL"
) {
  try {
    // Combine the content type instruction with user prompt
    const fullPrompt = contentTypePrompts[contentType] + prompt
    
    // Generate content
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error) {
    console.error("Gemini API error:", error)
    throw new Error("Failed to generate content")
  }
}

export async function generateContentStream(
  prompt: string,
  contentType: keyof typeof contentTypePrompts = "GENERAL"
) {
  const fullPrompt = contentTypePrompts[contentType] + prompt
  
  const result = await model.generateContentStream(fullPrompt)
  
  return result.stream
}