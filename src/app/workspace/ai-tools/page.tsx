"use client"
import React from 'react'
import { 
  Sparkles, 
  Terminal, 
  MessageSquare, 
  FileSearch, 
  BrainCircuit, 
  Zap,
  Code2,
  Mic2
} from 'lucide-react'
import ToolCard from './_components/ToolCard'

const TOOLS = [
//   {
//     title: "Interview Simulator",
//     description: "Practice real-time technical interviews with an AI that asks follow-up questions based on your answers.",
//     icon: MessageSquare,
//     href: "/workspace/ai-tools/interview",
//     color: "violet"
//   },
  {
    title: "Smart Code Refactor",
    description: "Paste your messy code and let AI optimize it for performance, readability, and industry standards.",
    icon: Code2,
    href: "/workspace/ai-tools/refactor",
    color: "emerald"
  },
//   {
//     title: "PDF Study Guide",
//     description: "Upload any document or textbook and have AI generate a comprehensive summary and quiz for you.",
//     icon: FileSearch,
//     href: "/workspace/ai-tools/summarize",
//     color: "amber"
//   },
//   {
//     title: "Voice-to-Note",
//     description: "Talk to PrepPath and let it transform your rambling thoughts into structured study notes.",
//     icon: Mic2,
//     href: "/workspace/ai-tools/voice",
//     color: "rose"
//   }
]

export default function AiToolsPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-violet-400 mb-4">
          <Zap className="h-3 w-3 fill-violet-400" /> Powered by Gemini Ultra
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white mb-4">
          AI <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Superpowers</span>
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Don't just read—interact. Use our specialized AI tools to accelerate your learning, practice for interviews, and optimize your workflow.
        </p>
      </div>

      {/* --- TOOLS GRID --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {TOOLS.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}

        {/* --- COMING SOON CARD --- */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <BrainCircuit className="h-6 w-6 text-white/20" />
            </div>
            <h3 className="font-bold text-white/40">More tools coming soon</h3>
            <p className="text-[0.75rem] text-white/10 mt-2">Suggest a feature in our discord community.</p>
        </div>
      </div>
    </div>
  )
}