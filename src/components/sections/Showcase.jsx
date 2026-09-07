"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { siteData } from "@/data/siteData";
import InstagramIcon from "@/components/ui/InstagramIcon";

/**
 * ============================================================================
 * GALLERY IMAGE ASSETS (4 Female / 2 Male Balanced Unisex Campaign):
 * ============================================================================
 * 
 * 01 / LAYER — WOMAN (01-layered-haircut.webp):
 * Luxury editorial portrait of an Indian woman in her late 20s showcasing a
 * long layered haircut with fluid blowout volume and movement. Dark glossy
 * brunette hair, delicate face-framing layers, warm directional studio lighting.
 * 
 * 02 / SHAPE — MAN (02-mens-textured-haircut.webp):
 * Premium men's grooming editorial portrait of an Indian man (~27 yrs) with a
 * contemporary textured haircut, clean low taper, side profile defining silhouette
 * and groomed beard texture. Warm side lighting on espresso backdrop.
 * 
 * 03 / TEXTURE — WOMAN (03-soft-waves-texture.webp):
 * Luxury salon campaign photograph of an Indian woman with voluminous, bouncy soft
 * waves and healthy hair texture catching warm studio backlight through strands.
 * 
 * 04 / COLOUR — WOMAN (04-dimensional-hair-colour.webp):
 * High-end salon colour editorial from a 3/4 back/side angle highlighting
 * seamless mocha and caramel ribbon balayage on rich dark espresso root base.
 * 
 * 05 / CRAFT — MAN (05-mens-grooming-craft.webp):
 * Authentic documentary photograph of a professional hairstylist actively
 * performing precision scissor and comb work on an Indian male client in chair.
 * 
 * 06 / FINISH — WOMAN (06-finished-hair-look.webp):
 * Luxury final-look salon editorial portrait of a stylish Indian woman in dark
 * tailored blazer immediately following professional styling. Calm confident polish.
 * ============================================================================
 */

const galleryItems = [
  {
    id: "01",
    label: "01 / LAYER",
    title: "Layered Movement",
    src: "/images/gallery/01-layered-haircut.webp",
    alt: "Layered haircut styling at Glamour Emporium",
    position: "50% 30%",
  },
  {
    id: "02",
    label: "02 / SHAPE",
    title: "Precision Silhouette",
    src: "/images/gallery/02-mens-textured-haircut.webp",
    alt: "Men's contemporary textured haircut and low taper",
    position: "50% 25%",
  },
  {
    id: "03",
    label: "03 / TEXTURE",
    title: "Gloss & Waves",
    src: "/images/gallery/03-soft-waves-texture.webp",
    alt: "Soft wave hair styling with natural volume",
    position: "50% 25%",
  },
  {
    id: "04",
    label: "04 / COLOUR",
    title: "Dimensional Tone",
    src: "/images/gallery/04-dimensional-hair-colour.webp",
    alt: "Dimensional brunette and caramel hair colour",
    position: "50% 30%",
  },
  {
    id: "05",
    label: "05 / CRAFT",
    title: "Artisan Sectioning",
    src: "/images/gallery/05-mens-grooming-craft.webp",
    alt: "Professional hairstylist cutting hair with precision shears",
    position: "50% 35%",
  },
  {
    id: "06",
    label: "06 / FINISH",
    title: "Tailored Polish",
    src: "/images/gallery/06-finished-hair-look.webp",
    alt: "Finished salon hairstyle and polished transformation",
    position: "50% 25%",
  },
];

