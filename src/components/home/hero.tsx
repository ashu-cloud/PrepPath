"use client";

import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

// easing helper to satisfy TypeScript
const ease: any = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};

const wordAnim: Variants = {
  hidden: { y: 90, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.85, ease } },
};

const fadeUp: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: (d: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: d, ease },
  }),
};

function FloatingCard({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease }}
      className={`absolute rounded-2xl border border-white/[0.08] bg-[#13131a]/90 p-4 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const glow1X = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const glow1Y = useTransform(springY, [-0.5, 0.5], [-30, 30]);
  const glow2X = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const glow2Y = useTransform(springY, [-0.5, 0.5], [18, -18]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
      {/* Background glows */}
      <motion.div
        style={{ x: glow1X, y: glow1Y }}
        className="pointer-events-none absolute left-1/2 top-[35%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.14] blur-[80px]"
      />
      <motion.div
        style={{ x: glow2X, y: glow2Y }}
        className="pointer-events-none absolute left-[20%] top-[60%] h-[360px] w-[360px] rounded-full bg-sky-500/[0.09] blur-[70px]"
      />

      {/* Live badge */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 font-mono text-[0.72rem] tracking-widest text-white/40"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
        AI-POWERED LEARNING — NOW LIVE
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        className="font-display text-[clamp(3.2rem,8.5vw,7.2rem)] font-extrabold leading-[1.0] tracking-[-0.04em]"
      >
        {/* Line 1 */}
        <span className="block overflow-hidden">
          <motion.span variants={wordAnim} className="inline-block">
            Learn&nbsp;
          </motion.span>
          <motion.span
            variants={wordAnim}
            className="inline-block bg-gradient-to-r from-white via-violet-300 to-sky-400 bg-clip-text text-transparent"
          >
            Anything.
          </motion.span>
        </span>
        {/* Line 2 */}
        <span className="block overflow-hidden">
          <motion.span variants={wordAnim} className="inline-block">
            Your&nbsp;
          </motion.span>
          <motion.span variants={wordAnim} className="inline-block">
            Way.
          </motion.span>
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        custom={0.85}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mx-auto mt-6 max-w-[500px] text-[1.02rem] font-light leading-relaxed text-white/40"
      >
        AI-generated courses tailored to your exact knowledge level. Type a topic,
        choose your depth — PrepPath builds the curriculum for you.
      </motion.p>

      {/* CTAs */}
      <motion.div
        custom={1.05}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/sign-up"
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-7 py-3 text-[0.9rem] font-bold tracking-tight text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(139,92,246,0.4)]"
        >
          <span className="relative z-10">Start Learning Free →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-sky-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <button className="group flex items-center gap-2 text-[0.88rem] font-light text-white/40 transition-colors hover:text-white">
          Watch demo
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.div>

      {/* Floating preview cards */}
      <div className="pointer-events-none relative mt-20 hidden h-52 w-full max-w-4xl md:block">
        {/* Left card */}
        <FloatingCard
          className="left-0 bottom-4 w-52"
          delay={1.2}
        >
          <p className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-white/30">
            Your Progress
          </p>
          <p className="font-display text-[0.88rem] font-bold">System Design</p>
          <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-500 to-violet-400" />
          </div>
          <p className="mt-1.5 text-[0.62rem] text-white/25">68% complete · 4 modules left</p>
        </FloatingCard>

        {/* Center card */}
        <FloatingCard
          className="bottom-12 left-1/2 w-60 -translate-x-1/2"
          delay={1.35}
        >
          <p className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-white/30">
            AI Generated
          </p>
          <p className="font-display text-[0.88rem] font-bold">Next.js 15 Deep Dive</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {["Server Components", "App Router", "Caching"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[0.58rem] text-white/30"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[0.62rem] text-white/25">12 modules · Intermediate</p>
        </FloatingCard>

        {/* Right card */}
        <FloatingCard
          className="right-0 bottom-2 w-52"
          delay={1.5}
        >
          <p className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-white/30">
            Adaptive Level
          </p>
          <p className="font-display text-[0.88rem] font-bold">Knowledge Model</p>
          <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" />
          </div>
          <p className="mt-1.5 text-[0.62rem] text-white/25">Intermediate → Advanced</p>
        </FloatingCard>
      </div>

      {/* Scroll hint */}
      <motion.div
        custom={1.6}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent [animation:scrollLine_2s_infinite]" />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/20">
          scroll
        </span>
      </motion.div>

      <style>{`
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}
