"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot is instant — zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const animate = () => {
      // Lerp — 0.18 = subtle trail, increase toward 1.0 for instant ring too
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const onEnter = () => ringRef.current?.classList.add("is-hovering");
    const onLeave = () => ringRef.current?.classList.remove("is-hovering");

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    const attach = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        body, * { cursor: none !important; }

        #c-dot {
          position: fixed; top: -4px; left: -4px;
          width: 8px; height: 8px;
          background: white; border-radius: 50%;
          pointer-events: none; z-index: 99999;
          will-change: transform; mix-blend-mode: exclusion;
        }

        #c-ring {
          position: fixed; top: -18px; left: -18px;
          width: 36px; height: 36px;
          border: 1.5px solid rgba(255,255,255,0.5);
          border-radius: 50%;
          pointer-events: none; z-index: 99998;
          will-change: transform; mix-blend-mode: exclusion;
          transition: width .2s ease, height .2s ease,
                      top .2s ease, left .2s ease,
                      border-color .2s ease;
        }

        #c-ring.is-hovering {
          width: 56px; height: 56px;
          top: -28px; left: -28px;
          border-color: rgb(167,139,250);
        }

        @media (max-width: 1024px) {
          #c-dot, #c-ring { display: none; }
          body, * { cursor: auto !important; }
        }
      `}</style>
      <div id="c-dot"  ref={dotRef}  />
      <div id="c-ring" ref={ringRef} />
    </>
  );
}
