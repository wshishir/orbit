import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
   //menu here
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="text-4xl items-center justify-center font-semibold mt-1.5 border-b mx-6">
        Orbit.chat
      </SidebarHeader>
      <SidebarContent>
        <button className="bg-[#7E7E7E] mx-6 mt-5 py-2 cursor-pointer">
          New Chat
        </button>
        <p className="text-center mt-10 text-[#616161]">No chats founds</p>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
