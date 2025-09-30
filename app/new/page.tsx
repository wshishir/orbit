// app/new/page.tsx - Updated version
"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"
import { useSession } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChevronDown, Send, Loader2, SendHorizonal, Ellipsis } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  content: string
  role: "USER" | "ASSISTANT"
  contentType?: string
  createdAt: string
}

export default function Page() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [contentType, setContentType] = useState("GENERAL")
  const [loading, setLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  // Get chatId from URL
  useEffect(() => {
    const chatId = searchParams.get("chat")
    if (chatId) {
      setCurrentChatId(chatId)
      loadChatMessages(chatId)
    }
  }, [searchParams])

  // Load messages for a chat
  const loadChatMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      if (response.ok) {
        const chat = await response.json()
        setMessages(chat.messages || [])
      }
    } catch (error) {
      console.error("Failed to load chat:", error)
    }
  }

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    
    setLoading(true)
    const userInput = input
    setInput("") // Clear input immediately
    
    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      role: "USER",
      contentType,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userInput,
          contentType,
          chatId: currentChatId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.error || "Failed to generate")
      }
      
      const data = await response.json()
      
      // Update with real messages from server
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove temp message
        data.userMessage,
        data.aiMessage
      ])
      
      // Update URL if new chat was created
      if (!currentChatId && data.chatId) {
        setCurrentChatId(data.chatId)
        router.push(`/new?chat=${data.chatId}`)
      }
      
    } catch (error) {
      console.error("Failed to send message:", error)
      // Remove the temporary message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const contentTypes = [
    { value: "GENERAL", label: "General" },
    { value: "ARTICLE", label: "Article" },
    { value: "REPORT", label: "Report" },
    { value: "LINKEDIN_POST", label: "LinkedIn Post" },
    { value: "TWEET", label: "Tweet" },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <UserNav />
        </header>
        
        <main className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-[38px] font-semibold text-center">
                  What do you want to explore, {session?.user.name?.split(' ')[0]}?
                </h2>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${
                      message.role === "USER" 
                        ? "ml-auto max-w-[80%]" 
                        : "mr-auto max-w-[80%]"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-lg ${
                        message.role === "USER"
                          ? "bg-[#616161] text-white"
                          : "bg-[#2A2A2A] text-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Ellipsis className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-4 pb-0 pt-1">
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#18181b] p-2  rounded-t-xl">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full min-h-[40px] rounded-none resize-none
                    placeholder:text-[15px] border-none text-white
                    bg-transparent outline-none"
                  placeholder="Type your message here..."
                  spellCheck={false}
                  rows={1}
                  onInput={handleInput}
                  disabled={loading}
                />
                <div className="flex justify-between items-end mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border rounded-lg py-1 px-4 flex select-none">
                      {contentTypes.find(t => t.value === contentType)?.label}
                      <ChevronDown className="ml-1 h-6 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#18181b] border rounded-lg">
                      {contentTypes.map(type => (
                        <DropdownMenuItem
                          key={type.value}
                          onClick={() => setContentType(type.value)}
                          className="hover:bg-black"
                        >
                          {type.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="cursor-pointer p-1.5 
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Ellipsis className="h-5 w-5 animate-spin" />
                    ) : (
                      <SendHorizonal width={20} height={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}