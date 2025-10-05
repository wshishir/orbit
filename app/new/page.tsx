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
import Markdown from 'markdown-to-jsx';
import toast, { Toaster } from 'react-hot-toast';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChevronDown, Send, Loader2, SendHorizonal, Ellipsis, Copy, Disc, ArrowRightIcon, SquareArrowRight, ArrowRight } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';

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
  const notify = () => toast('Copied to Clipboard.');
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [contentType, setContentType] = useState("GENERAL")
  const [loading, setLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [hoveredMessageId, setHoveredMessageId]= useState<string | null>(null)

  // Get chatId from URL
  useEffect(() => {
    const chatId = searchParams.get("chat")
    if (chatId) {
      setCurrentChatId(chatId)
      loadChatMessages(chatId)
    } else {
      setMessages([])
      setCurrentChatId(null)
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

    // Add temporary AI message for streaming
    const tempAiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "ASSISTANT",
      contentType,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempAiMessage])

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
        throw new Error("Failed to generate")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No reader available")

      let streamedContent = ""
      let newChatId = currentChatId
      let finalUserMessage = tempUserMessage

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'init') {
                newChatId = data.chatId
                finalUserMessage = data.userMessage
              } else if (data.type === 'chunk') {
                streamedContent += data.text
                // Update the AI message content in real-time
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: streamedContent
                  }
                  return newMessages
                })
              } else if (data.type === 'done') {
                // Replace temp messages with final ones
                setMessages(prev => [
                  ...prev.slice(0, -2),
                  finalUserMessage,
                  data.aiMessage
                ])
              }
            } catch (e) {
              // Skip malformed JSON
              continue
            }
          }
        }
      }

      // Update URL if new chat was created
      if (!currentChatId && newChatId) {
        setCurrentChatId(newChatId)
        router.push(`/new?chat=${newChatId}`)
      }

    } catch (error) {
      console.error("Failed to send message:", error)
      // Remove the temporary messages on error
      setMessages(prev => prev.slice(0, -2))
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
    { value: "EMAIL", label: "Email" },
  ]
  const dummyPrompts = [
    {
      text: "Create a LinkedIn post about the importance of work-life balance.",
      type: "LINKEDIN_POST",
      icon: BriefcaseBusiness,
    },
    {
      text: "Write a tweet announcing a new AI-powered feature.",
      type: "TWEET",
      icon: "𝕏",
    },
    {
      text: "Generate an email to reply to a job offer.",
      type: "ARTICLE",
      icon: FileText,
    }
  ]

  const handleDummyPromptClick= ( prompt: string, type: string ) =>{
    setInput(prompt)
    setContentType(type)
    textareaRef.current?.focus()
  }

  const handleCopy = async (text: string) => {
    try{
      await navigator.clipboard.writeText(text)
      toast.success('Copied to Clipboard.')
    }catch(err) {
      console.log("Failed to copy text:", err)
      toast.error('Failed to copy')
    }
  }

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
          {/* Greeting Section */}
          {messages.length === 0 && (
            <div className="flex flex-col pt-8 items-center justify-center">
              <div className="w-full max-w-3xl">
              <h2 className="text-[38px] font-semibold ">
                Hi there, {session?.user.name?.split(' ')[0]} 👋🏼
              </h2>
              <h3 className="text-[38px] font-semibold">What would you like to create?</h3>
              </div>
              <div className="grid grid-cols-3 max-w-3xl  gap-4 w-full mt-8">
              {dummyPrompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => handleDummyPromptClick(prompt.text, prompt.type)}
          className="group p-3 bg-[#1f1f1f] 
            rounded-xl text-left transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-7">
            <span className="text-lg">
              {typeof prompt.icon === 'string' ? prompt.icon : <prompt.icon className="w-5 h-5 text-gray-300" />}
            </span>
          </div>
          <p className="text-sm text-white line-clamp-2  tracking-tight">
            {prompt.text}
          </p>
        </button>
      ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {messages.length > 0 && (
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                    className={`relative ${
                      message.role === "USER" 
                        ? "ml-auto max-w-[80%]" 
                        : "mr-auto max-w-[80%]"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-xl rounded-tr-none ${
                        message.role === "USER"
                          ? "bg-[#1f1f1f] text-white"
                          : "bg-transparent text-gray-200"
                      }`}
                    >
                      <Markdown
      options={{
        overrides: {
          h1: { props: { className: 'text-3xl font-bold mb-4' } },
          h2: { props: { className: 'text-3xl font-bold mb-3' } },
          h3: { props: { className: 'text-xl font-semibold mb-2' } },
          p: { props: { className: 'text-base mb-4 leading-relaxed' } },
          ul: { props: { className: 'list-disc text-xl ml-6 mb-4' } },
          ol: { props: { className: 'list-decimal ml-6 mb-4' } },
          code: { props: { className: 'bg-gray-100 px-2 py-1 rounded' } },
        }
      }}
    >
      {message.content}
    </Markdown>
                    </div>
                    <div>
                    {hoveredMessageId === message.id && (
                     <button 
                      onClick={() => handleCopy(message.content)}
                       className="absolute -bottom-6 right-2 p-2 cursor-pointer hover:bg-[#1f1f1f]/50 rounded-lg"
                            >
                    <Copy className="w-4 h-4"/>
                    </button>
                     )}
                     <Toaster/>
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
              <div className="bg-[#1f1f1f] p-2  rounded-t-xl">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full min-h-[40px] rounded-none resize-none
                    placeholder:text-[15px] border-none text-white
                    bg-transparent outline-none"
                  placeholder="Explain your content here..."
                  spellCheck={false}
                  rows={1}
                  onInput={handleInput}
                  disabled={loading}
                />
                <div className="flex justify-between items-end mt-6 mx-1 mb-1">
                  <div className="flex gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-full py-0.5 px-4 flex select-none bg-white text-black font-semibold">
                      {contentTypes.find(t => t.value === contentType)?.label}
                      <ChevronDown className="ml-1 h-6 w-4 font-semibold" />
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
                  </div>
                  
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="cursor-pointer p-1.5 
                        disabled:cursor-not-allowed bg-white text-black rounded-lg"
                  >
                    {loading ? (
                      <Disc className="h-5 w-5 font-bold" />
                    ) : (
                      <ArrowRight width={18} height={18} className="font-bold"/>
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