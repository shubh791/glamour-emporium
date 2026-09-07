import Link from "next/link";
import { ArrowLeft, CalendarDays, ArrowUpRight } from "lucide-react";
import BrandMark from "@/components/ui/BrandMark";
import { siteData } from "@/data/siteData";

export default function NotFound() {
  return (
    <div className="relative min-h-[100svh] w-full bg-[#0c0b0a] text-[#f5f2eb] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-[#c9a87c]/6 blur-[130px]" />
      </div>

      {/* Top Header: Brand */}
      <header className="relative z-10 mx-auto max-w-7xl w-full flex items-center justify-center sm:justify-start">
        <Link
          href="/"
          className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a87c]"
          aria-label={`${siteData.business.name} — Home`}
        >
          <BrandMark
            size="md"
            showMonogram={true}
            monogramClassName="group-hover:border-[#c9a87c]"
            textClassName="group-hover:text-[#c9a87c]"
          />
        </Link>
      </header>

      {/* Main 404 Narrative Content */}
      <main className="relative z-10 mx-auto max-w-2xl w-full text-center my-auto py-12 flex flex-col items-center">
        {/* Editorial Numeral */}
        <span
          className="font-serif text-[clamp(5.5rem,18vw,11rem)] leading-none font-light tracking-tighter text-[#c9a87c]/30 select-none block"
          aria-hidden="true"
        >
          404
        </span>

        {/* Small Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3 -mt-4">
          <span className="h-[1px] w-6 bg-[#c9a87c]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a87c] font-semibold">
            PAGE NOT FOUND
          </span>
          <span className="h-[1px] w-6 bg-[#c9a87c]" />
        </div>

        {/* Dominant Heading */}
        <h1 className="font-serif text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-tight font-light text-[#f5f2eb] uppercase">
          LOOK NOT{" "}
          <span className="italic font-normal text-[#c9a87c]">FOUND.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 max-w-md text-sm sm:text-base text-[#eae6df]/80 font-sans leading-relaxed">
          The page you’re looking for isn’t here. Return to our salon overview or connect with us directly.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary CTA: BACK TO HOME */}
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] shadow-[0_4px_25px_rgba(245,242,235,0.12)] min-h-[48px]"
            style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
          >
            <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-[#0c0b0a]">
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              <span>BACK TO HOME</span>
            </span>
          </Link>

          {/* Secondary CTA: BOOK YOUR SLOT */}
          <a
            href={siteData.booking.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f2eb] hover:text-[#c9a87c] border border-white/20 hover:border-[#c9a87c] bg-white/[0.02] hover:bg-[#c9a87c]/10 transition-all min-h-[48px]"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#c9a87c]" />
            <span>BOOK YOUR SLOT</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </main>

      {/* Bottom Subtle Footer Meta */}
      <footer className="relative z-10 mx-auto max-w-7xl w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 text-center sm:text-left">
        <div>GLAMOUR EMPORIUM / 404</div>
        <div>PANIPAT, HARYANA</div>
      </footer>
    </div>
  );
}
