"use client"
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AddNewCourseDialogue from './AddNewCourseDialogue'
import { Button } from '@/components/ui/button'

function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13131a] p-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-16 left-1/4 h-48 w-64 rounded-full bg-violet-600/[0.12] blur-[60px]" />

      {/* Top shimmer line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
            <span className="h-px w-5 bg-violet-400" />
            Your Dashboard
          </p>
          <h1 className="font-display text-[1.8rem] font-extrabold leading-tight tracking-tight text-white">
            Welcome back to <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">PrepPath</span>
          </h1>
          <p className="mt-2.5 max-w-xl text-[0.88rem] font-light leading-relaxed text-white/35">
            Your AI-powered learning hub. Generate courses tailored to your level, track your progress, and level up your skills — one module at a time.
          </p>
        </div>
        <AddNewCourseDialogue>
          <Button
            className="group flex flex-shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-3 text-[0.85rem] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
          >
            <Sparkles className="h-4 w-4" />
            Generate a Course
          </Button>
        </AddNewCourseDialogue>
        
      </div>
    </div>
  )
}

export default WelcomeBanner