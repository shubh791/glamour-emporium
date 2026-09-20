"use client";

import { useBooking } from "@/context/BookingContext";
import { Sparkles } from "lucide-react";
import { BOOKING_ADVANCE } from "@/data/bookingConfig";

/**
 * Mobile Drawer Compact Luxury Promo Card
 * Positioned inside the hamburger navigation drawer below navigation links and above the drawer footer.
 * Only appears once the user intentionally opens the hamburger menu on mobile devices (max-width: 767px).
 * 
 * Content:
 * - Header: ✦ ONLINE BOOKING OFFER
 * - Headline: UP TO 20% OFF ON SELECTED SERVICES
 * - Subtitle: ₹99 advance adjusted in final bill
 */
export function BookingPromoMobileDrawer({ onSelectOffer }) {
  const { openBooking } = useBooking();

  const handleTrigger = () => {
    if (onSelectOffer) {
      onSelectOffer();
    } else {
      openBooking();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleTrigger}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTrigger();
        }
      }}
      className="relative my-2 w-full cursor-pointer overflow-hidden border border-[#c9a87c]/40 bg-gradient-to-br from-[#1a1713] via-[#12100e] to-[#0c0b0a] p-3 xs:p-3.5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all hover:border-[#c9a87c]/80 active:scale-[0.99] group select-none"
    >
      {/* Subtle Glow Texture */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#c9a87c]/8 rounded-full blur-xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center gap-1.5 mb-1 text-[#c9a87c]">
        <Sparkles className="w-3 h-3 text-[#c9a87c] shrink-0" />
        <span className="font-mono text-[9.5px] xs:text-[10px] uppercase tracking-[0.2em] font-semibold">
          ONLINE BOOKING OFFER
        </span>
      </div>

      {/* Primary Headline */}
      <div className="font-serif text-[13px] xs:text-[14px] uppercase font-normal text-[#f5f2eb] tracking-wide group-hover:text-[#c9a87c] transition-colors leading-snug">
        UP TO 20% OFF ON SELECTED SERVICES
      </div>

      {/* Pricing / Adjustment Subtitle */}
      <div className="mt-1.5 flex items-center justify-between">
        <span className="font-mono text-[10.5px] xs:text-[11px] text-[#c9a87c] tracking-[0.08em] font-medium">
          ₹{BOOKING_ADVANCE} advance adjusted in final bill
        </span>
        <span className="font-mono text-[9.5px] xs:text-[10px] uppercase font-bold tracking-[0.14em] text-[#0c0b0a] bg-[#c9a87c] group-hover:bg-[#dfc49c] px-2 py-0.5 transition-colors">
          BOOK ↗
        </span>
      </div>
    </div>
  );
}

// Backwards compatibility
export const BookingPromoMobile = BookingPromoMobileDrawer;
export const BookingPromoDesktop = () => null;

export default function BookingPromoStrip() {
  return null;
}




