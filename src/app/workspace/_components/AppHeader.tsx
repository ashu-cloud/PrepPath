import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'

import React from 'react'
import { SignOutButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

function AppHeader() {
  return (
    <div className='flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#070708]/80 px-6 backdrop-blur-xl'>
      <div className='flex items-center gap-3'>
        <SidebarTrigger className='text-white/30 transition-colors hover:text-white/70' />
        <div className='h-4 w-px bg-white/[0.08]' />
        <span className='font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/20'>
          Workspace
        </span>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-3'>
        <span className='hidden text-[0.78rem] text-white/30 sm:block'>
            Good morning, ashu 👋
        </span>
        <SignOutButton>
        <button className='flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-1.5 text-[0.78rem] text-white/70 transition-all hover:border-red-500/30 hover:text-red-400'>
            <LogOut className='h-3.5 w-3.5' />
            Sign out
        </button>
        </SignOutButton>
        
        </div>
      </div>
    </div>
  )
}

export default AppHeader