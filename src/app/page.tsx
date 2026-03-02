import type { Metadata } from "next";
import CustomCursor from "@/components/ui/custom-cursor";
import Navbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";
import MarqueeSection from "@/components/home/marquee-section";
import HowItWorks from "@/components/home/how-it-works";
import CoursesSection from "@/components/home/courses-section";
import {
  StatsSection,
  GenerateSection,
  TestimonialsSection,

  Footer,
} from "@/components/home/sections";

export const metadata: Metadata = {
  title: "PrepPath — Learn Anything. Your Way.",
  description:
    "AI-generated courses tailored to your exact knowledge level. Type a topic, choose your depth — PrepPath builds the curriculum for you.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070708] text-white antialiased">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      <CustomCursor />
      <Navbar />
      <Hero />
      <MarqueeSection />
      <HowItWorks />
      <CoursesSection />
      {/* <StatsSection /> */}
      <GenerateSection />
      <TestimonialsSection />
      {/* <CTASection /> */}
      <Footer />
    </main>
  );
}
