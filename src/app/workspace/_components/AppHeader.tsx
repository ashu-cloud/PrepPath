import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton, SignOutButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { LogOut } from 'lucide-react'
import React from 'react'

async function AppHeader() {
  const user = await currentUser()
  const displayName = user?.fullName ?? user?.username ?? 'Learner'

  return (
    <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#070708]/80 px-6 backdrop-blur-xl'>
      
      {/* --- Left: Sidebar Toggle & Fun "Workspace" Replacement --- */}
      <div className='flex items-center gap-4'>
        <SidebarTrigger className='text-white/40 transition-colors hover:text-violet-400' />
        <div className='h-4 w-px bg-white/[0.08]' />
        
        {/* The new "Command Center" badge */}
        <div className="flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 cursor-default hover:bg-violet-500/20 transition-colors hidden sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
          </span>
          <span className='font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-violet-300'>
            Command Center
          </span>
        </div>
      </div>

      {/* --- Right: User Profile & Actions --- */}
      <div className='flex items-center gap-4 sm:gap-5'>
        
        <div className='hidden flex-col items-end justify-center sm:flex'>
          <span className='mb-0.5 font-mono text-[0.60rem] uppercase tracking-widest text-violet-400/80'>
            Ready to learn
          </span>
          <span className='text-[0.8rem] font-medium text-white/80'>
            {displayName} 👋
          </span>
        </div>

        <div className='flex items-center justify-center rounded-full ring-1 ring-white/10 transition-all hover:ring-white/30'>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 rounded-full"
              }
            }}
          />
        </div>

        <div className='hidden h-4 w-px bg-white/[0.08] sm:block' />

        <SignOutButton>
          <button className='group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-[0.75rem] font-medium text-white/60 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400'>
            <LogOut className='h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5' />
            <span className='hidden sm:inline'>Sign out</span>
          </button>
        </SignOutButton>
        
      </div>
    </header>
  )
}

export default AppHeader