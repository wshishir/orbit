import {auth} from "@/lib/auth";
import { db } from "@/lib/db";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }
        const chats = await db.chat.findMany({
            where:{
                userId: session.user.id
            },
            orderBy: {
                updatedAt: "desc"
            },
            select: {
                id:true,
                title:true,
                updatedAt:true,
                createdAt:true,
            }
        })
        return NextResponse.json(chats)
    }catch(error) {
        console.error("Failed to fetch chats: ", error)

        return NextResponse.json(
            { error: "Failed to fetch chats" },
            { status: 500 }
        )
    }
}

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
        const { title } = body
        const chat = await db.chat.create({
            data: {
                userId: session.user.id,
                title: title || "New Chat",
            }
        })

        return NextResponse.json(chat)
    } catch (error){
        console.error("Failed to create chat:" , error)
        return NextResponse.json(
            { error: "Failed to create chat" },
            { status: 500 }
        )
    }
}