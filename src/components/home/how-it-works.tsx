"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";

const STEPS = [
  {
    num: "01 / 04",
    title: "Tell us what you want to learn",
    desc: "Type any topic — from 'React hooks' to 'distributed systems'. PrepPath understands context and intent, not just keywords.",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131a] p-5">
        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/25">
          Tell us your topic
        </p>
        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[0.82rem] text-white/30">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          e.g. "TypeScript generics"
          <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-[blink_.8s_infinite] bg-violet-400 align-text-bottom" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["System Design", "DSA", "React", "Node.js"].map((t, i) => (
            <span
              key={t}
              className={`rounded-full border px-2.5 py-1 text-[0.62rem] ${
                i === 0
                  ? "border-violet-500/40 bg-violet-500/[0.07] text-violet-300"
                  : "border-white/[0.07] text-white/25"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "02 / 04",
    title: "Set your knowledge level",
    desc: "Beginner, intermediate, or advanced — or take a quick diagnostic to let the AI assess your level automatically.",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131a] p-5">
        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/25">
          Set your level
        </p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Beginner", sub: "Start from scratch", color: "emerald", active: false },
            { label: "Intermediate", sub: "I know the basics", color: "violet", active: true },
            { label: "Advanced", sub: "Go deep", color: "white", active: false },
          ].map(({ label, sub, color, active }) => (
            <div
              key={label}
              className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                active
                  ? "border border-violet-500/50 bg-violet-500/[0.1]"
                  : "border border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <span className={`text-[0.8rem] font-medium ${active ? "text-violet-300" : "text-white/30"}`}>
                {active ? "✓ " : ""}{label}
              </span>
              <span className="text-[0.65rem] text-white/20">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "03 / 04",
    title: "AI builds your curriculum",
    desc: "Gemini generates a structured, sequenced course with modules, examples, and exercises — specific to your level and learning style.",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131a] p-5">
        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/25">
          Generated curriculum
        </p>
        <div className="flex flex-col gap-0">
          {[
            { n: "01", label: "What are generics?", done: true },
            { n: "02", label: "Type constraints", done: true },
            { n: "03", label: "Conditional types", active: true },
            { n: "04", label: "Mapped types", dim: true },
          ].map(({ n, label, done, active, dim }) => (
            <div
              key={n}
              className={`flex items-center gap-3 border-b border-white/[0.04] py-2.5 last:border-none ${
                active ? "rounded-lg bg-violet-500/[0.05] px-2" : ""
              } ${dim ? "opacity-30" : ""}`}
            >
              <span className="w-5 font-mono text-[0.62rem] text-white/20">{n}</span>
              <span className={`flex-1 text-[0.78rem] ${active ? "text-violet-300" : "text-white/60"}`}>
                {label}
              </span>
              {done && (
                <span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-400 text-[0.5rem] font-bold text-black">
                  ✓
                </span>
              )}
              {active && (
                <span className="text-[0.6rem] text-violet-400">→ Now</span>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "04 / 04",
    title: "Track progress and level up",
    desc: "As you complete modules, your skill model updates. The course adapts — harder when you're ready, review when you're not.",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131a] p-5">
        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/25">
          Your progress
        </p>
        <div className="mb-4 flex justify-between">
          {[
            { val: "84", label: "Score" },
            { val: "12", label: "Modules done" },
            { val: "↑", label: "Improving", green: true },
          ].map(({ val, label, green }) => (
            <div key={label} className="text-center">
              <div className={`font-display text-[1.8rem] font-extrabold tracking-tight ${green ? "text-emerald-400" : ""}`}>
                {val}
              </div>
              <div className="text-[0.62rem] text-white/25">{label}</div>
            </div>
          ))}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-sky-400" />
        </div>
        <p className="mt-2 text-[0.62rem] text-white/25">72% to Advanced level</p>
      </div>
    ),
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-y border-white/[0.06]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 md:grid-cols-2">
        {/* Sticky left */}
        <div className="sticky top-0 hidden h-screen flex-col justify-center px-10 md:flex">
          <p className="mb-4 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-violet-400">
            <span className="h-px w-6 bg-violet-400" />
            How it works
          </p>
          <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
            Learning,<br />reimagined.
          </h2>
          <p className="mt-4 max-w-[380px] text-[0.95rem] font-light leading-relaxed text-white/40">
            No more one-size-fits-all. PrepPath builds a course around your exact knowledge level.
          </p>

          {/* Visual card area */}
          <div className="relative mt-10 h-[240px] w-[320px]">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                animate={{ opacity: activeStep === i ? 1 : 0, y: activeStep === i ? 0 : 10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {step.visual}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scrolling steps */}
        <div className="py-28 pl-4 pr-6 md:pl-10">
          {STEPS.map((step, i) => (
            <StepItem
              key={i}
              step={step}
              index={i}
              isActive={activeStep === i}
              onActivate={() => setActiveStep(i)}
            />
          ))}
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>
    </div>
  );
}

function StepItem({
  step,
  index,
  isActive,
  onActivate,
}: {
  step: (typeof STEPS)[0];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
  if (inView) onActivate();
}, [inView]);

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: isActive ? 1 : 0.25 }}
      transition={{ duration: 0.4 }}
      className="border-b border-white/[0.05] py-10 last:border-none"
    >
      <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white/25">
        STEP {step.num}
      </p>
      <h3 className="mb-3 font-display text-[1.35rem] font-bold tracking-tight">
        {step.title}
      </h3>
      <p className="text-[0.88rem] leading-relaxed text-white/40">{step.desc}</p>

      {/* Mobile visual */}
      <div className="mt-5 md:hidden">{step.visual}</div>
    </motion.div>
  );
}
