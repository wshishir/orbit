import React from 'react'
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

const Dashboard = () => {
    const router = useRouter();
  return (
    <div className="flex h-screen bg-[#0e0e0e]">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4">
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={async () => {
                  await signOut()
                  router.push("/")
                }}
                className="text-sm text-white px-4 py-2 button cursor-pointer "
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

export default Dashboard