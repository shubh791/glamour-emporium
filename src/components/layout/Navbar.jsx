"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, CalendarDays } from "lucide-react";
import { siteData } from "@/data/siteData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useBooking } from "@/context/BookingContext";
import BrandMark from "@/components/ui/BrandMark";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { BookingPromoDesktop, BookingPromoMobile } from "@/components/ui/BookingPromoStrip";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
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
      <motion.header
        initial={prefersReducedMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-[#0c0b0a]/95 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            : "bg-transparent border-b border-white/10"
        }`}
      >
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "py-2.5 sm:py-3 lg:py-3.5" : "py-3.5 sm:py-4 lg:py-5"
        }`}>
          
          {/* ============================================================ */}
          {/* DESKTOP BRAND (Left Column: Official Emblem + Wordmark)      */}
          {/* ============================================================ */}
          <div className="hidden lg:flex items-center">
            <a
              href="/#hero"
              className="group flex items-center gap-3.5 focus-visible:outline-none"
              aria-label={`${siteData.business.name} — Home`}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#c9a87c]/60 bg-[#0c0b0a] group-hover:border-[#c9a87c] shrink-0 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                <Image
                  src="/images/logo/logo-mark.webp"
                  alt="Glamour Emporium Official Emblem"
                  fill
                  sizes="40px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif font-light tracking-[0.18em] uppercase text-[18px] xl:text-[19px] text-[#f5f2eb] group-hover:text-[#c9a87c] transition-colors leading-tight">
                  GLAMOUR EMPORIUM
                </span>
                <span className="font-sans font-medium text-[8px] xl:text-[8.5px] tracking-[0.32em] uppercase text-[#c9a87c] mt-0.5 leading-none">
                  UNISEX SALON • PANIPAT
                </span>
              </div>
            </a>
          </div>

          {/* ============================================================ */}
          {/* MOBILE BRAND (Left: Official Emblem + Brand Name)            */}
          {/* ============================================================ */}
          <a
            href="/#hero"
            className="flex lg:hidden items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2 group focus-visible:outline-none"
            aria-label={`${siteData.business.name} — Home`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[#0c0b0a] border border-[#c9a87c]/60 group-hover:border-[#c9a87c] shrink-0 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <Image
                src="/images/logo/logo-mark.webp"
                alt="Glamour Emporium Official Emblem"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="font-serif font-light tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[15px] sm:text-[16px] text-[#f5f2eb] group-hover:text-[#c9a87c] transition-colors block truncate whitespace-nowrap leading-tight">
                GLAMOUR EMPORIUM
              </span>
            </div>
          </a>

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
          {/* DESKTOP ACTION AREA (Right Column: Compact Badge + Book CTA) */}
          {/* ============================================================ */}
          <div className="hidden lg:flex items-center gap-3.5 pl-6 lg:pl-8 xl:pl-10">
            <BookingPromoDesktop
              showPromo={showPromo}
              onDismiss={() => setShowPromo(false)}
            />

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
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center gap-1 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#0c0b0a] bg-[#f5f2eb] hover:bg-[#c9a87c] transition-colors cursor-pointer min-h-[38px] shadow-sm"
              style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
              aria-label="Book a slot online"
            >
              <span>BOOK</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 text-[#f5f2eb] border border-white/20 bg-black/40 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c] cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Compact 1-line Dismissible Offer Strip */}
        <BookingPromoMobile
          showPromo={showPromo}
          onDismiss={() => setShowPromo(false)}
        />
      </motion.header>

      {/* ============================================================ */}
      {/* MOBILE EDITORIAL FULLSCREEN MENU                             */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 bg-[#0c0b0a] text-[#f5f2eb] flex flex-col justify-between p-5 pt-24 sm:p-8 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a87c] font-medium">
                  CAMPAIGN NAVIGATION
                </span>
                <span className="font-mono text-[9px] tracking-widest text-white/40">
                  UNISEX SALON
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 sm:gap-4" aria-label="Mobile Navigation">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={prefersReducedMotion ? false : { x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.04 * idx, duration: 0.35 }}
                    className="flex items-baseline justify-between py-2.5 border-b border-white/10 text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#f5f2eb] hover:text-[#c9a87c] transition-colors min-h-[48px]"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs text-[#c9a87c] tracking-widest">
                      {link.number}
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Primary Booking CTA inside Drawer */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBooking();
                  }}
                  className="flex items-center justify-between w-full p-4 bg-[#f5f2eb] text-[#0c0b0a] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#c9a87c] transition-colors min-h-[50px] shadow-[0_4px_20px_rgba(245,242,235,0.12)] cursor-pointer"
                  style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                >
                  <span className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 text-[#0c0b0a]/80" />
                    <span>BOOK A SLOT</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {/* Instagram Quick Link */}
                <a
                  href={siteData.business.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3.5 border border-white/15 bg-white/[0.03] text-[#f5f2eb] text-xs font-mono uppercase tracking-[0.16em] hover:border-[#c9a87c] transition-colors min-h-[46px]"
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
            <div className="mt-8 pt-5 border-t border-white/10 flex flex-col gap-2 text-xs text-white/60 font-sans">
              <div className="text-[#f5f2eb] font-medium text-sm flex items-center justify-between">
                <span>{siteData.business.name}</span>
                <span className="text-[9px] font-mono text-[#c9a87c] tracking-widest uppercase">
                  PANIPAT, HARYANA
                </span>
              </div>
              <div className="text-[11px] leading-relaxed text-[#eae6df]/80">
                {siteData.business.address.fullAddress}
              </div>
              <div className="text-[#c9a87c] text-[11px] mt-1 font-mono">
                {siteData.business.contact.phoneDisplay}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
