"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { label: "Courses", href: "/courses" },
  { label: "Generate", href: "/generate" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 md:px-10 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#070708]/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-gradient-to-br from-violet-500 to-sky-400 text-xs font-black text-white">
          P
        </div>
        <span className="font-display text-[1.1rem] font-extrabold tracking-tight">
          PrepPath
        </span>
      </Link>

      {/* Links */}
      <div className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-[0.85rem] font-normal tracking-wide text-white/40 transition-colors hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/signup"
        className="rounded-full bg-white px-5 py-2 text-[0.8rem] font-bold tracking-tight text-[#070708] transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]"
      >
        Get Started Free
      </Link>
    </motion.nav>
  );
}
