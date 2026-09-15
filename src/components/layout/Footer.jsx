"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight, Phone, MapPin, CalendarDays } from "lucide-react";
import { siteData } from "@/data/siteData";
import { useBooking } from "@/context/BookingContext";
import BrandMark from "@/components/ui/BrandMark";
import InstagramIcon from "@/components/ui/InstagramIcon";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Footer() {
  const { business, navigation, legalLinks } = siteData;
  const { openBooking } = useBooking();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#0c0b0a] text-[#f5f2eb] pt-20 pb-12 border-t border-white/10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50vw] h-[30vw] rounded-full bg-[#c9a87c]/5 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
        
        {/* ============================================================ */}
        {/* FOOTER TOP: Dramatic BrandMark + Quick WhatsApp CTA          */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10 border-b border-white/10 pb-10 sm:pb-14">
          <div>
            <BrandMark
              size="lg"
              layout="horizontal"
              showMonogram={true}
              showDescriptor={true}
              textClassName="text-xl sm:text-3xl lg:text-4xl"
              descriptorClassName="text-[8px] sm:text-[11px]"
            />
            <p className="mt-3 sm:mt-4 max-w-md text-xs sm:text-sm text-[#eae6df]/70 font-sans leading-relaxed">
              A unisex hair, beauty and grooming salon on Jattal Road, Panipat.
            </p>
          </div>

          <div className="flex flex-col items-stretch sm:items-start lg:items-end gap-3">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#c9a87c]">
              READY FOR YOUR NEXT LOOK?
            </span>
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#f5f2eb] text-[#0c0b0a] hover:bg-[#c9a87c] text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 min-h-[44px] group w-full sm:w-auto text-center cursor-pointer"
              style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#0c0b0a]/80" />
              <span>BOOK A SLOT</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER MIDDLE: Clean Unboxed Information Columns             */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 border-b border-white/10 pb-12">
          
          {/* VISIT */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#c9a87c] font-mono text-[10px] tracking-[0.25em] uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#c9a87c]" />
              <span>VISIT</span>
            </div>
            <p className="font-serif text-lg sm:text-xl font-light text-[#f5f2eb] leading-snug">
              {business.address.street}
            </p>
            <p className="text-xs text-[#eae6df]/70 font-sans">
              {business.address.city}, {business.address.state} — {business.address.postalCode}
            </p>
            {business.servingAreas && (
              <p className="text-[11px] text-[#eae6df]/55 font-sans leading-relaxed">
                {business.servingAreas}
              </p>
            )}
            <div className="pt-1">
              <a
                href={business.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#c9a87c] hover:text-[#f5f2eb] border-b border-[#c9a87c]/40 hover:border-[#f5f2eb] pb-0.5 transition-colors"
              >
                <span>GET DIRECTIONS</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* CALL */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#c9a87c] font-mono text-[10px] tracking-[0.25em] uppercase">
              <Phone className="w-3.5 h-3.5 text-[#c9a87c]" />
              <span>CALL &amp; WHATSAPP</span>
            </div>
            <a
              href={`tel:${business.contact.phoneTel}`}
              className="font-serif text-xl sm:text-2xl text-[#f5f2eb] hover:text-[#c9a87c] transition-colors tracking-tight flex items-center gap-2"
            >
              <span>{business.contact.phoneDisplay}</span>
            </a>
            <p className="text-xs text-[#eae6df]/70 font-sans">
              Direct salon phone and WhatsApp booking line
            </p>
          </div>

          {/* SOCIAL & QUICK NAV */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#c9a87c] font-mono text-[10px] tracking-[0.25em] uppercase">
              <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" color="#E1306C" />
              <span>INSTAGRAM</span>
            </div>
            <a
              href={business.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-serif text-lg sm:text-xl text-[#f5f2eb] hover:text-[#c9a87c] transition-colors group"
            >
              <span>@{business.social.instagram.handle}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            
            {/* Quick Navigation Links */}
            <nav className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 font-mono text-[10px] tracking-widest uppercase text-white/50">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-[#c9a87c] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

        </div>

        {/* ============================================================ */}
        {/* LEGAL POLICIES STRIP: Cashfree Compliant Onboarding Links    */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono tracking-[0.14em] uppercase text-white/60">
            {(legalLinks || [
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
              { label: "Cancellation & Refund Policy", href: "/cancellation-refund-policy" },
            ]).map((link, idx, arr) => (
              <span key={link.href} className="inline-flex items-center gap-6">
                <Link
                  href={link.href}
                  className="hover:text-[#c9a87c] transition-colors"
                >
                  {link.label}
                </Link>
                {idx < arr.length - 1 && (
                  <span className="text-white/20 hidden sm:inline" aria-hidden="true">•</span>
                )}
              </span>
            ))}
          </div>
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#c9a87c]/75">
            VERIFIED SALON POLICIES
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER BOTTOM BAR: Restrained Strip                          */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-[0.16em] uppercase text-white/40 pt-4 border-t border-white/5">
          <div>
            © {currentYear} {business.name}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#c9a87c]">PANIPAT, HARYANA</span>
            <span className="text-white/20">•</span>
            <a
              href="/#hero"
              className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
