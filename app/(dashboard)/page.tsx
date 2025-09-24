import React from 'react'
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

const Dashboard = () => {
    const router = useRouter();
  return (
    <div className="flex flex-col bg-[#080808] min-h-screen">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                await signOut()
                router.push("/")
              }}
              className="text-white px-4 py-2 button cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 p-6">
        <h1 className="text-white text-2xl mb-4">Dashboard</h1>
        {/* Add your dashboard content here */}
      </main>
    </div>
  )
}

export default Dashboard