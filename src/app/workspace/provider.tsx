import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from './_components/AppsideBar'
import AppHeader from './_components/AppHeader'
import WelcomeBanner from './_components/WelcomeBanner'
import Courses from './_components/Courses'



function WorkspaceProvider({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col bg-[#070708]">
        <AppHeader />
        <WelcomeBanner />
        <Courses />
        <main className="flex-1 p-6">
          <div>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default WorkspaceProvider
