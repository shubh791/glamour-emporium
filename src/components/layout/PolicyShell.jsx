"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Shield, FileText, RefreshCw, Phone, MapPin, CalendarDays, ArrowUpRight } from "lucide-react";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import BookingModal from "@/components/booking/BookingModal";
import { siteData } from "@/data/siteData";

const POLICIES = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
    icon: Shield,
    shortDesc: "Customer data, security & privacy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms-and-conditions",
    icon: FileText,
    shortDesc: "Salon service terms & booking rules",
  },
  {
    label: "Cancellation & Refund Policy",
    href: "/cancellation-refund-policy",
    icon: RefreshCw,
    shortDesc: "₹99 advance, adjustment & cancellation rules",
  },
];

function PolicyHeader({ title, description, lastUpdated = "September 2026" }) {
  const pathname = usePathname();
  const { openBooking } = useBooking();

  return (
    <div className="relative pt-32 sm:pt-40 pb-12 sm:pb-16 border-b border-white/10 overflow-hidden bg-[#0c0b0a]">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] max-w-4xl rounded-full bg-[#c9a87c]/6 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.16em] uppercase text-white/50 mb-6">
          <Link href="/#hero" className="hover:text-[#c9a87c] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>HOME</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/40">LEGAL</span>
          <span className="text-white/20">/</span>
          <span className="text-[#c9a87c] font-medium">{title}</span>
        </div>

        {/* Title & Tag */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-white/[0.04] border border-[#c9a87c]/30 text-[#c9a87c] text-[10px] font-mono uppercase tracking-[0.24em]">
            <span>OFFICIAL SALON POLICY</span>
            <span className="text-white/20">•</span>
            <span>GLAMOUR EMPORIUM</span>
          </div>

          <h1 className="font-serif font-light text-3xl sm:text-5xl lg:text-6xl text-[#f5f2eb] tracking-tight leading-[1.1] max-w-3xl">
            {title}
          </h1>

          {description && (
            <p className="text-sm sm:text-base text-[#eae6df]/80 font-sans leading-relaxed max-w-2xl mt-1">
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono tracking-widest text-white/40 mt-2">
            <span className="px-2.5 py-1 bg-white/[0.03] border border-white/10 text-white/60">
              LAST UPDATED: {lastUpdated}
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="text-[#c9a87c]">PANIPAT, HARYANA</span>
          </div>
        </div>

        {/* Policy Switcher Tabs */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a87c] mb-3">
            ALL POLICY DOCUMENTS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {POLICIES.map((p) => {
              const Icon = p.icon;
              const isActive = pathname === p.href;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`group p-3.5 sm:p-4 border transition-all duration-300 flex flex-col justify-between gap-2 ${
                    isActive
                      ? "bg-[#c9a87c]/10 border-[#c9a87c] text-[#f5f2eb] shadow-[0_0_20px_rgba(201,168,124,0.15)]"
                      : "bg-white/[0.02] border-white/10 text-white/70 hover:border-white/25 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#c9a87c]" : "text-white/50 group-hover:text-[#c9a87c]"}`} />
                      <span>{p.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a87c]" />
                    )}
                  </div>
                  <span className="text-[11px] text-white/50 font-sans leading-tight">
                    {p.shortDesc}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function SalonContactCard() {
  const { business, booking } = siteData;
  const { openBooking } = useBooking();

  return (
    <div className="mt-16 sm:mt-20 p-6 sm:p-8 bg-white/[0.02] border border-[#c9a87c]/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a87c]/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#c9a87c]">
            QUESTIONS & APPOINTMENTS
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#f5f2eb] font-light">
            Need assistance regarding your visit or policy?
          </h3>
          <p className="text-xs sm:text-sm text-[#eae6df]/70 font-sans max-w-lg">
            Our team is available at the salon on Jattal Road, Panipat (closed Tuesdays). Contact us directly for scheduling, styling consultations, or policy questions.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-xs text-white/70 font-sans">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#c9a87c]" />
              <span>{business.address.fullAddress}</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <Phone className="w-3.5 h-3.5 text-[#c9a87c]" />
              <a href={`tel:${business.contact.phoneTel}`} className="text-[#c9a87c] hover:underline">
                {business.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openBooking()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#f5f2eb] text-[#0c0b0a] hover:bg-[#c9a87c] text-xs font-semibold uppercase tracking-[0.18em] transition-colors shadow-sm cursor-pointer"
            style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>BOOK A SLOT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          
          <a
            href={booking.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/15 text-[#f5f2eb] hover:border-[#c9a87c] text-xs font-mono uppercase tracking-[0.16em] transition-colors"
          >
            <span>WHATSAPP SUPPORT</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/60" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PolicyShell({ title, description, lastUpdated, children }) {
  return (
    <BookingProvider>
      <div className="site-shell bg-[#0c0b0a] text-[#f5f2eb] min-h-screen flex flex-col">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Policy Header & Tabs */}
        <PolicyHeader title={title} description={description} lastUpdated={lastUpdated} />

        {/* Main Content Area */}
        <main id="main-content" tabIndex={-1} className="flex-1 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="policy-prose font-sans text-[#eae6df]/90 text-sm sm:text-[15px] leading-relaxed">
              {children}
            </div>

            {/* Salon Help & Appointment Card */}
            <SalonContactCard />
          </div>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Fixed WhatsApp Action Trigger */}
        <WhatsAppButton />

        {/* Global Single-Instance Booking Modal */}
        <BookingModal />
      </div>
    </BookingProvider>
  );
}
