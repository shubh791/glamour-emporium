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
import BookingPromoStrip from "@/components/ui/BookingPromoStrip";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { openBooking } = useBooking();

  const navLinks = [
    { label: "Services", href: "#services", number: "01" },
    { label: "Experience", href: "#experience", number: "02" },
    { label: "Gallery", href: "#showcase", number: "03" },
    { label: "Contact", href: "#contact", number: "04" },
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
        {/* Booking Promo Announcement Strip */}
        <BookingPromoStrip />

        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[44px] transition-all duration-300 ${
          isScrolled ? "py-2.5 sm:py-3" : "py-3.5 sm:py-4 lg:py-5"
        }`}>
          
          {/* ============================================================ */}
          {/* DESKTOP BRAND (Unchanged)                                    */}
          {/* ============================================================ */}
          <div className="hidden lg:flex items-center">
            <a
              href="#hero"
              className="group flex items-center focus-visible:outline-none"
              aria-label={`${siteData.business.name} — Home`}
            >
              <BrandMark
                size="md"
                showMonogram={true}
                monogramClassName="group-hover:border-[#c9a87c]"
                textClassName="group-hover:text-[#c9a87c] text-2xl"
              />
            </a>
          </div>

          {/* ============================================================ */}
          {/* MOBILE BRAND (Left Logo Emblem + Center Flexible Brand Name) */}
          {/* ============================================================ */}
          <a
            href="#hero"
            className="flex lg:hidden items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 mr-3 group focus-visible:outline-none"
            aria-label={`${siteData.business.name} — Home`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Official Circular Logo Emblem (40–44px touch-proportional) */}
            <div
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#0c0b0a] border border-[#c9a87c]/50 group-hover:border-[#c9a87c] shrink-0 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              aria-hidden="true"
            >
              <Image
                src="/images/logo/logo-mark.webp"
                alt="Glamour Emporium Official Emblem"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>

            {/* Brand Name (Single Line, Never Wraps, Flexible Space) */}
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="font-serif font-light tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[15px] sm:text-[17px] text-[#f5f2eb] group-hover:text-[#c9a87c] transition-colors block truncate whitespace-nowrap leading-tight">
                GLAMOUR EMPORIUM
              </span>
            </div>
          </a>

          {/* ============================================================ */}
          {/* DESKTOP NAVIGATION & ACTION (Unchanged)                       */}
          {/* ============================================================ */}
          <nav
            className="hidden lg:flex items-center gap-8 xl:gap-10"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link-item relative py-1 text-[13px] uppercase tracking-[0.22em] font-medium group"
                style={{ color: "#E8E4DA" }}
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[#c9a87c] transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Right Action: BOOK A SLOT Button */}
          <div className="hidden lg:flex items-center">
            <button
              type="button"
              onClick={() => openBooking()}
              className="relative group inline-flex items-center justify-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] cursor-pointer focus-visible:outline-none"
              style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
            >
              <span className="absolute inset-0 bg-[#0c0b0a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none border border-[#c9a87c]" />
              <span className="relative z-10 flex items-center gap-2 font-bold text-[#0c0b0a] group-hover:text-[#f5f2eb] transition-colors duration-300">
                <CalendarDays className="w-3.5 h-3.5 text-[#0c0b0a] group-hover:text-[#c9a87c] transition-colors" />
                <span>BOOK A SLOT</span>
                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* MOBILE RIGHT CONTROL: Hamburger Menu Trigger (44px Target)   */}
          {/* ============================================================ */}
          <div className="flex lg:hidden items-center shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-11 h-11 text-[#f5f2eb] border border-white/20 bg-black/40 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c] cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
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
