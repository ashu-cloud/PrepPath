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
} from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"
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
]

export function AppSidebar() {
  const path = usePathname()

  return (
    <Sidebar className="border-r border-white/[0.06] bg-[#0d0d10]">

      {/* ── Header ── */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-gradient-to-br from-violet-500 to-sky-400 text-xs font-black text-white">
            P
          </div>
          <span className="font-display text-[1.05rem] font-extrabold tracking-tight text-white">
            PrepPath
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">

        {/* ── Generate button ── */}
        <SidebarGroup className="pb-4">
          <SidebarGroupContent>
            <AddNewCourseDialogue>
              <Button
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-[0.82rem] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate New Course
            </Button>
            </AddNewCourseDialogue>
          </SidebarGroupContent>
        </SidebarGroup>

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