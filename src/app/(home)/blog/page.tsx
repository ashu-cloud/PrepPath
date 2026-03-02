"use client"

import React from 'react'
import { 
  Sparkles, 
  BrainCircuit, 
  Search, 
  Database, 
  Code2, 
  Rocket, 
  Quote,
  ArrowRight,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) {
  return (
    <div className="mb-12 flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-white/5 p-3 ring-1 ring-white/10">
        <Icon className="h-6 w-6 text-violet-400" />
      </div>
      <h2 className="mb-2 font-display text-3xl font-bold text-white">
        {title}
      </h2>
      <p className="max-w-xl text-gray-400">
        {subtitle}
      </p>
    </div>
  )
}

function WorkflowCard({ icon: Icon, title, description, step }: { icon: any, title: string, description: string, step: number }) {
    return (
      <div className="relative flex flex-col items-start p-6 rounded-2xl border border-white/10 bg-[#13131a] overflow-hidden group hover:border-violet-500/50 transition-all duration-300">
        {/* Abstract Background Glow */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-violet-500/10 blur-[60px] group-hover:bg-violet-500/20 transition-all"></div>
        
        <div className="relative z-10 flex items-center gap-4 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-300 ring-1 ring-violet-500/30">
                {step}
            </span>
            <div className="h-px flex-1 bg-white/10"></div>
            <Icon className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
        </div>
        
        <h3 className="relative z-10 mb-2 text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
          {title}
        </h3>
        <p className="relative z-10 text-sm leading-relaxed text-gray-400">
          {description}
        </p>
      </div>
    )
  }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070708] overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        {/* CSS-based Hero Art (No external images needed) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[1000px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-[#070708]/0 to-[#070708]/0 blur-[100px]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-violet-400 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Rocket className="h-3 w-3" /> The Story Behind The Platform
            </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Engineered to End <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Tutorial Hell.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-400 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            PrepPath isn't just another course platform. It's an AI-driven engine designed to cut through the noise of the internet and build the perfect learning path just for you.
          </p>
        </div>
      </div>


      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        
        {/* --- THE MOTIVATION --- */}
        <div className="relative z-10 mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 backdrop-blur-sm mb-24">
            <div className="absolute -top-4 -left-4">
                <Quote className="h-12 w-12 text-violet-500/20 transform -scale-x-100" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">The "Why"</h3>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
                <p>
                    Let's be real. Learning a new technical skill in {new Date().getFullYear()} is overwhelming. You want to learn "System Design," so you type it into YouTube.
                </p>
                <p>
                    What do you get? A 4-hour lecture recorded on a potato in 2016, a 10-minute "influencer" video that's mostly an ad for a VPN, and a Udemy course trying to charge you $199.
                </p>
                <p className="font-medium text-white">
                    We call this "Tutorial Hell." You spend more time searching for good content than actually learning.
                </p>
                <p>
                    We built PrepPath to fix this. We wanted a tool that acts like a Senior Engineer sitting next to you—someone who knows exactly *what* you need to learn, finds the *best* resource for it, and then explains it to you clearly.
                </p>
            </div>
        </div>


        {/* --- HOW IT WORKS (THE ENGINE) --- */}
        <SectionHeader 
            icon={BrainCircuit} 
            title="The Engine Under the Hood" 
            subtitle="How we transmute raw internet noise into structured knowledge."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24 relative">
            {/* Connecting Line for Desktop */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent hidden lg:block"></div>

            <WorkflowCard 
                step={1}
                icon={Sparkles}
                title="The Architect (Gemini)"
                description="You give us a topic. Our AI analyzes your request and architects a bespoke, multi-chapter curriculum tailored specifically to that subject, ensuring a logical flow of concepts."
            />
             <WorkflowCard 
                step={2}
                icon={Search}
                title="The Hunter (YouTube API)"
                description="For every single chapter, our algorithms scour YouTube's vast library. We filter out the noise to find the one single video that explains that specific concept best."
            />
             <WorkflowCard 
                step={3}
                icon={BrainCircuit}
                title="The Alchemist (AI Analysis)"
                description="We don't just show you the video. Our AI watches it with you, digesting the transcript to generate comprehensive, formatted HTML notes, code blocks, and key takeaways."
            />
             <WorkflowCard 
                step={4}
                icon={Database}
                title="The Vault (Neon DB)"
                description="Your entire journey—the curriculum, the specific videos, the generated notes, and your progress—is securely stored in our high-performance database, ready whenever you are."
            />
        </div>


        {/* --- THE HUMOR BREAK --- */}
        <div className="mx-auto max-w-2xl text-center mb-24 py-12 px-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-lg text-gray-400 italic font-serif">
                "Why did we build an AI to watch YouTube tutorials for us? <br />
                Because I tried learning Kubernetes last month and ended up watching 3 hours of hydraulic press videos and a documentary about sourdough bread. It was time for an intervention."
            </p>
            <p className="mt-4 text-sm font-bold text-violet-400">— The Lead Developer</p>
        </div>


        {/* --- CTA --- */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#13131a] px-6 py-24 shadow-2xl sm:px-24 xl:py-32 text-center">
            {/* Abstract heavy glow effect */}
            <div className="absolute -top-[30%] left-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/30 via-[#070708]/50 to-[#070708] blur-[100px]"></div>
            
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Stop searching. Start learning.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Your personalized learning path is 30 seconds away. Let our AI do the heavy lifting so you can focus on mastering the skill.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/sign-up">
                    <Button className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all duration-300">
                        Generate Your First Course <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>

      </div>
    </div>
  )
}