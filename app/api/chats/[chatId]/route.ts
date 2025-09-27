// app/api/chats/[chatId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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
    
    const chat = await db.chat.findFirst({
      where: {
        id: params.chatId,
        userId: session.user.id, // Ensure user owns this chat
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    })
    
    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(chat)
  } catch (error) {
    console.error("Failed to fetch chat:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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
    
    // Verify ownership before deleting
    const chat = await db.chat.findFirst({
      where: {
        id: params.chatId,
        userId: session.user.id,
      }
    })
    
    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      )
    }
    
    await db.chat.delete({
      where: { id: params.chatId }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete chat:", error)
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    )
  }
}

// PATCH - Update chat title
export async function PATCH(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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
    const { title } = body
    
    const chat = await db.chat.update({
      where: {
        id: params.chatId,
        userId: session.user.id, // Ensure ownership
      },
      data: { title }
    })
    
    return NextResponse.json(chat)
  } catch (error) {
    console.error("Failed to update chat:", error)
    return NextResponse.json(
      { error: "Failed to update chat" },
      { status: 500 }
    )
  }
}