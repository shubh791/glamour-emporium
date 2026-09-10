"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/siteData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useBooking } from "@/context/BookingContext";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const servicesData = [
  {
    id: "01",
    number: "01",
    title: "HAIR & STYLING",
    descriptor: "WOMEN & MEN",
    shortDesc:
      "From everyday haircuts and styling to colour and hair care, choose a service that suits your look, occasion and preferences.",
    ctaLabel: "ENQUIRE ABOUT HAIR & STYLING",
    services: [
      { name: "Haircut", subtitle: "Personalized to face shape & natural texture" },
      { name: "Hair Styling & Blow Dry", subtitle: "Volume, movement and finish" },
      { name: "Hair Colour & Balayage", subtitle: "Dimensional tone & highlights" },
      { name: "Restorative Hair Care / Spa", subtitle: "Deep nourishment & strand repair" },
      { name: "Scalp Health Therapy", subtitle: "Cleansing & revitalization" },
    ],
    image: {
      src: "/images/services/hair-and-styling.webp",
      alt: "Women's hair styling and haircut at Glamour Emporium salon in Panipat",
      position: "50% 30%",
      label: "01 / HAIR & STYLING",
    },
    whatsappMessage:
      "Hello Glamour Emporium,\n\nI would like to enquire about Hair & Styling.\n\nPlease share the available options and appointment availability.\n\nThank you.",
  },
  {
    id: "02",
    number: "02",
    title: "MEN'S GROOMING",
    descriptor: "TAILORED GROOMING",
    shortDesc:
      "Haircuts, beard grooming and styling services designed for a clean, well-finished look.",
    ctaLabel: "ENQUIRE ABOUT MEN'S GROOMING",
    services: [
      { name: "Tailored Scissor Cut", subtitle: "Precision cutting & silhouette shaping" },
      { name: "Fade & Taper Cut", subtitle: "Clean low fade & textured crown" },
      { name: "Beard Grooming & Detailing", subtitle: "Sharp perimeter lines & beard care" },
      { name: "Head Massage & Scalp Care", subtitle: "Relaxing cleanse & scalp health" },
      { name: "Occasion Styling", subtitle: "Refined finish for events and everyday" },
    ],
    image: {
      src: "/images/services/mens-grooming.webp",
      alt: "Men's haircut and beard grooming at Glamour Emporium in Panipat",
      position: "50% 30%",
      label: "02 / MEN'S GROOMING",
    },
    whatsappMessage:
      "Hello Glamour Emporium,\n\nI would like to enquire about Men's Grooming.\n\nPlease share the available options and appointment availability.\n\nThank you.",
  },
  {
    id: "03",
    number: "03",
    title: "BEAUTY & CARE",
    descriptor: "SKIN & RITUALS",
    shortDesc:
      "Beauty and personal care services for everyday grooming, occasions and special moments.",
    ctaLabel: "ENQUIRE ABOUT BEAUTY & CARE",
    services: [
      { name: "Facial & Skin Care", subtitle: "Hydrating, glow-enhancing skin care" },
      { name: "Hair Spa & Scalp Revival", subtitle: "Deep conditioning & follicle therapy" },
      { name: "Grooming & Clean Up", subtitle: "Gentle cleanse, exfoliation & renewal" },
      { name: "Detailing & Care Rituals", subtitle: "Refined grooming & finishing touches" },
      { name: "Style Consultation", subtitle: "One-on-one styling & care dialogue" },
    ],
    image: {
      src: "/images/services/beauty-and-care.webp",
      alt: "Beauty and skin care rituals at Glamour Emporium in Panipat",
      position: "50% 35%",
      label: "03 / BEAUTY & CARE",
    },
    whatsappMessage:
      "Hello Glamour Emporium,\n\nI would like to enquire about Beauty & Care.\n\nPlease share the available options and appointment availability.\n\nThank you.",
  },
];

const customEnquiryMessage =
  "Hello Glamour Emporium,\n\nI have a custom service enquiry.\n\nI'm looking for: [describe your requirement]\n\nPlease help me with the available options.\n\nThank you.";

const customEnquiryUrl = `https://wa.me/917495068282?text=${encodeURIComponent(customEnquiryMessage)}`;

