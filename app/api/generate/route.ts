// This API route handles AI content generation

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { generateContent } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get request body
    const body = await request.json()
    const { prompt, contentType, chatId } = body
    
    // Validate input
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }
    
    let currentChatId = chatId
    
    // Create new chat if no chatId provided
    if (!currentChatId) {
      const newChat = await db.chat.create({
        data: {
          userId: session.user.id,
          title: prompt.slice(0, 50) + (prompt.length > 50 ? "..." : ""),
        }
      })
      currentChatId = newChat.id
    }
    
    // Save user message
    const userMessage = await db.message.create({
      data: {
        chatId: currentChatId,
        content: prompt,
        role: "USER",
        contentType: contentType || "GENERAL",
      }
    })
    
    // Generate AI response
    const aiResponse = await generateContent(prompt, contentType)
    
    // Save AI message
    const aiMessage = await db.message.create({
      data: {
        chatId: currentChatId,
        content: aiResponse,
        role: "ASSISTANT",
        contentType: contentType || "GENERAL",
      }
    })
    
    // Update chat's updatedAt
    await db.chat.update({
      where: { id: currentChatId },
      data: { updatedAt: new Date() }
    })
    
    // Return both messages and chatId
    return NextResponse.json({
      chatId: currentChatId,
      userMessage,
      aiMessage,
    })
    
  } catch (error) {
    console.error("Generate API error:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}