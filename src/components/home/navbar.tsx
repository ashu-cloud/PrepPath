"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket } from "lucide-react";

const links = [
  { label: "Courses", href: "/sign-up" },
  { label: "Generate", href: "/sign-up" },
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
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] group-hover:-rotate-12">
            <Rocket className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <span className="font-display text-[1.2rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
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
        href="/sign-up"
        className="rounded-full bg-white px-5 py-2 text-[0.8rem] font-bold tracking-tight text-[#070708] transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]"
      >
        Get Started Free
      </Link>
    </motion.nav>
  );
}
