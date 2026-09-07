"use client";

import Image from "next/image";
import { ArrowUpRight, Phone, MapPin, CalendarDays } from "lucide-react";
import { siteData } from "@/data/siteData";
import InstagramIcon from "@/components/ui/InstagramIcon";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Contact() {
  const { business, booking } = siteData;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full bg-[#0c0b0a] text-[#f5f2eb] py-20 sm:py-24 lg:py-28 overflow-hidden border-t border-white/10"
    >
      {/* Ambient Lighting Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/3 w-[45vw] h-[45vw] rounded-full bg-[#c9a87c]/6 blur-[140px]" />
        <div className="absolute bottom-0 right-10 w-[35vw] h-[35vw] rounded-full bg-[#2d2822]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ============================================================ */}
          {/* LEFT: Editorial Booking Statement & Primary WhatsApp CTA     */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a87c]">
              BOOK YOUR VISIT
            </span>

            <h2
              id="contact-heading"
              className="font-serif text-[clamp(2.35rem,7.5vw,4.8rem)] leading-[0.95] tracking-tight font-light text-[#f5f2eb] mt-3"
            >
              YOUR NEXT LOOK<br />
              <span className="italic font-normal text-[#c9a87c]">STARTS HERE.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm sm:text-base text-[#eae6df]/80 font-sans leading-relaxed">
              Personal attention and considered hair &amp; grooming for both men and women. Reach out directly on WhatsApp to reserve your slot or discuss styling preferences.
            </p>

            {/* Primary Action Button */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href={booking.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] shadow-[0_4px_25px_rgba(245,242,235,0.15)] hover:shadow-[0_4px_30px_rgba(201,168,124,0.35)] min-h-[48px] w-full sm:w-auto"
                style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
              >
                <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2.5 font-bold text-[#0c0b0a]">
                  <CalendarDays className="w-4 h-4 text-[#0c0b0a]" />
                  <span>BOOK YOUR SLOT</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </span>
              </a>

              <span className="inline-flex items-center gap-2 text-xs font-mono tracking-wide text-white/60">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>Direct booking on WhatsApp</span>
              </span>
            </div>

            {/* Supporting Visual Accent (Cropped Craft Image) */}
            <div className="mt-12 hidden lg:flex items-center gap-5 border-t border-white/10 pt-8">
              <div className="relative w-24 h-20 bg-[#161513] border border-white/15 overflow-hidden shrink-0">
                <Image
                  src="/images/salon-detail.jpg"
                  alt="Salon precision craftsmanship detail"
                  fill
                  sizes="100px"
                  className="object-cover saturate-[0.85]"
                />
              </div>
              <div className="text-xs text-white/60 font-sans leading-relaxed">
                <span className="block text-[#f5f2eb] font-serif text-sm">
                  The Salon Space
                </span>
                Jattal Road, Near Choudhary Hospital, Panipat
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: Unboxed Editorial Contact Details                     */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:pl-6">
            
            {/* VISIT */}
            <div className="border-t border-white/15 pt-6 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#c9a87c] font-mono text-[10px] tracking-[0.24em] uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>VISIT US</span>
              </div>
              <p className="font-serif text-xl sm:text-2xl text-[#f5f2eb] font-light leading-snug">
                {business.address.street}
              </p>
              <p className="text-sm text-[#eae6df]/70 font-sans">
                {business.address.city}, {business.address.state} — {business.address.postalCode}
              </p>
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
            <div className="border-t border-white/15 pt-6 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#c9a87c] font-mono text-[10px] tracking-[0.24em] uppercase">
                <Phone className="w-3.5 h-3.5" />
                <span>DIRECT LINE</span>
              </div>
              <a
                href={`tel:${business.contact.phoneTel}`}
                className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] hover:text-[#c9a87c] transition-colors tracking-tight"
              >
                {business.contact.phoneDisplay}
              </a>
              <span className="text-xs text-white/50 font-sans">
                Call for appointments and quick enquiries
              </span>
            </div>

            {/* INSTAGRAM */}
            <div className="border-t border-white/15 pt-6 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#c9a87c] font-mono text-[10px] tracking-[0.24em] uppercase">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>INSTAGRAM</span>
              </div>
              <a
                href={business.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-serif text-xl sm:text-2xl text-[#f5f2eb] hover:text-[#c9a87c] transition-colors"
              >
                <span>@{business.social.instagram.handle}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <span className="text-xs text-white/50 font-sans">
                Explore our latest cuts, styling and salon stories
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
