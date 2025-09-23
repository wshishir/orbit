// app/page.tsx
"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import DarkVeil from '../components/ui/dark-deil';
import Header from "@/components/Header";
import Dashboard from "./(dashboard)/page";

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
          <div className="absolute inset-0 container flex items-center justify-center -mt-10">
            <div className="text-center max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-[57px] font-semibold text-white mb-6 tracking-tight leading-tight">
                Turbocharge your content creation with AI
              </h1>
              <p className="text-lg  text-gray-400 mb-8 max-w-3xl mx-auto tracking-tighter">
                Create amazing content with the power of AI. Write articles, reports,
                social media posts, and more in seconds.
              </p>
              <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/auth/signin")}
                className="button text-lg px-8 py-3  font-semibold cursor-pointer"
              >
                Get Started
              </button>
              <button className="px-8 py-3 text-lg text-black bg-white"
              onClick={() =>router.push("/")}
              >
                Learn More
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section - spans hero and next section */}
        <div className="relative -mt-48 z-20 flex justify-center px-6 bg-black">
          <video
            autoPlay
            loop
            muted
            className="w-full max-w-4xl rounded-4xl"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="bg-black py-14">
              <p className="flex items-center justify-center font-light text-[15px] text-gray-300">© 2025 Orbit. All rights reserved. <span className="underline ml-1 cursor-pointer">Terms & Conditoins</span></p>
            </div>
      </div>
    )
  }
  
  return (
    <Dashboard/>
  )
}