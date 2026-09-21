"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Menu, X, CalendarDays } from "lucide-react";
import { siteData } from "@/data/siteData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useBooking } from "@/context/BookingContext";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { BookingPromoMobileDrawer } from "@/components/ui/BookingPromoStrip";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { openBooking } = useBooking();

  const navLinks = [
    { label: "Services", href: "/#services", number: "01" },
    { label: "Experience", href: "/#experience", number: "02" },
    { label: "Gallery", href: "/#showcase", number: "03" },
    { label: "Contact", href: "/#contact", number: "04" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dismiss mobile menu on Escape or window resize
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-[#090909]/95 backdrop-blur-md border-b border-[#c9a87c]/30 shadow-[0_4px_30px_rgba(0,0,0,0.85)] py-2.5 sm:py-3"
            : "bg-[#090909]/80 backdrop-blur-sm border-b border-[#c9a87c]/15 py-3 sm:py-4 md:py-5"
        }`}
        style={{ backgroundColor: "#090909" }}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* ============================================================ */}
            {/* BRAND LOGO & IDENTITY (Left Column)                          */}
            {/* ============================================================ */}
            <Link
              href="/"
              aria-label="Glamour Emporium — Unisex Salon • Panipat"
              className="flex items-center gap-2.5 sm:gap-3 group shrink min-w-0"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full overflow-hidden border border-[#c9a87c]/60 group-hover:border-[#c9a87c] transition-colors shrink-0 shadow-sm">
                <Image
                  src="/images/logo/logo-mark.webp"
                  alt="Glamour Emporium Logo Emblem"
                  fill
                  priority
                  sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 44px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <span className="font-serif text-[12.5px] xs:text-[14px] sm:text-[17px] md:text-[19px] font-normal tracking-[0.14em] sm:tracking-[0.18em] text-[#f5f2eb] uppercase leading-tight group-hover:text-[#c9a87c] transition-colors truncate">
                  GLAMOUR EMPORIUM
                </span>
                <span className="font-sans font-medium text-[6.5px] xs:text-[7.5px] sm:text-[8px] md:text-[8.5px] tracking-[0.22em] sm:tracking-[0.32em] uppercase text-[#c9a87c] mt-0.5 leading-none truncate">
                  UNISEX SALON • PANIPAT
                </span>
              </div>
            </Link>
            {/* ============================================================ */}
            {/* DESKTOP NAVIGATION (Center Column: Generous Spacing)         */}
            {/* ============================================================ */}
            <nav
              className="hidden lg:flex items-center gap-7 xl:gap-10"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative py-1 text-[12.5px] xl:text-[13px] uppercase tracking-[0.24em] font-medium text-[#eae6df] hover:text-[#f5f2eb] transition-colors group"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[#c9a87c] transition-all duration-300 ease-out group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* ============================================================ */}
            {/* DESKTOP ACTION AREA (Right Column: Find Booking + Book CTA)  */}
            {/* ============================================================ */}
            <div className="hidden lg:flex items-center gap-4 pl-6 lg:pl-8 xl:pl-10">
              <a
                href="/find-booking"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#eae6df] hover:text-[#c9a87c] transition-colors font-medium"
              >
                Find Booking
              </a>

              <button
                type="button"
                onClick={() => openBooking()}
                className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] font-bold font-mono uppercase tracking-[0.2em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] cursor-pointer focus-visible:outline-none shadow-[0_2px_15px_rgba(245,242,235,0.1)] shrink-0"
                style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                aria-label="Book an appointment slot at Glamour Emporium"
              >
                <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                <span className="relative z-10 flex items-center gap-1.5 font-bold text-[#0c0b0a]">
                  <CalendarDays className="w-3.5 h-3.5 text-[#0c0b0a]" />
                  <span>BOOK A SLOT</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            </div>

          {/* ============================================================ */}
          {/* MOBILE RIGHT CONTROLS: Compact BOOK CTA + Menu Trigger       */}
          {/* ============================================================ */}
          <div className="flex lg:hidden items-center gap-1.5 xs:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 xs:px-3 xs:py-2 text-[9.5px] xs:text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#0c0b0a] bg-[#f5f2eb] hover:bg-[#c9a87c] transition-colors cursor-pointer min-h-[40px] shadow-sm"
              style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
              aria-label="Book a slot online"
            >
              <span>BOOK</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] text-[#f5f2eb] border border-white/20 bg-black/40 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c] cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE EDITORIAL FULLSCREEN MENU                             */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-[#0c0b0a] text-[#f5f2eb] flex flex-col lg:hidden h-[100dvh] max-h-[100dvh]"
          >
            {/* Top Fixed/Sticky Drawer Bar with Brand & Clear Close (X) Button */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#090909]/95 backdrop-blur-md border-b border-[#c9a87c]/20 shrink-0">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Glamour Emporium Home"
                className="flex items-center gap-2.5 min-w-0"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#c9a87c]/60 shrink-0">
                  <Image
                    src="/images/logo/logo-mark.webp"
                    alt="Glamour Emporium Logo"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="font-serif text-[13px] sm:text-[14px] font-normal tracking-[0.14em] text-[#f5f2eb] uppercase leading-tight truncate">
                    GLAMOUR EMPORIUM
                  </span>
                  <span className="font-sans font-medium text-[7px] sm:text-[7.5px] tracking-[0.24em] uppercase text-[#c9a87c] leading-none mt-0.5">
                    UNISEX SALON • PANIPAT
                  </span>
                </div>
              </Link>

              {/* High-visibility Close (X) button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] text-[#f5f2eb] bg-white/[0.06] hover:bg-[#c9a87c]/20 border border-[#c9a87c]/40 hover:border-[#c9a87c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a87c] cursor-pointer shrink-0 rounded-sm shadow-sm"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-[#f5f2eb]" />
              </button>
            </div>

            {/* Scrollable Menu Body */}
            <div
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col justify-between"
              style={{
                paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))",
              }}
            >
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-[10px] tracking-[0.28em] uppercase text-[#c9a87c] font-medium font-mono">
                    CAMPAIGN NAVIGATION
                  </span>
                  <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase">
                    MOMENTS & SERVICES
                  </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
                  {navLinks.map((link, idx) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      initial={prefersReducedMotion ? false : { x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.03 * idx, duration: 0.25 }}
                      className="flex items-baseline justify-between py-2 sm:py-2.5 border-b border-white/10 text-xl sm:text-2xl font-serif font-light tracking-tight text-[#f5f2eb] hover:text-[#c9a87c] active:text-[#c9a87c] transition-colors min-h-[44px]"
                    >
                      <span>{link.label}</span>
                      <span className="font-mono text-xs text-[#c9a87c] tracking-widest">
                        {link.number}
                      </span>
                    </motion.a>
                  ))}
                </nav>

                {/* Compact Promotional Offer Card at Bottom of Nav Links */}
                <BookingPromoMobileDrawer
                  onSelectOffer={() => {
                    setMobileMenuOpen(false);
                    openBooking();
                  }}
                />

                {/* Primary Booking CTA inside Drawer */}
                <div className="pt-1 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openBooking();
                    }}
                    className="flex items-center justify-between w-full p-3.5 sm:p-4 bg-[#f5f2eb] text-[#0c0b0a] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#c9a87c] transition-colors min-h-[48px] shadow-[0_4px_20px_rgba(245,242,235,0.12)] cursor-pointer"
                    style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                  >
                    <span className="flex items-center gap-2.5">
                      <CalendarDays className="w-4 h-4 text-[#0c0b0a]/80" />
                      <span>BOOK A SLOT</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {/* Find Booking Quick Link */}
                  <a
                    href="/find-booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full p-3 sm:p-3.5 border border-[#c9a87c]/30 bg-white/[0.02] text-[#f5f2eb] text-xs font-mono uppercase tracking-[0.16em] hover:border-[#c9a87c] transition-colors min-h-[44px]"
                  >
                    <span className="flex items-center gap-2 text-[#c9a87c]">
                      <span>✦</span>
                      <span>FIND MY BOOKING / RECEIPT</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#c9a87c]" />
                  </a>

                  {/* Instagram Quick Link */}
                  <a
                    href={siteData.business.social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full p-3 sm:p-3.5 border border-white/15 bg-white/[0.03] text-[#f5f2eb] text-xs font-mono uppercase tracking-[0.16em] hover:border-[#c9a87c] transition-colors min-h-[44px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <InstagramIcon className="w-4 h-4 text-[#E1306C]" color="#E1306C" />
                      <span>@{siteData.business.social.instagram.handle}</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
                  </a>
                </div>
              </div>

              {/* Mobile Footer Information */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-1.5 text-xs text-white/60 font-sans">
                <div className="text-[#f5f2eb] font-medium text-xs sm:text-sm flex items-center justify-between">
                  <span>{siteData.business.name}</span>
                  <span className="text-[9px] font-mono text-[#c9a87c] tracking-widest uppercase">
                    PANIPAT, HARYANA
                  </span>
                </div>
                <div className="text-[10.5px] sm:text-[11px] leading-relaxed text-[#eae6df]/80">
                  {siteData.business.address.fullAddress}
                </div>
                <div className="text-[#c9a87c] text-[10.5px] sm:text-[11px] mt-0.5 font-mono">
                  {siteData.business.contact.phoneDisplay}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
