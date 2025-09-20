// app/page.tsx
"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  
  // Not signed in - show landing page
  if (!isPending && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              AI Content Writer
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create amazing content with the power of AI. Write articles, reports, 
              social media posts, and more in seconds.
            </p>
            <button
              onClick={() => router.push("/auth/signin")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-4 rounded-lg transition-colors font-semibold"
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }
  
  // Signed in - show main app
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              AI Content Writer
            </h1>
            <div className="flex items-center gap-4">
              
              <button
                onClick={async () => {
                  await signOut()
                  router.push("/")
                }}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  )
}