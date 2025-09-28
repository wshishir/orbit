// app/auth/signin/page.tsx
"use client"

import { signIn } from "@/lib/auth-client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/new" // Redirect to home after sign-in
      })
    } catch (error) {
      console.error("Sign-in failed:", error)
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex">
      

      <div className="w-full flex items-center justify-center ">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(/moon.png)' }}
      />
        <div className="w-full max-w-md h-1/12  p-14 rounded-2xl z-20 ">
          <div className="space-y-6">
              <>
                <div className="items-center justify-center">
                  <p className="flex items-center justify-center text-2xl font-semibold pb-10">Sign in to orbit</p>
                  <Button
                    className="h-11 rounded-2xl text-black hover:bg-gray-100 shadow-none cursor-pointer w-full bg-white"
                    onClick={handleGoogleSignIn}
                  >
                    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </>
            
          </div>
        </div>
      </div>
    </div>
  )
}