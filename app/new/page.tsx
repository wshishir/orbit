// main page
"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"
import { useSession } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ArrowDown, ChevronDown, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRef } from "react"

export default function Page() {
  const { data: session } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar/>
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
          <h2 className="text-[38px] font-semibold text-center">What do you want to explore, {session?.user.name?.split(' ')[0]}?</h2>
          <div className="container w-full max-w-2xl border border-[#616161] bg-[#616161] flex flex-col p-2 min-h-fit">
          <Textarea
                      ref={textareaRef}
                      className="w-full min-h-[40px] rounded-none
             resize-y
             placeholder:text-[16px] border-none text-white
            bg-transparent outline-none
            scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                         placeholder="Ask me anything ..."
                         spellCheck={false}
                       rows={1}
                       onInput={handleInput}

                       
                      />
            <div className="flex justify-between items-end mt-2">
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bl py-1 px-2 flex">Improving<ChevronDown className=" ml-1 h-6 w-4"/></DropdownMenuTrigger>
                  <DropdownMenuContent className="bl border-none rounded-none">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                <DropdownMenuTrigger className="bl py-1 px-2 flex">Article<ChevronDown className=" ml-1 h-6 w-4"/></DropdownMenuTrigger>
                  <DropdownMenuContent className="bl border-none rounded-none">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <button className="cursor-pointer p-1.5 bg-[#AAAAAA] hover:bg-[#999999] transition-colors">
                <Send width={20} height={20}/>
              </button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}