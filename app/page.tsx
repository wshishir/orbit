// app/page.tsx
"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import DarkVeil from '../components/ui/dark-deil';
import Header from "@/components/Header";

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  
  // Not signed in - show landing page
  if (!isPending && !session) {
    return (
      <div>
        {/* Hero Section */}
        <div className="relative max-w-screen h-screen">
          <Header/>
          <DarkVeil />
          <div className="absolute inset-0 container flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6 tracking-tight text-balance">
              Turbocharge your content creation with AI
              </h1>
              <p className="text-xl text-gray-500 mb-8">
                Create amazing content with the power of AI. Write articles, reports,
                social media posts, and more in seconds.
              </p>
              <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/auth/signin")}
                className="button text-lg px-8 py-4  font-semibold cursor-pointer"
              >
                Get Started
              </button>
              <button className="px-8 py-4 text-lg text-black bg-white"
              onClick={() =>router.push("/")}
              >
                Learn More
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section - spans hero and next section */}
        <div className="relative -mt-32 z-20 flex justify-center px-6">
          <video
            autoPlay
            loop
            muted
            className="w-full max-w-4xl rounded-lg shadow-2xl"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )
  }
  
  // Signed in - show main app
  return (
    <div className="flex h-screen">
      
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