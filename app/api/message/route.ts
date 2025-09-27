// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// POST - Create a new message in a chat
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { chatId, content, role, contentType } = body
    
    // Verify user owns this chat
    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      }
    })
    
    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      )
    }
    
    // Create the message
    const message = await db.message.create({
      data: {
        chatId,
        content,
        role,
        contentType: contentType || "GENERAL",
      }
    })
    
    // Update chat's updatedAt timestamp
    await db.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    })
    
    // Update chat title if it's the first user message
    if (role === "USER" && !chat.title) {
      const truncatedTitle = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      await db.chat.update({
        where: { id: chatId },
        data: { title: truncatedTitle }
      })
    }
    
    return NextResponse.json(message)
  } catch (error) {
    console.error("Failed to create message:", error)
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    )
  }
}