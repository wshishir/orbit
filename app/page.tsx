// app/page.tsx
"use client"

import { useRouter } from "next/navigation"
import Lenis from 'lenis'

export default function HomePage() {
  const router = useRouter()
  // Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  console.log(e);
});

  return (
    <div>
      {/* Fixed background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(/moon.png)' }}
      />
      {/* Hero Section */}
      <div className="relative max-w-screen h-screen z-10">
        <div className="absolute inset-0 container flex items-center justify-center -mt-10">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-[45px] font-medium text-white mb-6 tracking-tight leading-tight">
              Refine your content
            </h1>
            <p className="text-lg  text-gray-400 mb-8 max-w-3xl mx-auto tracking-tighter">
              Create amazing content with the power of AI. Write articles, reports,
              social media posts, and more in seconds.
            </p>
            <div className="flex justify-center">
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-[14px] p-3 px-6 hover:bg-gray-100 rounded-2xl text-black bg-white font-semibold cursor-pointer"
            >
              Get Started
            </button>
            
            </div>
          </div>
        </div>
      </div>

      {/* Video Section - spans hero and next section */}
      <div className="relative -mt-48 z-20 flex justify-center px-6">
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
      <div className="relative py-14 z-20">
            <p className="flex items-center justify-center font-light text-[15px] text-gray-300">© 2025 Orbit. All rights reserved.</p>
          </div>
    </div>
  )
}