export default function Services() {
  const { openBooking } = useBooking();
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

  const getServiceItemUrl = (serviceName) => {
    const msg = `Hello Glamour Emporium,\n\nI would like to enquire about ${serviceName}.\n\nPlease share the available options and appointment availability.\n\nThank you.`;
    return `https://wa.me/917495068282?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full bg-[#f2f0e9] text-[#292c27] py-12 sm:py-16 lg:py-20 overflow-hidden border-t border-[#cecec3]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* TOP INTRODUCTION: Disciplined, compact editorial header      */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-[#cecec3]">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#66685e]">
              WHAT WE DO
            </span>
            <h2
              id="services-heading"
              className="font-serif text-[clamp(2.15rem,5.5vw,3.75rem)] leading-[0.96] tracking-tight font-light text-[#292c27] mt-2"
            >
              CRAFTED<br />
              <span className="italic font-normal">AROUND YOU.</span>
            </h2>
          </div>
          
          <p className="max-w-xs sm:max-w-sm text-sm sm:text-[15px] text-[#66685e] font-sans leading-relaxed pb-0.5">
            Explore hair, beauty and grooming services for men and women at our unisex salon on Jattal Road, Panipat.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP VIEW: Unified 2-Column Balanced Spread (Top Aligned) */}
        {/* ============================================================ */}
        <div className="hidden lg:grid grid-cols-12 gap-8 xl:gap-12 items-start mt-8 sm:mt-10 lg:mt-12">
          
          {/* LEFT: Service Selector List (7 Columns / ~58% Width) */}
          <div className="col-span-7 flex flex-col">
            <div className="flex flex-col border-t border-[#cecec3]">
              {servicesData.map((service) => {
                const isActive = service.id === activeServiceId;
                const whatsappUrl = buildWhatsAppUrl(service.whatsappMessage);

                return (
                  <div
                    key={service.id}
                    className="border-b border-[#cecec3] transition-colors"
                  >
                    {/* Header Row: Compact Height */}
                    <button
                      type="button"
                      onClick={() => handleServiceToggle(service.id)}
                      className={`w-full flex items-center justify-between text-left group cursor-pointer focus-visible:outline-none transition-all duration-200 ${
                        isActive ? "py-4 sm:py-5" : "py-3.5 sm:py-4 hover:bg-black/[0.015]"
                      }`}
                      aria-expanded={isActive}
                      aria-controls={`desktop-service-panel-${service.id}`}
                    >
                      <div className="flex items-baseline gap-4 sm:gap-5">
                        <span
                          className={`font-mono text-xs sm:text-sm tracking-widest transition-colors ${
                            isActive
                              ? "text-[#292c27] font-bold"
                              : "text-[#66685e] group-hover:text-[#292c27]"
                          }`}
                        >
                          {service.number}
                        </span>

                        <h3
                          className={`font-serif text-2xl lg:text-[1.85rem] tracking-tight leading-tight transition-all duration-200 ${
                            isActive
                              ? "text-[#292c27] font-normal translate-x-0.5"
                              : "text-[#66685e]/85 group-hover:text-[#292c27]"
                          }`}
                        >
                          {service.title}
                        </h3>
                      </div>

                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border transition-all duration-200 shrink-0 ${
                          isActive
                            ? "border-[#292c27] bg-[#292c27] text-[#f2f0e9]"
                            : "border-[#cecec3] text-[#66685e] group-hover:border-[#292c27] group-hover:text-[#292c27]"
                        }`}
                        aria-hidden="true"
                      >
                        <span className="font-mono text-xs leading-none font-light">
                          {isActive ? "—" : "+"}
                        </span>
                      </div>
                    </button>

                    {/* Active Service Expanded Details & Real Sub-Services */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`desktop-service-panel-${service.id}`}
                          initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={prefersReducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-5 pt-0.5 pl-8 sm:pl-9 pr-2 flex flex-col gap-3.5">
                            <p className="text-[14px] text-[#55574e] leading-relaxed max-w-lg font-sans">
                              {service.shortDesc}
                            </p>

                            {/* Detailed Sub-Services Catalogue (Compact 2-Column Grid) */}
                            <div className="border-t border-b border-[#cecec3]/70 py-2.5 my-0.5">
                              <span className="text-[8px] font-mono uppercase tracking-[0.22em] text-[#66685e] block mb-2 font-semibold">
                                SERVICES IN THIS CATEGORY
                              </span>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                                {service.services.map((item) => (
                                  <a
                                    key={item.name}
                                    href={getServiceItemUrl(item.name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/item flex items-center justify-between py-0.5 text-xs text-[#292c27] hover:text-[#0c0b0a] transition-colors"
                                    title={`Enquire about ${item.name}`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                      <span className="w-1 h-1 rounded-full bg-[#c9a87c] shrink-0 group-hover/item:scale-125 transition-transform" />
                                      <span className="font-medium truncate group-hover/item:underline underline-offset-4 decoration-[#c9a87c]">
                                        {item.name}
                                      </span>
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 text-[#66685e] opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>

                            {/* Category Action Button & Helper */}
                            <div className="pt-1 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => openBooking(service.title)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#292c27] text-[#f2f0e9] hover:bg-[#3f4339] text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200 shadow-sm group/btn min-h-[40px] cursor-pointer"
                                style={{ color: "#f2f0e9", backgroundColor: "#292c27" }}
                              >
                                <CalendarDays className="w-3.5 h-3.5 text-[#f2f0e9]/80" />
                                <span>BOOK A SLOT</span>
                                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </button>
                              <span className="text-[11px] font-mono text-[#66685e] tracking-tight">
                                Reserve with ₹99 adjustable advance
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Aligned Image Composition (5 Columns / ~42% Width) */}
          <div className="col-span-5 flex flex-col items-center lg:items-end">
            
            {/* Visual Stage Container Frame (~4:4.8 aspect ratio, naturally matched to active content) */}
            <div className="relative w-full max-w-[420px] aspect-[4/4.8] bg-[#e8e6de] border border-[#cecec3] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayedService.id}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0 }
                  }
                  animate={{ opacity: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transition: { duration: 0.2 } }
                  }
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={displayedService.image.src}
                    alt={displayedService.image.alt}
                    fill
                    sizes="35vw"
                    className="object-cover saturate-[0.92] contrast-[1.04]"
                    style={{ objectPosition: displayedService.image.position }}
                    priority={displayedService.id === "01"}
                  />
                  
                  {/* Subtle edge vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Brand Signature Emblem Top Left */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 bg-[#0c0b0a]/85 backdrop-blur-sm px-2 py-0.5 border border-white/15">
                    <div className="relative w-3 h-3 rounded-full overflow-hidden shrink-0">
                      <Image
                        src="/images/logo/logo-mark.webp"
                        alt="GE Emblem"
                        fill
                        sizes="12px"
                        className="object-cover"
                      />
                    </div>
                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#f2f0e9] font-medium">
                      GLAMOUR EMPORIUM
                    </span>
                  </div>

                  {/* Top Right Descriptor */}
                  <div className="absolute top-2.5 right-2.5 z-20 font-mono text-[7.5px] uppercase tracking-[0.18em] text-[#f2f0e9]/90 bg-black/60 backdrop-blur-sm px-2 py-0.5">
                    {displayedService.descriptor}
                  </div>

                  {/* Corner Label Badge */}
                  <div className="absolute bottom-3 left-3 z-20 font-mono text-[8.5px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 backdrop-blur-sm px-2.5 py-1 border border-white/15">
                    {displayedService.image.label}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtle Below-Image Editorial Signature */}
            <div className="w-full max-w-[420px] flex items-center justify-between mt-2 font-mono text-[8.5px] tracking-[0.22em] uppercase text-[#66685e]">
              <span>PANIPAT, HARYANA</span>
              <span>UNISEX SALON</span>
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* MOBILE VIEW: Clean Linear Stack                              */}
        {/* ============================================================ */}
        <div className="lg:hidden flex flex-col mt-6 sm:mt-8 border-t border-[#cecec3]">
          {servicesData.map((service) => {
            const isActive = service.id === activeServiceId;
            const whatsappUrl = buildWhatsAppUrl(service.whatsappMessage);

            return (
              <div
                key={service.id}
                className="border-b border-[#cecec3] transition-colors"
              >
                {/* Mobile Header Row */}
                <button
                  type="button"
                  onClick={() => handleServiceToggle(service.id)}
                  className="w-full py-3.5 sm:py-4 flex items-center justify-between text-left group cursor-pointer focus-visible:outline-none min-h-[48px]"
                  aria-expanded={isActive}
                  aria-controls={`mobile-service-panel-${service.id}`}
                >
                  <div className="flex items-baseline gap-3 min-w-0 flex-1 pr-2">
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
                      className={`font-serif text-[clamp(1.3rem,5.5vw,1.75rem)] tracking-tight transition-all duration-200 truncate leading-tight ${
                        isActive
                          ? "text-[#292c27] font-normal"
                          : "text-[#66685e]/90 group-hover:text-[#292c27]"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 flex items-center justify-center border transition-all duration-200 shrink-0 ${
                      isActive
                        ? "border-[#292c27] bg-[#292c27] text-[#f2f0e9]"
                        : "border-[#cecec3] text-[#66685e] group-hover:border-[#292c27] group-hover:text-[#292c27]"
                    }`}
                    aria-hidden="true"
                  >
                    <span className="font-mono text-xs leading-none font-light">
                      {isActive ? "—" : "+"}
                    </span>
                  </div>
                </button>

                {/* Mobile Inline Active Story */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      id={`mobile-service-panel-${service.id}`}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pt-0.5 flex flex-col gap-3.5">
                        
                        {/* 1. Short Description */}
                        <p className="text-[13.5px] sm:text-[14px] text-[#55574e] leading-relaxed font-sans">
                          {service.shortDesc}
                        </p>

                        {/* 2. Sub-Services Tap List */}
                        <div className="border-t border-b border-[#cecec3]/70 py-2.5 flex flex-col gap-1.5">
                          <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-[#66685e] font-semibold">
                            SERVICES INCLUDED:
                          </span>
                          <div className="flex flex-col gap-1">
                            {service.services.map((item) => (
                              <a
                                key={item.name}
                                href={getServiceItemUrl(item.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between py-1 text-xs text-[#292c27] active:text-[#0c0b0a] transition-colors border-b border-[#cecec3]/25 last:border-0"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-[#c9a87c]" />
                                  <span className="font-medium">{item.name}</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#66685e] flex items-center gap-0.5">
                                  Enquire <ArrowUpRight className="w-2.5 h-2.5" />
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* 3. Inline Service Image (~4:4.8 Aspect Ratio) */}
                        <div className="relative w-full aspect-[4/4.6] bg-[#e8e6de] border border-[#cecec3] overflow-hidden shadow-sm my-0.5">
                          <Image
                            src={service.image.src}
                            alt={service.image.alt}
                            fill
                            sizes="(max-width: 768px) 95vw, 450px"
                            className="object-cover saturate-[0.92] contrast-[1.04]"
                            style={{ objectPosition: service.image.position }}
                            priority={service.id === "01"}
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                          <div className="absolute bottom-2.5 left-2.5 z-10 font-mono text-[7.5px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2 py-0.5 border border-white/15">
                            {service.image.label}
                          </div>

                          <div className="absolute top-2.5 right-2.5 z-10 font-mono text-[7.5px] uppercase tracking-[0.18em] text-[#f2f0e9]/90 bg-black/60 backdrop-blur-sm px-2 py-0.5">
                            {service.descriptor}
                          </div>
                        </div>

                        {/* 4. Full-Width Category Action */}
                        <div className="pt-0.5">
                          <button
                            type="button"
                            onClick={() => openBooking(service.title)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#292c27] text-[#f2f0e9] hover:bg-[#3f4339] text-xs font-semibold uppercase tracking-[0.16em] transition-all min-h-[44px] w-full text-center cursor-pointer"
                            style={{ color: "#f2f0e9", backgroundColor: "#292c27" }}
                          >
                            <CalendarDays className="w-3.5 h-3.5 text-[#f2f0e9]/80" />
                            <span>BOOK A SLOT</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* CUSTOM ENQUIRY ROW: Compact Integrated Editorial Footer Bar  */}
        {/* ============================================================ */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#cecec3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#eae7de]/50 px-4 sm:px-6 py-4 border border-[#cecec3]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#66685e] font-semibold">
              CAN&apos;T FIND WHAT YOU&apos;RE LOOKING FOR?
            </span>
            <p className="text-xs sm:text-sm text-[#292c27] font-sans leading-relaxed max-w-lg">
              Need something specific? Tell us what you have in mind and our team will assist you.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={customEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#292c27] text-[#f2f0e9] hover:bg-[#3f4339] text-xs font-semibold uppercase tracking-[0.16em] transition-all min-h-[40px] shadow-sm w-full sm:w-auto text-center"
              style={{ color: "#f2f0e9", backgroundColor: "#292c27" }}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <span>ASK ON WHATSAPP</span>
              <ArrowUpRight className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
