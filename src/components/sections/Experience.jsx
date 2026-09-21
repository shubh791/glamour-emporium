"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ============================================================================
 * IMAGE GENERATION PROMPTS (For future asset generation / replacement):
 * ============================================================================
 * 
 * IMAGE 01 — CONSULTATION:
 * Premium editorial salon consultation scene featuring an Indian client
 * and professional stylist discussing a hairstyle in front of a mirror,
 * luxury modern salon interior, warm directional light,
 * natural interaction, sophisticated neutral palette,
 * deep espresso, ivory and taupe tones,
 * high-end beauty editorial photography,
 * realistic skin and hair texture,
 * cinematic shallow depth of field,
 * no text, no logos,
 * vertical 4:5 composition.
 * 
 * IMAGE 02 — CREATE:
 * Cinematic close-up of a professional hairstylist cutting and shaping
 * the hair of an Indian client, elegant controlled hand movement,
 * professional scissors and comb,
 * rich dark hair texture visible,
 * premium salon environment,
 * warm focused lighting,
 * deep neutral background,
 * high-end editorial beauty campaign photography,
 * photorealistic,
 * no text, no logos,
 * vertical 4:5 composition.
 * 
 * IMAGE 03 — REFINE:
 * Luxury editorial detail photograph of hair styling and finishing,
 * close-up of hands refining texture and shape,
 * visible glossy healthy hair strands,
 * subtle grooming tools,
 * warm cinematic salon lighting,
 * minimal premium environment,
 * rich espresso and ivory tones,
 * fashion magazine beauty photography,
 * photorealistic,
 * no text, no logos,
 * vertical 4:5 composition.
 * 
 * IMAGE 04 — FINISH:
 * Premium final-look editorial portrait of a stylish Indian client
 * after professional salon styling,
 * confident relaxed expression,
 * polished hair and grooming,
 * luxury fashion campaign lighting,
 * deep neutral background,
 * warm ivory highlights,
 * realistic hair and skin texture,
 * sophisticated magazine photography,
 * photorealistic,
 * no text, no logos,
 * vertical 4:5 composition.
 * ============================================================================
 */

const experienceSteps = [
  {
    id: "01",
    stepNumber: "01",
    label: "01 / CONSULT",
    title: "CONSULT",
    subtitle: "Your Vision",
    description:
      "Tell us the look, service or concern you have in mind. A friendly consultation ensures every detail matches your preferences and lifestyle.",
    image: {
      src: "/images/experience/consultation.webp",
      alt: "Stylist and client discussing personalized haircut and styling at Glamour Emporium in Panipat",
      position: "50% 35%",
      label: "01 / CONSULTATION",
    },
    whatsappMessage:
      "Hi Glamour Emporium, I would like to book a consultation for a styling appointment.",
  },
  {
    id: "02",
    stepNumber: "02",
    label: "02 / CREATE",
    title: "CREATE",
    subtitle: "The Craft",
    description:
      "Our team works with your preferences to create a look suited to you using quality hair and skin products with dedicated attention.",
    image: {
      src: "/images/experience/02-create-craft.jpg",
      alt: "Professional hairstylist cutting and styling hair at Glamour Emporium in Panipat",
      position: "50% 25%",
      label: "02 / CREATION",
    },
    whatsappMessage:
      "Hi Glamour Emporium, I would like to book a cut and styling appointment.",
  },
  {
    id: "03",
    stepNumber: "03",
    label: "03 / REFINE",
    title: "REFINE",
    subtitle: "The Precision",
    description:
      "Every cut, edge and contour is refined for clean lines and natural balance so your styling looks effortless from every angle.",
    image: {
      src: "/images/experience/refine-detail.webp",
      alt: "Stylist refining hair texture and finish at Glamour Emporium in Panipat",
      position: "50% 30%",
      label: "03 / REFINEMENT",
    },
    whatsappMessage:
      "Hi Glamour Emporium, I would like to enquire about haircut refinement and grooming.",
  },
  {
    id: "04",
    stepNumber: "04",
    label: "04 / KEEP",
    title: "KEEP",
    subtitle: "Daily Maintenance",
    description:
      "Get simple guidance to help maintain your look after your visit, with advice on home styling and care tailored to your hair or skin.",
    image: {
      src: "/images/experience/04-keep-maintenance.jpg",
      alt: "Stylist discussing aftercare hair products with client at Glamour Emporium in Panipat",
      position: "50% 25%",
      label: "04 / MAINTENANCE",
    },
    whatsappMessage:
      "Hi Glamour Emporium, I would like to book a complete styling and finishing appointment.",
  },
];

const AUTOPLAY_INTERVAL = 3000; // 3.0 seconds per ritual step

