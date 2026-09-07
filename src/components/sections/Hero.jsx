"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, CalendarDays } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData } from "@/data/siteData";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 6-Scene Living Salon Campaign Sequence (Seamless Filmic Loop, Zero UI Controls)
const heroScenes = [
  {
    id: "mens-precision-cut",
    alt: "Masterclass Indian men's precision haircut and craft at Glamour Emporium",
    src: "/images/hero/campaign/mens-precision-cut.webp",
  },
  {
    id: "womens-hair-styling",
    alt: "Bespoke Indian women's hair styling and blowout at Glamour Emporium",
    src: "/images/hero/campaign/womens-hair-styling.webp",
  },
  {
    id: "mens-beard-grooming",
    alt: "Precision beard detailing and men's grooming at Glamour Emporium",
    src: "/images/hero/campaign/mens-beard-grooming.webp",
  },
  {
    id: "womens-hair-colour",
    alt: "Dimensional balayage and luxury hair colour at Glamour Emporium",
    src: "/images/hero/campaign/womens-hair-colour.webp",
  },
  {
    id: "beauty-care",
    alt: "Professional beauty finishing treatment at Glamour Emporium",
    src: "/images/hero/campaign/beauty-care.webp",
  },
  {
    id: "unisex-finished-look",
    alt: "Signature unisex salon campaign at Glamour Emporium",
    src: "/images/hero/campaign/unisex-finished-look.webp",
  },
];

