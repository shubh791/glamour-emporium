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
 * Mobile Drawer Compact Luxury Promo Card
 * Positioned cleanly below navigation links inside the mobile hamburger menu drawer.
 */
export function BookingPromoMobileDrawer({ showPromo, onDismiss, onSelectOffer }) {
  const prefersReducedMotion = useReducedMotion();

  if (!showPromo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative my-2 w-full overflow-hidden border border-[#c9a87c]/35 bg-gradient-to-br from-[#1c1813] via-[#141210] to-[#0c0b0a] p-3.5 sm:p-4 text-left shadow-[0_6px_20px_rgba(0,0,0,0.5)] transition-colors hover:border-[#c9a87c]/70 group"
      >
        {/* Clickable Card Body */}
        <div
          role="button"
          tabIndex={0}
          onClick={onSelectOffer}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectOffer();
            }
          }}
          className="cursor-pointer focus-visible:outline-none pr-6"
        >
          {/* Header Tag */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-[#c9a87c] shrink-0" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#c9a87c] font-semibold">
              EXCLUSIVE ONLINE OFFER
            </span>
          </div>

          {/* Heading */}
          <div className="font-serif text-[15px] sm:text-[16px] font-normal text-[#f5f2eb] tracking-wide group-hover:text-[#c9a87c] transition-colors">
            UP TO 20% OFF
          </div>

          {/* Micro-copy */}
          <p className="font-sans text-[11px] text-[#eae6df]/75 mt-0.5 leading-snug">
            Special discount applied automatically on confirmed website appointments.
          </p>

          {/* Bottom Action Trigger */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#0c0b0a] bg-[#c9a87c] group-hover:bg-[#dfc49c] px-2.5 py-1 transition-colors">
              <span>CLAIM OFFER</span>
              <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Dismiss promotional offer card"
          className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer focus-visible:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// Backwards compatibility
export const BookingPromoMobile = BookingPromoMobileDrawer;

export default function BookingPromoStrip() {
  return null;
}