export default function Showcase() {
  return (
    <section
      id="showcase"
      aria-labelledby="lookbook-heading"
      className="relative w-full bg-[#f2f0e9] text-[#292c27] py-20 sm:py-24 lg:py-28 overflow-hidden border-t border-[#cecec3]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* TOP INTRO: Compact & High-End Editorial                      */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 sm:pb-16 border-b border-[#cecec3]">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#66685e]">
              THE LOOKBOOK
            </span>
            <h2
              id="lookbook-heading"
              className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] tracking-tight font-light text-[#292c27] mt-3"
            >
              STYLE<br />
              <span className="italic font-normal">IN MOTION.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 pb-1">
            <p className="max-w-xs text-sm sm:text-base text-[#66685e] font-sans leading-relaxed md:text-right">
              Cuts, texture, colour and finishing — seen differently.
            </p>
            <a
              href={siteData.business.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#292c27] text-[#f2f0e9] hover:bg-[#3f433b] text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_15px_rgba(41,44,39,0.12)] min-h-[42px]"
              style={{ color: "#f2f0e9", backgroundColor: "#292c27" }}
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" color="#E1306C" />
              <span>EXPLORE INSTAGRAM</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP CINEMATIC SPREAD (Editorial Asymmetric Layout)       */}
        {/* ============================================================ */}
        <div className="hidden lg:flex flex-col gap-12 mt-16">
          
          {/* Main 3-Column Storytelling Row */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Huge Vertically Cropped Female Hero Portrait (Dominant) */}
            <div className="col-span-5 relative group">
              <div className="relative w-full h-[620px] bg-[#141312] border border-[#cecec3] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <Image
                  src={galleryItems[0].src}
                  alt={galleryItems[0].alt}
                  fill
                  sizes="40vw"
                  className="object-cover saturate-[0.92] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  style={{ objectPosition: galleryItems[0].position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 z-10 font-mono text-[9px] uppercase tracking-[0.22em] text-[#f2f0e9] bg-[#292c27]/90 px-2.5 py-1">
                  {galleryItems[0].label}
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between text-xs font-mono tracking-widest text-[#66685e]">
                <span>{galleryItems[0].title}</span>
                <span>VOLUMETRIC EDIT</span>
              </div>
            </div>

            {/* CENTER: Editorial Typography + Integrated Detail Crop */}
            <div className="col-span-3 flex flex-col justify-between h-[620px] py-4">
              <div className="border-t border-[#cecec3] pt-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#66685e]">
                  CAMPAIGN REF. 01
                </span>
                <p className="font-serif text-3xl font-light tracking-tight text-[#292c27] leading-snug mt-2">
                  Shape, weight and balance tailored to you.
                </p>
              </div>

              {/* Integrated Detail Crop (02 / SHAPE) */}
              <div className="relative w-full aspect-[3/4] bg-[#e8e6de] border border-[#cecec3] overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
                <Image
                  src={galleryItems[1].src}
                  alt={galleryItems[1].alt}
                  fill
                  sizes="25vw"
                  className="object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ objectPosition: galleryItems[1].position }}
                />
                <div className="absolute bottom-3 left-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2 py-0.5">
                  {galleryItems[1].label}
                </div>
              </div>

              <div className="border-b border-[#cecec3] pb-4 font-mono text-[9px] tracking-[0.2em] uppercase text-[#66685e]">
                PANIPAT • UNISEX SALON
              </div>
            </div>

            {/* RIGHT: Two Vertically Stacked Editorial Images */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* Stacked 03 (Texture & Waves) */}
              <div className="relative w-full h-[290px] bg-[#161513] border border-[#cecec3] overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
                <Image
                  src={galleryItems[2].src}
                  alt={galleryItems[2].alt}
                  fill
                  sizes="30vw"
                  className="object-cover saturate-[0.92] transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ objectPosition: galleryItems[2].position }}
                />
                <div className="absolute bottom-3 right-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2 py-0.5">
                  {galleryItems[2].label}
                </div>
              </div>

              {/* Stacked 04 (Colour & Craft) */}
              <div className="relative w-full h-[300px] bg-[#e8e6de] border border-[#cecec3] overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
                <Image
                  src={galleryItems[3].src}
                  alt={galleryItems[3].alt}
                  fill
                  sizes="30vw"
                  className="object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ objectPosition: galleryItems[3].position }}
                />
                <div className="absolute bottom-3 left-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2 py-0.5">
                  {galleryItems[3].label}
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Wide Cinematic Lookbook Strip (05 / CRAFT & 06 / FINISH) */}
          <div className="grid grid-cols-12 gap-8 items-center pt-8 border-t border-[#cecec3]">
            {/* Wide Craft Frame */}
            <div className="col-span-7 relative h-[360px] bg-[#141312] border border-[#cecec3] overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
              <Image
                src={galleryItems[4].src}
                alt={galleryItems[4].alt}
                fill
                sizes="55vw"
                className="object-cover saturate-[0.88] transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: galleryItems[4].position }}
              />
              <div className="absolute bottom-4 left-4 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2.5 py-1">
                {galleryItems[4].label}
              </div>
            </div>

            {/* Polish Finish Frame */}
            <div className="col-span-5 relative h-[360px] bg-[#1a1917] border border-[#cecec3] overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
              <Image
                src={galleryItems[5].src}
                alt={galleryItems[5].alt}
                fill
                sizes="40vw"
                className="object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: galleryItems[5].position }}
              />
              <div className="absolute bottom-4 right-4 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2.5 py-1">
                {galleryItems[5].label}
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* MOBILE DEDICATED VERTICAL COMPOSITION                        */}
        {/* ============================================================ */}
        <div className="lg:hidden flex flex-col gap-6 sm:gap-8 mt-10">
          
          {/* 1. Large Hero Hair Portrait (01 / LAYER — WOMAN) */}
          <div className="relative w-full aspect-[4/5] bg-[#141312] border border-[#cecec3] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
            <Image
              src={galleryItems[0].src}
              alt={galleryItems[0].alt}
              fill
              sizes="95vw"
              className="object-cover saturate-[0.92]"
              style={{ objectPosition: galleryItems[0].position }}
            />
            <div className="absolute bottom-3 left-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2 py-0.5">
              {galleryItems[0].label}
            </div>
          </div>

          {/* 2. Precision Detail & Texture 2-Column Row (02 / SHAPE — MAN & 03 / TEXTURE — WOMAN) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative w-full aspect-[3/4] bg-[#e8e6de] border border-[#cecec3] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
              <Image
                src={galleryItems[1].src}
                alt={galleryItems[1].alt}
                fill
                sizes="45vw"
                className="object-cover saturate-[0.9]"
                style={{ objectPosition: galleryItems[1].position }}
              />
              <div className="absolute bottom-2 left-2 z-10 font-mono text-[7px] uppercase tracking-[0.16em] text-[#f2f0e9] bg-[#292c27]/90 px-1.5 py-0.5">
                {galleryItems[1].label}
              </div>
            </div>

            <div className="relative w-full aspect-[3/4] bg-[#161513] border border-[#cecec3] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
              <Image
                src={galleryItems[2].src}
                alt={galleryItems[2].alt}
                fill
                sizes="45vw"
                className="object-cover saturate-[0.92]"
                style={{ objectPosition: galleryItems[2].position }}
              />
              <div className="absolute bottom-2 left-2 z-10 font-mono text-[7px] uppercase tracking-[0.16em] text-[#f2f0e9] bg-[#292c27]/90 px-1.5 py-0.5">
                {galleryItems[2].label}
              </div>
            </div>
          </div>

          {/* 3. Colour & Craft 2-Column Row (04 / COLOUR — WOMAN & 05 / CRAFT — MAN) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative w-full aspect-[3/4] bg-[#e8e6de] border border-[#cecec3] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
              <Image
                src={galleryItems[3].src}
                alt={galleryItems[3].alt}
                fill
                sizes="45vw"
                className="object-cover saturate-[0.9]"
                style={{ objectPosition: galleryItems[3].position }}
              />
              <div className="absolute bottom-2 left-2 z-10 font-mono text-[7px] uppercase tracking-[0.16em] text-[#f2f0e9] bg-[#292c27]/90 px-1.5 py-0.5">
                {galleryItems[3].label}
              </div>
            </div>

            <div className="relative w-full aspect-[3/4] bg-[#141312] border border-[#cecec3] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
              <Image
                src={galleryItems[4].src}
                alt={galleryItems[4].alt}
                fill
                sizes="45vw"
                className="object-cover saturate-[0.88]"
                style={{ objectPosition: galleryItems[4].position }}
              />
              <div className="absolute bottom-2 left-2 z-10 font-mono text-[7px] uppercase tracking-[0.16em] text-[#f2f0e9] bg-[#292c27]/90 px-1.5 py-0.5">
                {galleryItems[4].label}
              </div>
            </div>
          </div>

          {/* 4. Large Final Polish Frame (06 / FINISH — WOMAN) */}
          <div className="relative w-full aspect-[4/5] bg-[#1a1917] border border-[#cecec3] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
            <Image
              src={galleryItems[5].src}
              alt={galleryItems[5].alt}
              fill
              sizes="95vw"
              className="object-cover saturate-[0.88]"
              style={{ objectPosition: galleryItems[5].position }}
            />
            <div className="absolute bottom-3 left-3 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2f0e9] bg-[#292c27]/90 px-2 py-0.5">
              {galleryItems[5].label}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Clean Booking Action */}
        <div className="mt-12 pt-8 border-t border-[#cecec3] flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <p className="font-serif text-xl sm:text-3xl text-[#292c27] font-light italic">
            &ldquo;Never ordinary. Always you.&rdquo;
          </p>

          <a
            href={siteData.booking.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#292c27] text-[#f2f0e9] hover:bg-[#424839] text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 min-h-[44px] shadow-[0_4px_15px_rgba(41,44,39,0.12)] w-full sm:w-auto text-center"
            style={{ color: "#f2f0e9", backgroundColor: "#292c27" }}
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#f2f0e9]/80" />
            <span>BOOK AN APPOINTMENT</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