export default function Experience() {
  const { openBooking } = useBooking();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Reset and restart the timer cleanly
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % experienceSteps.length);
    }, AUTOPLAY_INTERVAL);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Manual step click handler: switches step immediately and restarts auto-cycle
  const handleStepClick = useCallback(
    (idx) => {
      setActiveStepIndex(idx);
      if (!prefersReducedMotion && isInView) {
        startTimer();
      }
    },
    [prefersReducedMotion, isInView, startTimer]
  );

  // Viewport observer: auto-advance only when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay loop execution
  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      stopTimer();
      return;
    }

    startTimer();
    return () => stopTimer();
  }, [isInView, prefersReducedMotion, startTimer, stopTimer]);

  const activeStep = experienceSteps[activeStepIndex] || experienceSteps[0];

  return (
    <section
      ref={containerRef}
      id="experience"
      aria-labelledby="experience-heading"
      className="relative w-full bg-[#0c0b0a] text-[#f5f2eb] overflow-hidden"
    >
      {/* Subtle Ambient Studio Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[#c9a87c]/6 blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[30vw] h-[30vw] rounded-full bg-[#2a2620]/25 blur-[120px]" />
      </div>

      {/* ============================================================ */}
      {/* DESKTOP 3-COLUMN INTERACTIVE EXPERIENCE                      */}
      {/* ============================================================ */}
      <div className="hidden lg:flex relative z-10 mx-auto max-w-7xl w-full min-h-[90vh] px-6 lg:px-8 flex-col justify-between py-20">
        {/* Top Header Introduction */}
        <div className="flex items-end justify-between border-b border-white/10 pb-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a87c]">
              THE EXPERIENCE
            </span>
            <h2
              id="experience-heading"
              className="font-serif text-[clamp(2.75rem,4.5vw,4rem)] leading-[0.95] tracking-tight font-light text-[#f5f2eb] mt-2"
            >
              THE GLAMOUR{" "}
              <span className="italic font-normal text-[#c9a87c]">RITUAL.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#eae6df]/75 font-sans leading-relaxed pb-1 text-right">
            A relaxed salon experience on Jattal Road, Panipat. Personal attention, considered styling and care for men and women.
          </p>
        </div>

        {/* Central 3-Column Storytelling Stage */}
        <div className="grid grid-cols-12 gap-8 items-center my-auto py-8">
          
          {/* LEFT COLUMN: Step Progress Navigator (~25% Width) */}
          <div className="col-span-3 flex flex-col justify-center">
            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#c9a87c] mb-6">
              RITUAL SEQUENCE
            </div>

            <div className="flex flex-col gap-4 border-l border-white/15 pl-5" role="tablist" aria-label="Ritual steps">
              {experienceSteps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleStepClick(idx)}
                    className="group flex flex-col text-left py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs tracking-widest transition-colors duration-300 ${
                          isActive
                            ? "text-[#c9a87c] font-semibold"
                            : "text-white/40 group-hover:text-white/80"
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                      <span
                        className={`font-serif text-lg tracking-tight transition-all duration-300 ${
                          isActive
                            ? "text-[#f5f2eb] font-normal translate-x-1"
                            : "text-white/50 group-hover:text-[#f5f2eb]"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono tracking-[0.16em] uppercase pl-7 transition-colors duration-300 ${
                        isActive ? "text-[#c9a87c]/80" : "text-white/20"
                      }`}
                    >
                      {step.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTER COLUMN: GPU-Accelerated Pre-rendered Visual Stage (~45% Width) */}
          <div className="col-span-5 relative flex items-center justify-center">
            {/* Background Typographic Numeral Watermark */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[12rem] font-light tracking-tighter text-[#f5f2eb] opacity-[0.04] select-none pointer-events-none z-0 transition-all duration-500"
              aria-hidden="true"
            >
              {activeStep.stepNumber}
            </div>

            {/* Central 4:5 Visual Frame with GPU Stacked Layers */}
            <div className="relative w-full max-w-[390px] aspect-[4/5] bg-[#141312] border border-white/15 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10">
              {experienceSteps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <div
                    key={step.id}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scale(1)" : "scale(1.03)",
                      zIndex: isActive ? 10 : 1,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      sizes="(max-width: 1200px) 35vw, 400px"
                      className="object-cover saturate-[0.88] contrast-[1.05]"
                      style={{ objectPosition: step.image.position }}
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                    />

                    {/* Subtle Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a]/80 via-transparent to-transparent pointer-events-none" />

                    {/* Editorial Corner Badge */}
                    <div className="absolute bottom-3.5 left-3.5 z-20 font-mono text-[8px] uppercase tracking-[0.24em] text-[#f5f2eb] bg-[#0c0b0a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/15">
                      {step.image.label}
                    </div>

                    {/* Active Step Indicator */}
                    <div className="absolute top-3.5 right-3.5 z-20 font-mono text-[8px] uppercase tracking-[0.2em] text-[#c9a87c] bg-black/60 backdrop-blur-sm px-2 py-0.5 border border-[#c9a87c]/30">
                      STEP {step.stepNumber} / 04
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Step Narrative & CTA (~30% Width) */}
          <div className="col-span-4 relative min-h-[220px] flex flex-col justify-center pl-4">
            {experienceSteps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={step.id}
                  className="transition-all duration-400 ease-out flex flex-col gap-5"
                  style={{
                    display: isActive ? "flex" : "none",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(10px)",
                  }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-[#c9a87c] tracking-widest">
                      MOMENT {step.stepNumber}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs font-mono tracking-widest uppercase text-white/50">
                      {step.subtitle}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] tracking-tight font-light text-[#f5f2eb] leading-tight">
                    {step.title}
                  </h3>

                  <p className="text-[15px] text-[#eae6df]/85 font-sans leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => openBooking()}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#f5f2eb] text-[#0c0b0a] hover:bg-[#c9a87c] text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 min-h-[44px] cursor-pointer"
                      style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-[#0c0b0a]/80" />
                      <span>BOOK A SLOT</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Horizontal Editorial Meta */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
          <div>GLAMOUR EMPORIUM / EXPERIENCE</div>
          <div>MOMENT {activeStep.stepNumber} OF 04</div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE INTERACTIVE RITUAL STAGE (Clean, Focused & Responsive) */}
      {/* ============================================================ */}
      <div className="lg:hidden px-4 sm:px-6 py-16 sm:py-20 flex flex-col gap-8">
        
        {/* Mobile Header */}
        <div className="border-b border-white/10 pb-6 flex flex-col gap-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c9a87c]">
            THE EXPERIENCE
          </span>
          <h2 className="font-serif text-[clamp(2.25rem,7vw,3.5rem)] font-light tracking-tight text-[#f5f2eb] leading-tight">
            THE GLAMOUR <span className="italic text-[#c9a87c]">RITUAL.</span>
          </h2>
          <p className="text-sm text-[#eae6df]/80 font-sans leading-relaxed mt-1">
            A relaxed salon experience on Jattal Road, Panipat. Personal attention, considered styling and care for men and women.
          </p>
        </div>

        {/* Step Selector Tabs (4-Pill Grid for fast mobile switching) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label="Ritual moments">
          {experienceSteps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleStepClick(idx)}
                className={`py-2.5 px-3 border text-left transition-all duration-300 cursor-pointer min-h-[44px] flex flex-col justify-center ${
                  isActive
                    ? "border-[#c9a87c] bg-[#1a1816] shadow-[0_4px_15px_rgba(201,168,124,0.15)]"
                    : "border-white/15 bg-black/30 hover:border-white/30"
                }`}
              >
                <span
                  className={`font-mono text-[9px] tracking-widest block transition-colors ${
                    isActive ? "text-[#c9a87c] font-bold" : "text-white/40"
                  }`}
                >
                  {step.stepNumber}
                </span>
                <span
                  className={`font-serif text-sm tracking-tight block truncate transition-colors ${
                    isActive ? "text-[#f5f2eb] font-medium" : "text-white/60"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Focused Mobile 4:5 Visual Frame */}
        <div className="relative w-full max-w-[420px] mx-auto aspect-[4/5] bg-[#141312] border border-white/15 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.85)]">
          {experienceSteps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <div
                key={step.id}
                className="absolute inset-0 transition-all duration-500 ease-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "scale(1)" : "scale(1.03)",
                  zIndex: isActive ? 10 : 1,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="(max-width: 768px) 95vw, 420px"
                  className="object-cover saturate-[0.88] contrast-[1.05]"
                  style={{ objectPosition: step.image.position }}
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f5f2eb] bg-[#0c0b0a]/90 px-2.5 py-1 border border-white/15">
                  {step.image.label}
                </div>
                <div className="absolute top-3 right-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#c9a87c] bg-black/60 backdrop-blur-sm px-2 py-0.5 border border-[#c9a87c]/30">
                  MOMENT {step.stepNumber} / 04
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Narrative Card */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#c9a87c] font-semibold">
                MOMENT {activeStep.stepNumber}
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/60">
                {activeStep.subtitle}
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-white/40">
              GLAMOUR EMPORIUM
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#f5f2eb]">
            {activeStep.title}
          </h3>

          <p className="text-sm text-[#eae6df]/85 font-sans leading-relaxed">
            {activeStep.description}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center justify-between w-full p-4 bg-[#f5f2eb] text-[#0c0b0a] font-bold text-xs tracking-[0.18em] uppercase hover:bg-[#c9a87c] transition-colors min-h-[48px] shadow-[0_4px_20px_rgba(245,242,235,0.12)] cursor-pointer"
              style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#0c0b0a]/80" />
                <span>BOOK A SLOT</span>
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Section Footer */}
        <div className="text-center font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 pt-2 border-t border-white/10">
          GLAMOUR EMPORIUM / THE RITUAL
        </div>
      </div>
    </section>
  );
}
