"use client";

import { motion, useMotionValue } from "framer-motion";
import { useRef } from "react";

type Level = "Beginner" | "Intermediate" | "Advanced";

interface Course {
  icon: string;
  level: Level;
  title: string;
  desc: string;
  modules: number;
  iconBg: string;
}

const COURSES: Course[] = [
  { icon: "🏗️", level: "Intermediate", title: "System Design Fundamentals", desc: "Load balancers, caching, databases, microservices — learn to design systems that scale to millions.", modules: 16, iconBg: "bg-sky-500/10" },
  { icon: "⚡", level: "Beginner",      title: "TypeScript from Zero",         desc: "Types, interfaces, generics, and decorators. Go from JavaScript to production-grade TypeScript.", modules: 10, iconBg: "bg-emerald-400/10" },
  { icon: "🤖", level: "Advanced",      title: "LLM Engineering",              desc: "Prompt engineering, RAG pipelines, fine-tuning, and building production AI apps with real constraints.", modules: 22, iconBg: "bg-red-400/10" },
  { icon: "🗄️", level: "Intermediate", title: "Database Internals",           desc: "B-trees, WAL, MVCC, indexing strategies — understand how your database actually works.", modules: 14, iconBg: "bg-amber-400/10" },
  { icon: "⚛️", level: "Intermediate", title: "Next.js 15 Deep Dive",         desc: "App Router, Server Components, streaming, caching, and deployment. Build with confidence.", modules: 18, iconBg: "bg-violet-500/10" },
];

const levelStyle: Record<Level, string> = {
  Beginner:     "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400",
  Intermediate: "border-amber-500/30  bg-amber-500/[0.06]  text-amber-400",
  Advanced:     "border-red-400/30    bg-red-400/[0.06]    text-red-400",
};

function CourseCard({ course, delay }: { course: Course; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current?.style.setProperty("--mx", `${x}%`);
    cardRef.current?.style.setProperty("--my", `${y}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      className="group relative cursor-default overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13131a] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,92,246,0.1)]"
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.07), transparent 70%)",
        }}
      />

      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${course.iconBg}`}>
        {course.icon}
      </div>

      <span
        className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.08em] ${levelStyle[course.level]}`}
      >
        {course.level}
      </span>

      <h3 className="mb-2 font-display text-[0.98rem] font-bold tracking-tight">
        {course.title}
      </h3>
      <p className="mb-5 text-[0.8rem] leading-relaxed text-white/35">{course.desc}</p>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[0.72rem] text-white/25">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          {course.modules} modules
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] text-xs text-white/30 transition-all duration-200 group-hover:rotate-[-45deg] group-hover:border-violet-500 group-hover:bg-violet-500 group-hover:text-white">
          →
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-28">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-violet-400"
          >
            <span className="h-px w-6 bg-violet-400" />
            Explore
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-tight"
          >
            Trending<br />courses
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[280px] text-[0.85rem] leading-relaxed text-white/30"
        >
          Community-curated and AI-enhanced. Browse or generate your own.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course, i) => (
          <CourseCard key={course.title} course={course} delay={i * 0.07} />
        ))}

        {/* Generate your own card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[200px] cursor-default flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/25 bg-violet-500/[0.03] p-6 text-center transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/[0.06]"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-violet-500/40 text-xl text-violet-400">
            +
          </div>
          <h3 className="mb-1.5 font-display text-[0.95rem] font-bold text-violet-300">
            Generate your own
          </h3>
          <p className="text-[0.78rem] leading-relaxed text-white/30">
            Type any topic and let AI build a course tailored to your exact level.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
