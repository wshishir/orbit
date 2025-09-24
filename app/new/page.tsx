// main page
"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"
import { useSession, signOut } from "@/lib/auth-client"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

export default function Page() {
  const { data: session } = useSession();

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
        
        {/* main content here */}
        <main className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-6 px-4">
          <h2 className="text-4xl font-semibold text-center">What do you want to explore, {session?.user.name?.split(' ')[0]}?</h2>
          <div className="w-full max-w-2xl space-y-4">
            <Input
              className="w-full min-h-32 p-4 rounded-none resize-none"
              placeholder="Ask me anything..."
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}