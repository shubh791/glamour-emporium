"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/siteData";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ============================================================================
 * IMAGE GENERATION PROMPTS (For future asset generation / replacement):
 * ============================================================================
 * 
 * IMAGE 01 — HAIR & STYLING:
 * Luxury editorial salon campaign photograph of a stylish Indian woman in her
 * mid-20s, exceptional glossy layered dark hair with visible movement and
 * individual strands, sophisticated modern professional haircut, confident natural
 * expression, understated luxury makeup, warm ivory and deep espresso studio
 * environment, soft directional key light with beautiful rim lighting through the
 * hair, premium Indian fashion magazine photography, realistic skin texture,
 * cinematic but natural, sophisticated and sensual without being provocative,
 * 85mm editorial photography, photorealistic, no text, no logo, vertical 4:5 composition.
 * 
 * IMAGE 02 — MEN'S GROOMING:
 * Premium editorial grooming campaign photograph of a stylish Indian man in his
 * late-20s, sharp textured contemporary haircut, clean tapered sides, subtle
 * professionally groomed beard, confident relaxed expression, dark tailored
 * fashion wardrobe, warm directional studio lighting emphasizing haircut texture,
 * deep espresso and warm neutral background, sophisticated luxury men's grooming
 * campaign, realistic Indian skin and hair texture, high-end fashion magazine
 * photography, cinematic depth, photorealistic, no text, no logo, vertical 4:5 composition.
 * 
 * IMAGE 03 — BEAUTY & CARE:
 * Luxury Indian beauty editorial photograph, elegant Indian woman with luminous
 * natural skin and refined minimal makeup, close beauty portrait emphasizing
 * healthy skin and sophisticated grooming rather than dramatic cosmetics, dark
 * glossy hair beautifully styled away from portions of the face, warm ivory and
 * muted taupe studio palette, soft sculpted beauty lighting, subtle shadows,
 * premium skincare and salon campaign aesthetic, realistic pores and skin texture,
 * high-end magazine photography, calm confident expression, photorealistic, no text,
 * no logo, vertical 4:5 composition.
 * ============================================================================
 */

const servicesData = [
  {
    id: "01",
    number: "01",
    title: "HAIR & STYLING",
    shortDesc:
      "Tailored cuts, couture styling, and restorative hair care designed around your natural movement, texture, and personal aesthetic.",
    descriptor: "WOMEN & MEN",
    image: {
      src: "/images/services/hair-and-styling.webp",
      alt: "Editorial photograph showcasing bespoke hair styling and blowout at Glamour Emporium",
      position: "50% 30%",
      label: "01 / HAIR & STYLING",
    },
    whatsappMessage:
      "Hi Glamour Emporium, I would like to enquire about Hair & Styling and book a slot.",
  },
  {
    id: "02",
    number: "02",
    title: "MEN'S GROOMING",
    shortDesc:
      "Precision scissor work, tailored fades, beard sculpting, and refined grooming rituals crafted for effortless daily confidence.",
    descriptor: "TAILORED GROOMING",
    image: {
      src: "/images/services/mens-grooming.webp",
      alt: "Editorial photograph showcasing precision men's haircut and beard grooming at Glamour Emporium",
      position: "50% 30%",
      label: "02 / MEN'S GROOMING",
    },
    whatsappMessage:
      "Hi Glamour Emporium, I would like to enquire about Men's Grooming and book a slot.",
  },
  {
    id: "03",
    number: "03",
    title: "BEAUTY & CARE",
    shortDesc:
      "Nourishing skin treatments, dedicated scalp care, and restorative aesthetic rituals to elevate and rejuvenate your natural radiance.",
    descriptor: "SKIN & RITUALS",
    image: {
      src: "/images/services/beauty-and-care.webp",
      alt: "Editorial photograph showcasing facial care and glowing skin treatment at Glamour Emporium",
      position: "50% 35%",
      label: "03 / BEAUTY & CARE",
    },
    whatsappMessage:
      "Hi Glamour Emporium, I would like to enquire about Beauty & Care and book a slot.",
  },
];

