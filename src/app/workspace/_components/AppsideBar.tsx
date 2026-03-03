'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import {
  BookOpen,
  Compass,
  LayoutDashboard,
  PencilRulerIcon,
  UserCircle2Icon,
  Wallet,
  Sparkles,
  Rocket
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import  AddNewCourseDialogue  from "./AddNewCourseDialogue"
import {Button} from "@/components/ui/button"

const SideBarOptions = [
  { title: "Dashboard",      icon: LayoutDashboard, link: "/workspace/" },
  { title: "My Learning",    icon: BookOpen,        link: "/workspace/my-courses" },
  { title: "Explore Courses",icon: Compass,         link: "/workspace/explore" },
  { title: "AI Tools",       icon: PencilRulerIcon, link: "/workspace/ai-tools" },
  { title: "Billing",        icon: Wallet,          link: "/workspace/billing" },
  { title: "Profile",        icon: UserCircle2Icon, link: "/workspace/profile" },
  { title: "feedback",   icon: Sparkles,       link: "/workspace/feedback" },
]

export function AppSidebar() {
  const path = usePathname()

  return (
    <Sidebar className="border-r border-white/[0.06] bg-[#0d0d10]">

      {/* ── Header (Upgraded Logo) ── */}
      <SidebarHeader className="px-5 py-6 border-b border-white/[0.02]">
        <Link href="/workspace" className="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] group-hover:-rotate-12">
            <Rocket className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <span className="font-display text-[1.2rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            PrepPath
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">

        {/* ── Nav items ── */}
        <SidebarGroup>
          <p className="mb-2 px-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/20">
            Navigation
          </p>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {SideBarOptions.map((option) => {
                const active = path === option.link
                return (
                  <SidebarMenuItem key={option.title}>
                    <Link
                      href={option.link}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.83rem] font-medium transition-all duration-150",
                        active
                          ? "bg-violet-500/[0.12] text-violet-300"
                          : "text-white/35 hover:bg-white/[0.04] hover:text-white/70"
                      )}
                    >
                      <option.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          active ? "text-violet-400" : "text-white/25"
                        )}
                      />
                      {option.title}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                      )}
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-white/[0.06] px-4 py-4">
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 rounded-xl ring-1 ring-white/10",
              },
            }}
          />
          <div className="flex flex-col">
            <span className="text-[0.78rem] font-medium text-white/60">My Account</span>
            <span className="text-[0.65rem] text-white/25">Manage profile</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}