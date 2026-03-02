import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from './_components/AppsideBar'
import AppHeader from './_components/AppHeader'

function WorkspaceProvider({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col bg-[#070708]">
        {/* The Header stays here so it shows on every page */}
        <AppHeader />
        
        {/* The main content area where individual pages will render */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default WorkspaceProvider