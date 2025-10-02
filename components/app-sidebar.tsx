// components/app-sidebar.tsx
"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { MessageSquare, Plus, Trash2, X } from "lucide-react"

interface Chat {
  id: string
  title: string
  updatedAt: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats")
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    router.push("/new")
    setSelectedChatId(null)
  }

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId)
    router.push(`/new?chat=${chatId}`)
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setChats(chats.filter(chat => chat.id !== chatId))
        if (selectedChatId === chatId) {
          setSelectedChatId(null)
          router.push("/new")
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="text-4xl items-center justify-center font-semibold mt-1.5 border-b mx-6">
        Orbit.chat
      </SidebarHeader>
      <SidebarContent>
        <button 
          onClick={handleNewChat}
          className="flex gap-2 hover:bg-gray-100 font-semibold mt-5 mx-3 py-2  cursor-pointer rounded-lg bg-white text-black items-center justify-center"
        >
         <Plus className="h-5 w-5"/> New Chat
        </button>
        
        {loading ? (
          <p className="text-center mt-10 text-[#616161]">Loading chats...</p>
        ) : chats.length === 0 ? (
          <p className="text-center mt-10 text-[#616161]">No chats found</p>
        ) : (
          <div className="mt-4 px-4 space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`group flex items-center justify-between p-2 cursor-pointer hover:bg-[#2A2A2A] transition-colors rounded-lg ${
                  selectedChatId === chat.id ? 'bg-[#2A2A2A]' : ''
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-300 truncate">
                    {chat.title}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 "
                >
                  <X className="h-3 w-3 text-gray-300 cursor-pointer hover:text-red-300" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}