"use client";

import { useBooking } from "@/context/BookingContext";

/**
 * Permanent Non-Blocking Promotional Announcement Strip
 * Sits statically in the document flow directly below the fixed navbar and above the hero.
 * 
 * Content:
 * - Left / Primary: ✦ UP TO 20% OFF ON SELECTED SERVICES WITH ONLINE BOOKING
 * - Right / Secondary: ₹99 Advance • Adjusted in final bill
 */
export default function PromoAnnouncementStrip() {
  const { openBooking } = useBooking();

  return (
    <div
      role="region"
      aria-label="Promotional announcement"
      onClick={() => openBooking()}
      className="relative z-20 w-full bg-[#110f0d] border-t border-b border-[#c9a87c]/30 text-[#f5f2eb] mt-[56px] sm:mt-[68px] lg:mt-[76px] py-2 sm:py-2.5 px-3 sm:px-6 lg:px-8 cursor-pointer hover:bg-[#171411] transition-colors select-none"
    >
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-center sm:text-left">
        {/* Primary Offer Message */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 min-w-0">
          <span className="text-[#c9a87c] text-xs leading-none shrink-0" aria-hidden="true">
            ✦
          </span>
          <span className="font-mono text-[11px] xs:text-[12px] sm:text-[12.5px] lg:text-[13px] tracking-[0.06em] xs:tracking-[0.1em] sm:tracking-[0.16em] uppercase text-[#f5f2eb] font-medium leading-tight">
            UP TO 20% OFF ON SELECTED SERVICES WITH ONLINE BOOKING
          </span>
        </div>

        {/* Secondary Pricing Notice */}
        <div className="shrink-0 flex items-center justify-center gap-1.5">
          <span className="font-mono text-[10.5px] xs:text-[11.5px] sm:text-[12px] tracking-[0.08em] sm:tracking-[0.14em] uppercase text-[#c9a87c] font-semibold leading-tight">
            ₹99 Advance • Adjusted in final bill
          </span>
        </div>
      </div>
    </div>
  );
}
