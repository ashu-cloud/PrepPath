"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────
function useCounter(target: number, shouldStart: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.round(start));
    }, step);
    return () => clearInterval(timer);
  }, [shouldStart, target]);
  return val;
}

const STATS = [
  { target: 12000, label: "Courses generated",  suffix: "k+" },
  { target: 48000, label: "Learners enrolled",  suffix: "k+" },
  { target: 94,    label: "% satisfaction rate", suffix: "%" },
  { target: 200,   label: "Topics covered",     suffix: "+" },
];

function StatItem({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const raw = useCounter(stat.target, inView);
  const display = stat.target >= 1000 ? (raw / 1000).toFixed(raw >= 10000 ? 0 : 1) : raw;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#070708] p-8 text-center transition-colors duration-300 hover:bg-[#13131a]"
    >
      <span className="block bg-gradient-to-b from-white to-white/40 bg-clip-text font-display text-[2.8rem] font-extrabold tracking-[-0.04em] text-transparent">
        {display}{stat.suffix}
      </span>
      <span className="mt-1 block text-[0.8rem] text-white/25">{stat.label}</span>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="overflow-hidden rounded-3xl border border-white/[0.06]"
           style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
        {STATS.map((s, i) => (
          <StatItem key={s.label} stat={s} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// GENERATE SECTION
// ─────────────────────────────────────────────
const CHECK_ITEMS = [
  "Adapts to your existing knowledge level",
  "Skips what you already know",
  "Updates as you progress through the course",
  "100% free on Gemini's generous free tier",
];

const MODULES = [
  { n: "01", label: "Cache invalidation patterns",   done: true  },
  { n: "02", label: "TTL strategies & expiration",    done: true  },
  { n: "03", label: "Write-through vs write-behind",  active: true },
  { n: "04", label: "LRU eviction deep dive",         dim: true   },
  { n: "05", label: "Redis Cluster & sharding",       dim: true   },
];

export function GenerateSection() {
  return (
    <div className="border-y border-white/[0.06] bg-[#0d0d10]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-6 py-28 md:grid-cols-2 md:items-center">

        {/* Left */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-violet-400"
          >
            <span className="h-px w-6 bg-violet-400" />
            The magic
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight"
          >
            You describe it.<br />AI builds it.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mb-8 max-w-[420px] text-[0.95rem] font-light leading-relaxed text-white/35"
          >
            Tell PrepPath what you want to learn and how much you already know. In seconds,
            you get a structured course — modules, examples, exercises, and quizzes — generated specifically for you.
          </motion.p>

          <div className="flex flex-col gap-3">
            {CHECK_ITEMS.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.07 }}
                className="flex items-center gap-3 text-[0.87rem]"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] text-[0.55rem] text-emerald-400">
                  ✓
                </span>
                <span className="text-white/40">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — terminal card */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13131a] p-5 font-mono text-[0.82rem]"
        >
          {/* Top shimmer */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

          {/* Traffic lights */}
          <div className="mb-4 flex items-center gap-1.5 border-b border-white/[0.06] pb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[0.65rem] text-white/20">PrepPath AI — course generator</span>
          </div>

          {/* Prompt */}
          <div className="leading-[1.9] text-white/30">
            <span className="text-violet-400">topic:</span>{" "}
            <span className="text-emerald-400">"Redis caching strategies"</span>
            <br />
            <span className="text-violet-400">level:</span>{" "}
            <span className="text-emerald-400">intermediate</span>
            <br />
            <span className="text-violet-400">focus:</span>{" "}
            <span className="text-emerald-400">backend, Node.js context</span>
            <br />
            <span className="text-violet-400">skip:</span>{" "}
            <span className="text-white/20">"basic key-value operations"</span>
            <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-[blink_.8s_infinite] bg-violet-400 align-text-bottom" />
          </div>

          {/* Output */}
          <div className="mt-4 rounded-xl border border-violet-500/[0.15] bg-violet-500/[0.04] p-4">
            <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.1em] text-violet-400">
              Generated: 8 modules
            </p>
            {MODULES.map(({ n, label, done, active, dim }) => (
              <div
                key={n}
                className={`flex items-center gap-2.5 border-b border-white/[0.04] py-2 last:border-none ${dim ? "opacity-30" : ""}`}
              >
                <span className="w-5 text-[0.62rem] text-white/20">{n}</span>
                <span className={`flex-1 text-[0.75rem] ${active ? "text-violet-300" : "text-white/50"}`}>
                  {label}
                  {active && " ←"}
                </span>
                {done && (
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-400 text-[0.5rem] font-bold text-black">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "Generated a System Design course at intermediate level and it was exactly what I needed. Skipped all the basics I already knew and went deep on the hard parts.",
    name: "Arjun K.", role: "SWE Intern @ Razorpay", avatar: "AK",
    avatarBg: "bg-violet-500/20 text-violet-300",
  },
  {
    text: "I've tried every platform. PrepPath is different because it actually adapts. When I struggled with generics, the next module had more examples. It noticed.",
    name: "Sneha P.", role: "3rd Year CS @ BITS", avatar: "SP",
    avatarBg: "bg-emerald-500/15 text-emerald-400",
  },
  {
    text: "Generated a Redis course specifically for Node.js backend context. No generic fluff. Just exactly what I needed for my internship project. Used it day one.",
    name: "Rahul V.", role: "Backend Dev @ Startup", avatar: "RV",
    avatarBg: "bg-sky-500/15 text-sky-400",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-28">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-3 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-violet-400"
      >
        <span className="h-px w-6 bg-violet-400" />
        What learners say
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-tight"
      >
        Real results,<br />real people.
      </motion.h2>

      <div className="grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/[0.07] bg-[#13131a] p-7"
          >
            <div className="mb-3 font-serif text-[2.2rem] leading-none text-violet-500">"</div>
            <p className="mb-6 text-[0.87rem] leading-relaxed text-white/40">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[0.8rem] font-bold ${t.avatarBg}`}>
                {t.avatar}
              </div>
              <div>
                <p className="font-display text-[0.82rem] font-semibold">{t.name}</p>
                <p className="text-[0.72rem] text-white/25">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[28px] border border-white/[0.07] p-16 text-center"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.13] blur-[80px]" />

        <h2 className="relative font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight">
          Start learning<br />
          <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            the smarter way.
          </span>
        </h2>

        <p className="relative mx-auto mt-4 max-w-[380px] text-[0.95rem] font-light text-white/35">
          Free forever. No credit card. Generate your first course in 30 seconds.
        </p>

        <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-64 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-[0.87rem] text-white placeholder-white/25 outline-none transition-colors focus:border-violet-500/50"
          />
          <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-[0.87rem] font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(139,92,246,0.4)]">
            <span className="relative z-10">Get started →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-sky-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>

        <p className="relative mt-4 text-[0.7rem] text-white/20">
          Join 48,000+ learners. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] px-6 py-6 text-[0.77rem] text-white/25 md:px-10">
      <span className="font-display font-extrabold text-white/60">PrepPath</span>
      <span>© 2026 PrepPath. Built by Ashu Panchal.</span>
      <div className="flex gap-5">
        {["Privacy", "Terms", "GitHub"].map((l) => (
          <a key={l} href="#" className="transition-colors hover:text-white">
            {l}
          </a>
        ))}
      </div>
    </footer>
  );
}
