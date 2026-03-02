"use client"
import React from 'react'
import { 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Infinity, 
  Receipt, 
  ShieldCheck, 
  Wallet,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BillingPage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-emerald-400 mb-4">
          <ShieldCheck className="h-3 w-3" /> 100% Free Forever
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white mb-4">
          Billing & <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Subscription</span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          We were going to charge you $99/mo for this like every other AI startup, but our payment gateway broke and we were too busy building cool features to fix it. 
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- PREMIUM PLAN CARD (THE FLEX) --- */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-[#13131a] p-8 shadow-2xl">
          {/* Background Glows */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-600/[0.1] blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-600/[0.1] blur-[80px]" />
          
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" /> 
                God Mode Tier
              </h2>
              <p className="text-gray-400 mt-2 text-sm max-w-md">
                You are currently on our highest tier. Put your wallet away, you literally cannot give us money even if you tried.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="flex items-start sm:justify-end gap-1">
                <span className="text-2xl font-bold text-gray-500 mt-1">$</span>
                <span className="text-6xl font-black text-white tracking-tighter">0</span>
              </div>
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mt-1">Per Month</p>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10 pt-8 border-t border-white/5">
            {[
              "Infinite AI Course Generations",
              "Unlimited Smart Code Refactoring",
              "Full Access to Interview Simulator",
              "Zero Paywalls, Zero Ads",
              "Priority Access to Nothing (It's all free)",
              "Keeps your bank account happy"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-white hover:bg-gray-200 text-black font-bold h-12 rounded-xl text-sm transition-transform hover:scale-[1.02]">
              <Infinity className="h-4 w-4 mr-2" /> Upgrade to Super God Mode ($1Trillion/sec)
            </Button>
            {/* <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 text-white h-12 rounded-xl text-sm pointer-events-none">
              Cancel Subscription
            </Button> */}
          </div>
        </div>

        {/* --- SIDEBAR: FAKE PAYMENT METHOD & HISTORY --- */}
        <div className="flex flex-col gap-8">
          
          {/* Payment Method */}
          <div className="rounded-3xl border border-white/5 bg-[#0f0f12] p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-400" /> Payment Method
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-12 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                  <CreditCard className="h-4 w-4 text-white/50" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Imaginary Card</p>
                  <p className="text-xs text-gray-500">Expires 13/99</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-4 text-center">
              We don't even have a database table for your credit card. You're safe.
            </p>
          </div>

          {/* Invoice History */}
          <div className="rounded-3xl border border-white/5 bg-[#0f0f12] p-6 flex-1">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gray-400" /> Invoice History
            </h3>
            <div className="space-y-4">
              {[
                { date: "Today", desc: "God Mode Plan", amount: "$0.00" },
                { date: "Last Month", desc: "God Mode Plan", amount: "$0.00" },
                { date: "The Beginning of Time", desc: "God Mode Plan", amount: "$0.00" },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-300">{invoice.desc}</p>
                    <p className="text-xs text-gray-600">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-400">{invoice.amount}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-white/5">
                      <Zap className="h-3 w-3 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}