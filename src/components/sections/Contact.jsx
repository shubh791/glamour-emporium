"use client";

import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import { siteData } from "@/data/siteData";
import { CONTACT_EMAIL } from "@/data/bookingConfig";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Contact() {
  const { business } = siteData;

  const whatsappGeneralUrl = `https://wa.me/${business.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hello Glamour Emporium,\n\nI have a question before booking an appointment.\n\nCould you please assist me?"
  )}`;

  const emailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Enquiry - Glamour Emporium Unisex Salon"
  )}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full bg-[#0e0d0c] text-[#f5f2eb] py-14 sm:py-16 lg:py-20 overflow-hidden border-t border-white/10"
    >
      {/* Ambient Lighting Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/4 w-[35vw] h-[35vw] rounded-full bg-[#c9a87c]/4 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 w-[30vw] h-[30vw] rounded-full bg-[#2d2822]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Balanced Editorial 2-Column Direct Contact Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT: Headline & Context */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[1px] w-5 bg-[#c9a87c]" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a87c]">
                DIRECT ASSISTANCE
              </span>
            </div>

            <h2
              id="contact-heading"
              className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[0.98] tracking-tight font-light text-[#f5f2eb]"
            >
              NEED TO<br />
              <span className="italic font-normal text-[#c9a87c]">TALK FIRST?</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#eae6df]/80 font-sans leading-relaxed max-w-lg">
              Have a question before booking? Reach out directly and we&apos;ll help you with your visit.
            </p>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#eae6df]/60 tracking-wider uppercase">
              <span>Jattal Road, Panipat</span>
              <span>•</span>
              <span className="text-[#c9a87c]">Unisex Salon</span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="text-[10.5px] text-white/40 font-sans normal-case">Operated by SS Enterprises (GSTIN: 06OXPPS0718P1ZD)</span>
            </div>

          </div>

          {/* RIGHT: Clean Direct Contact Rows (WhatsApp & Email) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* 1. WHATSAPP Direct Action Card */}
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 bg-[#141312] border border-white/12 hover:border-[#c9a87c]/70 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0 mt-0.5 sm:mt-0">
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#c9a87c] font-semibold block">
                    WHATSAPP CONVERSATION
                  </span>
                  <span className="font-serif text-lg sm:text-xl text-[#f5f2eb] font-light block">
                    {business.contact.phoneDisplay}
                  </span>
                  <span className="text-xs text-[#eae6df]/65 font-sans">
                    Fastest response for styling advice &amp; questions
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] font-semibold text-[#c9a87c] group-hover:text-[#f5f2eb] transition-colors shrink-0">
                <span>CHAT ON WHATSAPP</span>
                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* 2. EMAIL Direct Action Card */}
            <a
              href={emailUrl}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 bg-[#141312] border border-white/12 hover:border-[#c9a87c]/70 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a87c]/15 border border-[#c9a87c]/30 flex items-center justify-center text-[#c9a87c] shrink-0 mt-0.5 sm:mt-0">
                  <Mail className="w-5 h-5 text-[#c9a87c]" />
                </div>
                <div>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#c9a87c] font-semibold block">
                    EMAIL ENQUIRY
                  </span>
                  <span className="font-serif text-lg sm:text-xl text-[#f5f2eb] font-light block">
                    {CONTACT_EMAIL}
                  </span>
                  <span className="text-xs text-[#eae6df]/65 font-sans">
                    For custom requirements, bridal styling or enquiries
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] font-semibold text-[#c9a87c] group-hover:text-[#f5f2eb] transition-colors shrink-0">
                <span>SEND AN EMAIL</span>
                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}

