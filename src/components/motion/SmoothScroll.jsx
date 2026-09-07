"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
  const root = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    let lenis = null;
    let tickerCallback = null;
    let disposed = false;

    // Load and initialize Lenis smoothly
    import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;

      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.0,
        syncTouch: false,
      });

      // Synchronize GSAP ScrollTrigger with Lenis
      lenis.on("scroll", ScrollTrigger.update);

      tickerCallback = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      // Smooth Anchor Click Navigation
      const handleAnchorClick = (e) => {
        const anchor = e.target.closest("a[href^='#']");
        if (!anchor) return;
        const targetId = anchor.getAttribute("href");
        if (targetId && targetId !== "#") {
          const targetEl = document.querySelector(targetId);
          if (targetEl && lenis) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -60, duration: 1.1 });
          }
        }
      };

      document.addEventListener("click", handleAnchorClick);

      return () => {
        document.removeEventListener("click", handleAnchorClick);
      };
    });

    return () => {
      disposed = true;
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      if (lenis) lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <div ref={root} className="smooth-scroll-wrapper min-h-full flex flex-col">{children}</div>;
}
