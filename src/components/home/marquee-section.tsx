"use client";

const TOPICS = [
  "System Design", "Machine Learning", "Data Structures",
  "React & Next.js", "TypeScript", "Database Design",
  "Docker & DevOps", "Algorithms", "API Design", "Cloud Computing",
];

export default function MarqueeSection() {
  const doubled = [...TOPICS, ...TOPICS];

  return (
    <div className="overflow-hidden border-y border-white/[0.06] py-5">
      <div className="flex w-max animate-[marquee_35s_linear_infinite] items-center gap-12 hover:[animation-play-state:paused]">
        {doubled.map((topic, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="font-display text-[0.9rem] font-bold text-white/20 transition-colors duration-200 hover:text-white/60">
              {topic}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
