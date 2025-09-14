// app/dashboard/page.tsx
// Protected page - only logged-in users can see this

"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login")
    }
  }, [session, isPending, router])
  
  // Show loading while checking authentication
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }
  
  // Show nothing if not authenticated (will redirect)
  if (!session) {
    return null
  }
  
  // Logged in! Show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          
          <div className="bg-blue-50 p-4 rounded mb-4">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="font-semibold">{session.user?.email}</p>
            {session.user?.name && (
              <p className="text-gray-600">Name: {session.user.name}</p>
            )}
          </div>
          
          <button
            onClick={async () => {
              await signOut()
              router.push("/")
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}