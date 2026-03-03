"use client"

import React from 'react'
import { 
  Sparkles, 
  BrainCircuit, 
  Search, 
  Database, 
  Rocket, 
  Quote,
  ArrowRight,
  Wand2,
  ShieldCheck,
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
      
      {/* --- HERO --- */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[1000px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-[#070708]/0 to-[#070708]/0 blur-[100px]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-violet-400 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Rocket className="h-3 w-3" /> Why We Built This
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Learning That Actually <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Fits Your Brain.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-400 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            PrepPath isn't a course library. It's an AI that builds your course from scratch — structured around what you already know, not what a content creator decided to record three years ago.
          </p>
        </div>
      </div>


      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        
        {/* --- THE WHY --- */}
        <div className="relative z-10 mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 backdrop-blur-sm mb-24">
          <div className="absolute -top-4 -left-4">
            <Quote className="h-12 w-12 text-violet-500/20 transform -scale-x-100" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-6">The Problem We're Solving</h3>
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
            <p>
              Every course platform assumes you know nothing. So you sit through 40 minutes of "what is a variable" before they get to the thing you actually came for.
            </p>
            <p>
              Or you already know the basics and have to scrub through a 6-hour YouTube video hunting for the 12 minutes that are actually relevant to you.
            </p>
            <p className="font-medium text-white">
              Both are a waste of your most valuable resource — time.
            </p>
            <p>
              PrepPath skips the part you already know. You tell us your topic and your level, and our AI builds a course that starts exactly where you are — not where a stranger on the internet assumes you are.
            </p>
          </div>
        </div>


        {/* --- HOW IT WORKS --- */}
        <SectionHeader 
          icon={BrainCircuit} 
          title="How PrepPath Works" 
          subtitle="Four steps from a topic in your head to a structured course in your hands."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent hidden lg:block"></div>

          <WorkflowCard 
            step={1}
            icon={Sparkles}
            title="You Describe It"
            description="Tell PrepPath what you want to learn and how much you already know. A topic, a level, a context — that's all we need. No lengthy onboarding, no skill tests."
          />
          <WorkflowCard 
            step={2}
            icon={Wand2}
            title="Gemini Architects It"
            description="Google's Gemini 2.5 Flash designs a structured curriculum in seconds — chapters sequenced in logical order, scoped to your exact level, with no fluff or repetition."
          />
          <WorkflowCard 
            step={3}
            icon={BrainCircuit}
            title="Content Gets Generated"
            description="Each chapter gets rich, formatted content — explanations, code examples, key takeaways. Not scraped. Not templated. Written fresh for your course, every time."
          />
          <WorkflowCard 
            step={4}
            icon={Database}
            title="Your Progress Lives Here"
            description="Every chapter you complete, every course you generate — it's all tracked. Come back tomorrow, pick up exactly where you left off. Your learning history goes nowhere."
          />
        </div>


        {/* --- WHAT MAKES US DIFFERENT --- */}
        <SectionHeader 
          icon={ShieldCheck} 
          title="What Makes PrepPath Different" 
          subtitle="Not another course marketplace. Not another YouTube aggregator."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            {
              title: "Starts at your level",
              desc: "Beginner courses start from scratch. Intermediate courses skip the intro. Advanced courses go straight to the hard parts. You pick, the AI adapts.",
              emoji: "🎯"
            },
           {
            title: "Built by learners, for learners",
            desc: "Browse courses created by real users, or generate your own from scratch. Every course on PrepPath was built by someone who actually wanted to learn it — not a content team chasing SEO.",
            emoji: "🧑‍💻"
          },
            {
              title: "Worth the wait",
              desc: "Good things take a moment. PrepPath generates your entire curriculum fresh — not pulled from a template. Grab a coffee, it'll be ready before you finish it.",
              emoji: "⚡"
            },
          ].map(({ title, desc, emoji }) => (
            <div key={title} className="flex flex-col p-6 rounded-2xl border border-white/10 bg-[#13131a] hover:border-violet-500/30 transition-all duration-300">
              <span className="mb-4 text-3xl">{emoji}</span>
              <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
            </div>
          ))}
        </div>


        {/* --- THE JOKE --- */}
        <div className="mx-auto max-w-2xl text-center mb-24 py-12 px-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
          <p className="text-lg text-gray-400 italic font-serif">
            "A junior dev asks his senior: 'How long will it take to learn React?'<br />
            The senior thinks for a moment and says: 'About two weeks.'<br />
            The junior is relieved. 'Oh great, that's not bad at all.'<br />
            The senior nods slowly. 'Yeah. Two weeks to learn it. The next three years are just to figure out when not to use it.'"
          </p>
          <p className="mt-4 text-sm font-bold text-violet-400">— Every senior engineer ever</p>
        </div>


        {/* --- CTA --- */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#13131a] px-6 py-24 shadow-2xl sm:px-24 xl:py-32 text-center">
          <div className="absolute -top-[30%] left-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/30 via-[#070708]/50 to-[#070708] blur-[100px]"></div>
          
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your next skill is 30 seconds away.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Type a topic. Pick your level. Let the AI do the curriculum design. You just have to show up and learn.
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