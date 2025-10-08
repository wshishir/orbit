// This API route handles AI content generation

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { generateContentStream } from "@/lib/gemini"
import { google } from "@ai-sdk/google";

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

    // Get streaming response
    const stream = await generateContentStream(prompt, contentType)

    let fullText = ""

    // Create a ReadableStream for the response
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'init',
              chatId: currentChatId,
              userMessage
            })}\n\n`)
          )

          // Stream the AI response chunks
          for await (const chunk of stream) {
            const text = chunk.text()
            fullText += text
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'chunk',
                text
              })}\n\n`)
            )
          }

          // Save the complete AI message to database
          const aiMessage = await db.message.create({
            data: {
              chatId: currentChatId,
              content: fullText,
              role: "ASSISTANT",
              contentType: contentType || "GENERAL",
            }
          })

          await db.chat.update({
            where: { id: currentChatId },
            data: { updatedAt: new Date() }
          })

          // Send completion message
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'done',
              aiMessage
            })}\n\n`)
          )

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
    
  } catch (error) {
    console.error("Generate API error:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}