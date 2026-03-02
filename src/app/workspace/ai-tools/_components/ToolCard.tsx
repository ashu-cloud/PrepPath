"use client"
import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
}

export default function ToolCard({ title, description, icon: Icon, href, color }: ToolCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.05] bg-[#13131a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      
      <h3 className="mb-2 font-display text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
        {title}
      </h3>
      
      <p className="mb-6 text-sm leading-relaxed text-white/30 line-clamp-3">
        {description}
      </p>

      <Link href={href} className="mt-auto">
        <Button className="w-full bg-white/5 border border-white/10 hover:bg-violet-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
          Launch Tool
        </Button>
      </Link>
    </div>
  )
}