export default function Hero() {
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const copyRef = useRef(null);
  const heroVisualRef = useRef(null);
  const subjectStageRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  // Proactively preload and decode all 6 campaign images into GPU memory on mount to eliminate flicker or lag
  useEffect(() => {
    if (typeof window === "undefined") return;

    heroScenes.forEach((scene) => {
      const img = new window.Image();
      img.src = scene.src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, []);

  // Automatic 6-Scene Film Loop (~4.5s per scene, continuous smooth cycle)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveLookIndex((prev) => (prev + 1) % heroScenes.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Entrance & Subtle Parallax GSAP animations
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Headline masked lines reveal
      const lines = headlineRef.current?.querySelectorAll(".hero-line-inner");
      if (lines && lines.length > 0) {
        tl.fromTo(
          lines,
          { y: "115%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.9, stagger: 0.08 },
          0
        );
      }

      // 2. Kicker, copy & CTAs fade up
      const copyElements = copyRef.current?.querySelectorAll(".hero-fade");
      if (copyElements && copyElements.length > 0) {
        tl.fromTo(
          copyElements,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          0.15
        );
      }

      // 3. Right Visual Stage Entrance
      if (subjectStageRef.current) {
        tl.fromTo(
          subjectStageRef.current,
          { scale: 0.95, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: "power2.out" },
          0.1
        );
      }

      // 4. Scroll Parallax on Desktop (Subject floats with scroll depth)
      if (containerRef.current && subjectStageRef.current && window.innerWidth >= 1024) {
        gsap.to(subjectStageRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        if (headlineRef.current) {
          gsap.to(headlineRef.current, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }
    }, containerRef);

    // Desktop Subtle Cursor-Reactive Depth (Restrained ±8px max movement, ±2.5deg tilt)
    const container = containerRef.current;
    let mouseMoveHandler;
    let mouseLeaveHandler;

    if (container && window.matchMedia("(pointer: fine)").matches) {
      mouseMoveHandler = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        if (subjectStageRef.current) {
          gsap.to(subjectStageRef.current, {
            x: xPos * 8,
            y: yPos * 6,
            rotateY: xPos * 2.5,
            rotateX: -yPos * 2,
            duration: 1.2,
            ease: "power2.out",
          });
        }
      };

      mouseLeaveHandler = () => {
        if (subjectStageRef.current) {
          gsap.to(subjectStageRef.current, {
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            duration: 1.0,
            ease: "power2.out",
          });
        }
      };

      container.addEventListener("mousemove", mouseMoveHandler);
      container.addEventListener("mouseleave", mouseLeaveHandler);
    }

    return () => {
      ctx.revert();
      if (container) {
        if (mouseMoveHandler) container.removeEventListener("mousemove", mouseMoveHandler);
        if (mouseLeaveHandler) container.removeEventListener("mouseleave", mouseLeaveHandler);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] w-full bg-[#0c0b0a] text-[#f5f2eb] flex flex-col justify-between overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-32 lg:pb-10"
    >
      {/* Background Ambient Lighting Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[45vw] h-[45vw] rounded-full bg-[#c9a87c]/8 blur-[130px]" />
        <div className="absolute -bottom-20 left-10 w-[35vw] h-[35vw] rounded-full bg-[#2d2822]/25 blur-[110px]" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ============================================================ */}
          {/* LEFT SIDE: Dominant Headline, Grounded Copy & Clear CTAs     */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 flex flex-col justify-center z-20">
            <div ref={copyRef}>
              
              {/* Category Kicker */}
              <div className="hero-fade inline-flex items-center gap-2 mb-3 sm:mb-5">
                <span className="h-[1px] w-6 bg-[#c9a87c]" />
                <span className="text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-[#c9a87c] font-semibold">
                  HAIR • BEAUTY • GROOMING
                </span>
              </div>

              {/* Dominant Editorial Headline: OWN YOUR LOOK. */}
              <h1
                id="hero-title"
                ref={headlineRef}
                className="font-serif text-[clamp(3.15rem,11.5vw,8.5rem)] leading-[0.88] tracking-tighter uppercase font-light text-[#f5f2eb] my-1 select-none"
              >
                <span className="block overflow-hidden py-1 -my-1">
                  <span className="hero-line-inner block text-[#f5f2eb]">OWN</span>
                </span>
                <span className="block overflow-hidden py-1 -my-1">
                  <span className="hero-line-inner block italic font-normal text-[#c9a87c]">
                    YOUR
                  </span>
                </span>
                <span className="block overflow-hidden py-1 -my-1">
                  <span className="hero-line-inner block text-[#f5f2eb]">LOOK.</span>
                </span>
              </h1>

              {/* Grounded, Real Supporting Copy */}
              <p className="hero-fade mt-5 sm:mt-7 max-w-md text-sm sm:text-base text-[#eae6df] font-sans leading-relaxed">
                Hair, beauty and grooming designed around you. For him. For her. For every version of you.
              </p>

              {/* CTAs: Guaranteed High Contrast & Visible Text */}
              <div className="hero-fade mt-7 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5">
                
                {/* Primary CTA: Visible Ivory with Dark Text & Champagne Hover Sweep */}
                <a
                  href={siteData.booking.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] shadow-[0_4px_25px_rgba(245,242,235,0.15)] hover:shadow-[0_4px_30px_rgba(201,168,124,0.35)] min-h-[48px] w-full sm:w-auto text-center"
                  style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                >
                  <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-[#0c0b0a]">
                    <CalendarDays className="w-4 h-4 text-[#0c0b0a]" />
                    <span>BOOK YOUR SLOT</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </span>
                </a>

                {/* Secondary CTA: Explore Services link */}
                <a
                  href="#services"
                  className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#eae6df] hover:text-white border-b border-white/20 hover:border-[#c9a87c] transition-all min-h-[48px]"
                >
                  <span>EXPLORE SERVICES</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>

              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDE: Living Salon Campaign (Integrated 6-Scene Blend)  */}
          {/* ============================================================ */}
          <div
            ref={heroVisualRef}
            className="lg:col-span-6 relative flex items-center justify-center w-full min-h-[380px] sm:min-h-[500px] lg:min-h-[640px] select-none pointer-events-none mt-4 lg:mt-0"
          >
            {/* Background Typographic Depth Watermark */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(5.5rem,15vw,14rem)] font-light tracking-widest text-[#f5f2eb] opacity-[0.035] select-none pointer-events-none z-0"
              aria-hidden="true"
            >
              GLAMOUR
            </div>

            {/* Ambient Radial Spotlight Glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[460px] lg:w-[520px] h-[320px] sm:h-[460px] lg:h-[520px] rounded-full bg-[#c9a87c]/10 blur-[100px] sm:blur-[110px] pointer-events-none z-0"
              aria-hidden="true"
            />

            {/* Integrated Campaign Stage — Seamless Left & Edge Dissolve */}
            <div
              ref={subjectStageRef}
              className="relative w-full h-[400px] sm:h-[520px] lg:h-[620px] flex items-center justify-center z-10 overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 24%, black 36%, black 92%, transparent 100%), linear-gradient(to bottom, black 82%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 24%, black 36%, black 92%, transparent 100%), linear-gradient(to bottom, black 82%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "destination-in",
              }}
            >
              {heroScenes.map((scene, idx) => {
                const isActive = idx === activeLookIndex;
                return (
                  <div
                    key={scene.id}
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out pointer-events-none"
                    style={{
                      opacity: isActive ? 1 : 0,
                      zIndex: isActive ? 10 : 5,
                      willChange: "opacity",
                    }}
                  >
                    <div
                      className={`relative w-full h-full max-w-[560px] flex items-center justify-center transition-transform duration-[4800ms] ease-out ${
                        isActive ? "scale-[1.045] translate-x-0" : "scale-[1.0] translate-x-1"
                      }`}
                      style={{ willChange: "transform" }}
                    >
                      <Image
                        src={scene.src}
                        alt={scene.alt}
                        fill
                        priority={idx === 0}
                        loading="eager"
                        sizes="(max-width: 768px) 95vw, (max-width: 1200px) 50vw, 600px"
                        className="object-cover saturate-[0.92] contrast-[1.04]"
                      />
                      {/* Deep dark edge vignettes to dissolve into background */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-transparent to-transparent opacity-60 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b0a] via-transparent to-[#0c0b0a]/40 opacity-80 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
