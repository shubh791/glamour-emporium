"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Sparkles, X } from "lucide-react";

/**
 * Desktop Compact Luxury Booking Offer Badge
 * Placed neatly alongside the primary "BOOK A SLOT" button in Navbar.
 */
export function BookingPromoDesktop({ showPromo, onDismiss }) {
  const { openBooking } = useBooking();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {showPromo && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92, x: 6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={prefersReducedMotion ? false : { opacity: 0, scale: 0.92, x: 6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 bg-[#141210]/95 border border-[#c9a87c]/40 hover:border-[#c9a87c] pl-3 pr-1.5 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors"
        >
          {/* Clickable Offer Trigger */}
          <button
            type="button"
            onClick={() => openBooking()}
            className="flex items-center gap-1.5 text-left cursor-pointer focus-visible:outline-none group"
            aria-label="Book online to receive up to 20% discount"
          >
            <Sparkles className="w-3 h-3 text-[#c9a87c] shrink-0 group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[#c9a87c] font-semibold whitespace-nowrap">
              UP TO 20% OFF ONLINE
            </span>
          </button>

          {/* Subtle Vertical Divider */}
          <div className="w-[1px] h-3 bg-white/15 mx-0.5" aria-hidden="true" />

          {/* Dismiss X Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            aria-label="Dismiss online booking offer badge"
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer focus-visible:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Mobile Compact Floating Ribbon (Positioned directly under mobile header bar)
 */
export function BookingPromoMobile({ showPromo, onDismiss }) {
  const { openBooking } = useBooking();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {showPromo && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden w-full overflow-hidden bg-[#141210]/98 border-b border-[#c9a87c]/30 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => openBooking()}
              className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer focus-visible:outline-none group"
              aria-label="Book online to receive up to 20% discount"
            >
              <Sparkles className="w-3 h-3 text-[#c9a87c] shrink-0" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#c9a87c] font-medium truncate">
                ✦ UP TO 20% OFF ONLINE BOOKINGS
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              aria-label="Dismiss online booking offer"
              className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer shrink-0 min-h-[32px] focus-visible:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BookingPromoStrip() {
  return null;
}