export default function Services() {
  const [activeServiceId, setActiveServiceId] = useState("01");
  const [lastViewedServiceId, setLastViewedServiceId] = useState("01");
  const prefersReducedMotion = useReducedMotion();

  const handleServiceToggle = (serviceId) => {
    if (activeServiceId === serviceId) {
      setActiveServiceId(null);
    } else {
      setActiveServiceId(serviceId);
      setLastViewedServiceId(serviceId);
    }
  };

  const displayedServiceId = activeServiceId || lastViewedServiceId;
  const displayedService =
    servicesData.find((s) => s.id === displayedServiceId) || servicesData[0];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full bg-[#f2f0e9] text-[#292c27] py-16 sm:py-20 lg:py-28 overflow-hidden border-t border-[#cecec3]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* TOP INTRODUCTION: Compact, disciplined and editorial         */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-8 sm:pb-12 border-b border-[#cecec3]/80">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#66685e]">
              WHAT WE DO
            </span>
            <h2
              id="services-heading"
              className="font-serif text-[clamp(2.25rem,6.5vw,4.5rem)] leading-[0.95] tracking-tight font-light text-[#292c27] mt-2.5 sm:mt-3"
            >
              CRAFTED<br />
              <span className="italic font-normal">AROUND YOU.</span>
            </h2>
          </div>
          
          <p className="max-w-md text-sm sm:text-base lg:text-lg text-[#66685e] font-sans leading-relaxed pb-1">
            Hair, beauty and grooming for every version of you.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP VIEW: Approved 2-Column Lookbook Stage (Unchanged)   */}
        {/* ============================================================ */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center mt-16">
          
          {/* LEFT: Service Selector List (45% Width on Desktop) */}
          <div className="col-span-6 flex flex-col justify-center">
            <div className="flex flex-col">
              {servicesData.map((service) => {
                const isActive = service.id === activeServiceId;
                const whatsappUrl = buildWhatsAppUrl(service.whatsappMessage);

                return (
                  <div
                    key={service.id}
                    className="border-b border-[#cecec3] transition-colors"
                  >
                    {/* Interactive Service Header Row — Click to toggle open/close */}
                    <button
                      type="button"
                      onClick={() => handleServiceToggle(service.id)}
                      className="w-full py-7 flex items-center justify-between text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292c27] min-h-[52px]"
                      aria-expanded={isActive}
                      aria-controls={`desktop-service-panel-${service.id}`}
                    >
                      <div className="flex items-baseline gap-6">
                        <span
                          className={`font-mono text-sm tracking-widest transition-colors ${
                            isActive
                              ? "text-[#292c27] font-semibold"
                              : "text-[#66685e] group-hover:text-[#292c27]"
                          }`}
                        >
                          {service.number}
                        </span>

                        <h3
                          className={`font-serif text-3xl lg:text-[2.25rem] tracking-tight transition-all duration-300 ${
                            isActive
                              ? "text-[#292c27] font-normal translate-x-1"
                              : "text-[#66685e]/85 group-hover:text-[#292c27]"
                          }`}
                        >
                          {service.title}
                        </h3>
                      </div>

                      <div
                        className={`w-9 h-9 flex items-center justify-center border transition-all duration-300 shrink-0 ${
                          isActive
                            ? "border-[#292c27] bg-[#292c27] text-[#f2f0e9] rotate-45"
                            : "border-[#cecec3] text-[#66685e] group-hover:border-[#292c27] group-hover:text-[#292c27]"
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Active Service Expanded Details */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`desktop-service-panel-${service.id}`}
                          initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0, y: -4 }}
                          animate={prefersReducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: -4 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 pt-1 pl-12 pr-2 flex flex-col gap-5">
                            <p className="text-[16px] text-[#55574e] leading-relaxed max-w-lg font-sans">
                              {service.shortDesc}
                            </p>

                            <div className="pt-2">
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#292c27] text-[#f2f0e9] hover:bg-[#424839] text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_15px_rgba(41,44,39,0.12)] group/btn min-h-[44px]"
                                style={{ color: "#f2f0e9", backgroundColor: "#292c27" }}
                              >
                                <CalendarDays className="w-3.5 h-3.5 text-[#f2f0e9]/80" />
                                <span>BOOK THIS SERVICE</span>
                                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Quiet inquiry note */}
            <p className="mt-8 text-xs text-[#66685e] font-sans tracking-wide">
              For customised requests, availability &amp; consultations, reach out directly via WhatsApp.
            </p>
          </div>

          {/* RIGHT: Dynamic Visual Stage (55% Width on Desktop) */}
          <div className="col-span-6 relative flex items-center justify-center">
            
            {/* Background Typographic Watermark (Service Number) */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(8rem,16vw,14rem)] font-light tracking-tighter text-[#292c27] opacity-[0.05] select-none pointer-events-none z-0"
              aria-hidden="true"
            >
              {displayedService.number}
            </div>

            {/* Main Stage Image Frame (~4:5 Portrait Aspect Ratio) */}
            <div className="relative w-full max-w-[440px] aspect-[4/5] bg-[#e8e6de] border border-[#cecec3] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayedService.id}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 1.035 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 1.025, transition: { duration: 0.3 } }
                  }
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={displayedService.image.src}
                    alt={displayedService.image.alt}
                    fill
                    sizes="40vw"
                    className="object-cover saturate-[0.92] contrast-[1.04]"
                    style={{ objectPosition: displayedService.image.position }}
                    priority={displayedService.id === "01"}
                  />
                  
                  {/* Subtle edge vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Editorial Corner Badge */}
                  <div className="absolute bottom-4 left-4 z-20 font-mono text-[9px] uppercase tracking-[0.24em] text-[#f2f0e9] bg-[#292c27]/90 backdrop-blur-sm px-3 py-1.5 border border-white/15">
                    {displayedService.image.label}
                  </div>

                  {/* Active Descriptor */}
                  <div className="absolute top-4 right-4 z-20 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9]/90 bg-black/50 backdrop-blur-sm px-2.5 py-1">
                    {displayedService.descriptor}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Vertical Sub-Label */}
            <div
              className="hidden xl:block absolute -right-6 top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-[0.3em] text-[#66685e]/60 select-none pointer-events-none"
              style={{ writingMode: "vertical-rl" }}
            >
              GLAMOUR EMPORIUM / SERVICES
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* MOBILE VIEW: Inline Editorial Service Accordion (320px–430px) */}
        {/* ============================================================ */}
        <div className="lg:hidden flex flex-col mt-8 sm:mt-12">
          {servicesData.map((service) => {
            const isActive = service.id === activeServiceId;
            const whatsappUrl = buildWhatsAppUrl(service.whatsappMessage);

            return (
              <div
                key={service.id}
                className="border-b border-[#cecec3] transition-colors"
              >
                {/* Mobile Service Header Row — Click to toggle open/close */}
                <button
                  type="button"
                  onClick={() => handleServiceToggle(service.id)}
                  className="w-full py-4 sm:py-5 flex items-center justify-between text-left group cursor-pointer focus-visible:outline-none min-h-[52px]"
                  aria-expanded={isActive}
                  aria-controls={`mobile-service-panel-${service.id}`}
                >
                  <div className="flex items-baseline gap-3 sm:gap-4 min-w-0 flex-1 pr-3">
                    <span
                      className={`font-mono text-xs tracking-widest shrink-0 transition-colors ${
                        isActive
                          ? "text-[#292c27] font-bold"
                          : "text-[#66685e] group-hover:text-[#292c27]"
                      }`}
                    >
                      {service.number}
                    </span>

                    <h3
                      className={`font-serif text-[clamp(1.35rem,5.8vw,1.95rem)] tracking-tight transition-all duration-300 truncate leading-tight ${
                        isActive
                          ? "text-[#292c27] font-normal"
                          : "text-[#66685e]/90 group-hover:text-[#292c27]"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Editorial Plus/Minus Indicator */}
                  <div
                    className={`w-8 h-8 rounded-[2px] flex items-center justify-center border transition-all duration-300 shrink-0 ${
                      isActive
                        ? "border-[#292c27] bg-[#292c27] text-[#f2f0e9]"
                        : "border-[#cecec3] text-[#66685e] group-hover:border-[#292c27] group-hover:text-[#292c27]"
                    }`}
                    aria-hidden="true"
                  >
                    <span className="font-mono text-sm leading-none font-light">
                      {isActive ? "—" : "+"}
                    </span>
                  </div>
                </button>

                {/* Mobile Inline Active Service Story: Description -> Image -> CTA */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      id={`mobile-service-panel-${service.id}`}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, height: 0, y: -6 }
                      }
                      animate={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 1, height: "auto", y: 0 }
                      }
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, height: 0, y: -6 }
                      }
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pt-1 flex flex-col gap-4">
                        
                        {/* 1. Short Description */}
                        <p className="text-[15px] sm:text-[16px] text-[#55574e] leading-relaxed font-sans">
                          {service.shortDesc}
                        </p>

                        {/* 2. Inline Service Image (4:5 Aspect Ratio) */}
                        <div className="relative w-full aspect-[4/5] bg-[#e8e6de] border border-[#cecec3] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                          <Image
                            src={service.image.src}
                            alt={service.image.alt}
                            fill
                            sizes="(max-width: 768px) 95vw, 500px"
                            className="object-cover saturate-[0.92] contrast-[1.04]"
                            style={{ objectPosition: service.image.position }}
                            priority={service.id === "01"}
                          />
                          
                          {/* Dark Bottom Vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                          {/* Corner Label Badge */}
                          <div className="absolute bottom-3 left-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2.5 py-1 border border-white/15">
                            {service.image.label}
                          </div>

                          {/* Top Right Descriptor */}
                          <div className="absolute top-3 right-3 z-10 font-mono text-[8px] uppercase tracking-[0.18em] text-[#f2f0e9]/90 bg-black/60 backdrop-blur-sm px-2 py-0.5">
                            {service.descriptor}
                          </div>
                        </div>

                        {/* 3. Full-Width Booking Action */}
                        <div className="pt-1">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#292c27] text-[#f2f0e9] hover:bg-[#3f4438] text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_15px_rgba(41,44,39,0.12)] min-h-[48px] w-full text-center"
                            style={{ color: "#f2f0e9", backgroundColor: "#292c27" }}
                          >
                            <CalendarDays className="w-4 h-4 text-[#f2f0e9]/80" />
                            <span>BOOK THIS SERVICE</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Quiet inquiry note */}
          <p className="mt-6 text-xs text-[#66685e] font-sans tracking-wide">
            For customised requests, availability &amp; consultations, reach out directly via WhatsApp.
          </p>
        </div>

      </div>
    </section>
  );
}
