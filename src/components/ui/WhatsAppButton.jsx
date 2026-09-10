"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteData, buildWhatsAppUrl } from "@/data/siteData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

export default function WhatsAppButton({
  message = "Hello Glamour Emporium,\n\nI have a question and need some help before booking my appointment.\n\nThank you.",
  className = "",
  variant = "floating",
  label = "NEED HELP? CHAT WITH US",
}) {
  const reducedMotion = useReducedMotion();
  const targetUrl = buildWhatsAppUrl(message);

  if (variant !== "floating") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Need help? Chat with Glamour Emporium on WhatsApp"
        className={cn(
          "inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#161513] text-[#f5f2eb] border border-white/15 hover:border-[#25D366]/60 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 group min-h-[44px]",
          className
        )}
      >
        <span className="p-1 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
        </span>
        <span>{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/60 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    );
  }

  return (
    <aside
      aria-label="WhatsApp customer support"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 select-none"
    >
      <motion.a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Need help? Chat with Glamour Emporium on WhatsApp (+91 74950 68282)"
        whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        className={cn(
          "group flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-[#141312]/95 backdrop-blur-md text-[#f5f2eb] border border-white/15 hover:border-[#25D366]/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 min-h-[44px] rounded-full",
          className
        )}
      >
        {/* Recognizable WhatsApp Icon with glowing green container */}
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:bg-[#25D366] transition-colors duration-300">
          <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#25D366] group-hover:text-[#0c0b0a] transition-colors duration-300" />
        </span>

        {/* Text Label: Desktop (NEED HELP? CHAT WITH US) vs Mobile (NEED HELP?) */}
        <span className="hidden sm:inline font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f5f2eb] group-hover:text-white transition-colors">
          {label}
        </span>
        <span className="sm:hidden font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#f5f2eb]">
          NEED HELP?
        </span>

        {/* Arrow Accent */}
        <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
      </motion.a>
    </aside>
  );
}

