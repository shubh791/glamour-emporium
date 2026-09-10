"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ArrowRight, Sparkles, X } from "lucide-react";

export default function BookingPromoStrip() {
  const [showPromo, setShowPromo] = useState(true);
  const { openBooking } = useBooking();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {showPromo && (
        <motion.aside
          key="booking-promo-strip"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Online Booking Promotion"
          className="relative z-50 w-full bg-[#12110f] border-b border-[#c9a87c]/25 border-t border-white/[0.04] text-[#f5f2eb] shadow-[inset_0_1px_0_rgba(201,168,124,0.1)] overflow-hidden"
        >
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 min-h-[56px] sm:min-h-[58px] lg:min-h-[56px] flex items-center">
            
            {/* ============================================================ */}
            {/* DESKTOP VIEW (md & lg screens): Single Row Balanced Spread   */}
            {/* ============================================================ */}
            <div className="hidden md:flex items-center justify-between w-full gap-4">
              
              {/* Centered Offer Narrative & CTA */}
              <div className="flex items-center justify-center gap-5 lg:gap-8 flex-1 min-w-0">
                <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                  {/* 28–32px Circular Icon Container */}
                  <span
                    className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#1e1c18] border border-[#c9a87c]/40 text-[#c9a87c] shrink-0 shadow-sm"
                    aria-hidden="true"
                  >
                    <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#c9a87c]" />
                  </span>

                  {/* Tag / Category Badge */}
                  <span className="font-mono text-xs lg:text-[12.5px] uppercase tracking-[0.22em] text-[#c9a87c] font-bold shrink-0">
                    BOOK ONLINE &amp; SAVE
                  </span>

                  {/* Separator Dot */}
                  <span className="text-[#c9a87c]/50 text-sm select-none font-sans" aria-hidden="true">
                    •
                  </span>

                  {/* Offer Narrative with Bold Highlight */}
                  <p className="text-[14px] lg:text-[15.5px] text-[#eae6df] font-sans leading-none tracking-normal font-normal">
                    Get <strong className="text-[#f5f2eb] font-bold underline decoration-[#c9a87c]/40 underline-offset-2">up to 20% off</strong> when you book your appointment through our website.
                  </p>
                </div>

                {/* Action Trigger */}
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="group inline-flex items-center gap-1.5 text-xs lg:text-[13px] font-mono uppercase tracking-[0.18em] font-semibold text-[#c9a87c] hover:text-[#f5f2eb] border-b border-[#c9a87c]/60 hover:border-[#f5f2eb] pb-0.5 transition-all duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c] min-h-[38px] px-1"
                  aria-label="Book a slot online to receive up to 20% discount"
                >
                  <span className="whitespace-nowrap">BOOK A SLOT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c9a87c] group-hover:text-[#f5f2eb] transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>

              {/* Desktop Far-Right Close Button */}
              <button
                type="button"
                onClick={() => setShowPromo(false)}
                aria-label="Close booking offer"
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#eae6df]/70 hover:text-[#f5f2eb] hover:bg-white/[0.08] transition-colors rounded-[2px] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c]"
              >
                <X className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>

            </div>

            {/* ============================================================ */}
            {/* MOBILE VIEW (< md screens): Clean 2-Level Balanced Spread    */}
            {/* ============================================================ */}
            <div className="flex md:hidden items-center justify-between gap-2.5 w-full">
              
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* 28px Mobile Icon Container */}
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1e1c18] border border-[#c9a87c]/40 text-[#c9a87c] shrink-0"
                  aria-hidden="true"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c9a87c]" />
                </span>

                {/* 2-Level Text Stack */}
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#c9a87c] font-semibold">
                    BOOK ONLINE &amp; SAVE
                  </span>
                  <p className="text-[11.5px] sm:text-[12.5px] text-[#eae6df] font-sans leading-tight truncate">
                    Get <strong className="text-[#f5f2eb] font-bold">up to 20% off</strong> on website bookings
                  </p>
                </div>
              </div>

              {/* Mobile CTA Trigger & Close Button */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="group inline-flex items-center gap-0.5 text-[11px] sm:text-xs font-mono uppercase tracking-[0.12em] font-semibold text-[#c9a87c] hover:text-[#f5f2eb] border-b border-[#c9a87c]/60 hover:border-[#f5f2eb] pb-0.5 transition-colors shrink-0 cursor-pointer min-h-[40px] px-1 focus-visible:outline-none"
                  aria-label="Book a slot online"
                >
                  <span className="whitespace-nowrap">BOOK A SLOT</span>
                  <ArrowRight className="w-3 h-3 text-[#c9a87c] group-hover:text-[#f5f2eb] transform group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowPromo(false)}
                  aria-label="Close booking offer"
                  className="w-8 h-8 flex items-center justify-center text-[#eae6df]/70 hover:text-[#f5f2eb] hover:bg-white/[0.08] transition-colors rounded-[2px] shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}


