// app/page.tsx
// Updated home page with authentication status

"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"

export default function HomePage() {
  const { data: session } = useSession()
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with auth status */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            AI Content Writer
          </h1>
          
          {/* Show different buttons based on auth status */}
          <div>
            {session ? (
              <Link
                href="/dashboard"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/auth/login"
                  className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded border transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-center text-gray-600 mt-4">
          Your AI-powered writing assistant
        </p>
      </div>
    </main>
  )
}