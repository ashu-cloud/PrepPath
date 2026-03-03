"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Send, MessageSquareHeart, Ghost, Sparkles, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'

export default function FeedbackPage() {
  const { user, isLoaded } = useUser()
  const [mode, setMode] = useState<'direct' | 'anonymous'>('direct')
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const email = user?.primaryEmailAddress?.emailAddress
  const name = user?.fullName || 'Learner'

  // Inside your FeedbackPage handleSubmit function:
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || rating === 0) return;

    setStatus('loading');
    try {
      const response = await axios.post('/api/feedback', { 
        name, 
        email, 
        rating, 
        message 
      });

      if (response.data.success) {
        setStatus('success');
      }
    } catch (error) {
      console.error("Failed to send feedback:", error);
      setStatus('idle');
      
    }
};

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070708]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070708] p-6 text-white md:p-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Shape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">Future</span>
          </h1>
          <p className="mt-4 text-white/40 max-w-xl mx-auto">
            Your insights dictate our roadmap. Tell us what you love, what's missing, and how we can build a better learning experience.
          </p>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#13131a] shadow-2xl">
          {/* Background Glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
          
          <div className="grid md:grid-cols-5">
            
            {/* Left Sidebar - The Mode Selector */}
            <div className="border-b border-white/5 bg-black/20 p-8 md:col-span-2 md:border-b-0 md:border-r">
              <h2 className="mb-6 font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/30">
                Feedback Mode
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setMode('direct')}
                  className={`relative flex w-full flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
                    mode === 'direct' 
                      ? 'border-violet-500/30 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.1)]' 
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${mode === 'direct' ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/50'}`}>
                      <MessageSquareHeart className="h-4 w-4" />
                    </div>
                    <span className={`font-bold ${mode === 'direct' ? 'text-white' : 'text-white/60'}`}>Direct Feedback</span>
                  </div>
                  <p className="text-[0.75rem] text-white/40 leading-relaxed pl-11">
                    Best for bug reports, account issues, or feature requests where you'd like a response back.
                  </p>
                </button>

                <button
                  onClick={() => setMode('anonymous')}
                  className={`relative flex w-full flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
                    mode === 'anonymous' 
                      ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${mode === 'anonymous' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/50'}`}>
                      <Ghost className="h-4 w-4" />
                    </div>
                    <span className={`font-bold ${mode === 'anonymous' ? 'text-white' : 'text-white/60'}`}>Go Incognito</span>
                  </div>
                  <p className="text-[0.75rem] text-white/40 leading-relaxed pl-11">
                    Powered by Nymity. Best for brutally honest critiques. 100% untraceable.
                  </p>
                </button>
              </div>
            </div>

            {/* Right Side - The Dynamic Form Area */}
            <div className="p-8 md:col-span-3 md:p-12">
              {mode === 'direct' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  {status === 'success' ? (
                     <div className="flex h-[400px] flex-col items-center justify-center text-center">
                       <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 ring-4 ring-violet-500/20">
                         <CheckCircle2 className="h-10 w-10" />
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-2">Message Received</h3>
                       <p className="text-white/40 max-w-xs">Thank you, {name}. We will review your feedback and get back to you if needed.</p>
                       <Button onClick={() => {setStatus('idle'); setMessage(''); setRating(0);}} variant="ghost" className="mt-8 text-violet-400 hover:text-violet-300">
                         Send another message
                       </Button>
                     </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-black/20 p-4 border border-white/5">
                        <img src={user?.imageUrl} alt="Profile" className="h-10 w-10 rounded-full ring-2 ring-white/10" />
                        <div>
                          <p className="text-sm font-bold text-white">{name}</p>
                          <p className="text-xs text-white/40">{email}</p>
                        </div>
                        <div className="ml-auto rounded-full bg-violet-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-violet-400">
                          Auto-Linked
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="mb-3 block text-sm font-medium text-white/60">How would you rate your experience?</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              className="transition-transform hover:scale-110 focus:outline-none"
                            >
                              <Sparkles 
                                className={`h-8 w-8 transition-colors duration-300 ${
                                  star <= (hoveredStar || rating) 
                                    ? 'fill-violet-500 text-violet-500 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]' 
                                    : 'text-white/10'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-8 flex-1">
                        <label className="mb-3 block text-sm font-medium text-white/60">Your Thoughts</label>
                        <textarea
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="What do you love? What's broken? Don't hold back..."
                          className="h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white placeholder-white/20 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={status === 'loading' || !message || rating === 0}
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white h-12 rounded-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      >
                        {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                          <>
                            Submit Feedback <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex h-full flex-col items-center justify-center text-center py-10">
                  <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                    <Ghost className="h-10 w-10 text-emerald-400" />
                    <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 animate-pulse border-4 border-[#13131a]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">Absolute Anonymity</h3>
                  <p className="text-white/40 max-w-sm mb-10 text-sm leading-relaxed">
                    Speak freely — this is a safe space. We have built Nymity ourselves, so no account info, IP, or browser data ever reaches us. Just your honest thoughts.
                </p>

                  {/* NOTE: Update this href with your actual Nymity app URL */}
                  <a 
                    href="https://nymity-eosin.vercel.app/u/PrepPath" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex h-14 w-full max-w-xs items-center justify-center gap-3 overflow-hidden rounded-xl bg-emerald-600 font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:bg-emerald-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Enter Nymity Portal <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}