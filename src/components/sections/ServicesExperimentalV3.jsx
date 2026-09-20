"use client";

import { useId, useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useIsPresent, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, CalendarDays, Sparkles, Heart } from "lucide-react";
import { BOOKING_ADVANCE, BOOKING_SERVICES } from "@/data/bookingConfig";
import { useBooking } from "@/context/BookingContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import styles from "./ServicesExperimentalV3.module.css";

// Exact approved catalogue and enquiry messages
const servicesData = [
  {
    id: "01",
    number: "01",
    title: "HAIR & STYLING",
    descriptor: "WOMEN & MEN",
    shortDesc:
      "From everyday haircuts and styling to colour and hair care, choose a service that suits your look, occasion and preferences.",
    ctaLabel: "ENQUIRE ABOUT HAIR & STYLING",
    quoteLines: ["Good", "Hair", "Brighter", "You"],
    services: [
      { name: "Haircut", subtitle: "Personalized to face shape & natural texture" },
      { name: "Hair Styling & Blow Dry", subtitle: "Volume, movement and finish" },
      { name: "Hair Colour & Balayage", subtitle: "Dimensional tone & highlights" },
      { name: "Restorative Hair Care / Spa", subtitle: "Deep nourishment & strand repair" },
      { name: "Scalp Health Therapy", subtitle: "Cleansing & revitalization" },
    ],
    image: {
      src: "/images/services/hair-and-styling.webp",
      alt: "Women's hair styling and haircut at Glamour Emporium salon in Panipat",
      position: "60% 25%",
      label: "01 / HAIR & STYLING",
    },
    whatsappMessage:
      "Hello Glamour Emporium,\n\nI would like to enquire about Hair & Styling.\n\nPlease share the available options and appointment availability.\n\nThank you.",
  },
  {
    id: "02",
    number: "02",
    title: "MEN'S GROOMING",
    descriptor: "TAILORED GROOMING",
    shortDesc:
      "Haircuts, beard grooming and styling services designed for a clean, well-finished look.",
    ctaLabel: "ENQUIRE ABOUT MEN'S GROOMING",
    quoteLines: ["Sharp", "Craft", "Modern", "Edge"],
    services: [
      { name: "Tailored Scissor Cut", subtitle: "Precision cutting & silhouette shaping" },
      { name: "Fade & Taper Cut", subtitle: "Clean low fade & textured crown" },
      { name: "Beard Grooming & Detailing", subtitle: "Sharp perimeter lines & beard care" },
      { name: "Head Massage & Scalp Care", subtitle: "Relaxing cleanse & scalp health" },
      { name: "Occasion Styling", subtitle: "Refined finish for events and everyday" },
    ],
    image: {
      src: "/images/services/mens-grooming.webp",
      alt: "Men's haircut and beard grooming at Glamour Emporium in Panipat",
      position: "55% 25%",
      label: "02 / MEN'S GROOMING",
    },
    whatsappMessage:
      "Hello Glamour Emporium,\n\nI would like to enquire about Men's Grooming.\n\nPlease share the available options and appointment availability.\n\nThank you.",
  },
  {
    id: "03",
    number: "03",
    title: "BEAUTY & CARE",
    descriptor: "SKIN & RITUALS",
    shortDesc:
      "Beauty and personal care services for everyday grooming, occasions and special moments.",
    ctaLabel: "ENQUIRE ABOUT BEAUTY & CARE",
    quoteLines: ["Pure", "Glow", "Deep", "Rituals"],
    services: [
      { name: "Facial & Skin Care", subtitle: "Hydrating, glow-enhancing skin care" },
      { name: "Hair Spa & Scalp Revival", subtitle: "Deep conditioning & follicle therapy" },
      { name: "Grooming & Clean Up", subtitle: "Gentle cleanse, exfoliation & renewal" },
      { name: "Detailing & Care Rituals", subtitle: "Refined grooming & finishing touches" },
      { name: "Style Consultation", subtitle: "One-on-one styling & care dialogue" },
    ],
    image: {
      src: "/images/services/beauty-and-care.webp",
      alt: "Beauty and skin care rituals at Glamour Emporium in Panipat",
      position: "50% 30%",
      label: "03 / BEAUTY & CARE",
    },
    whatsappMessage:
      "Hello Glamour Emporium,\n\nI would like to enquire about Beauty & Care.\n\nPlease share the available options and appointment availability.\n\nThank you.",
  },
];

const customEnquiryMessage =
  "Hello Glamour Emporium,\n\nI have a custom service enquiry.\n\nI'm looking for: [describe your requirement]\n\nPlease help me with the available options.\n\nThank you.";

const customEnquiryUrl = `https://wa.me/917495068282?text=${encodeURIComponent(customEnquiryMessage)}`;

const ease = [0.22, 1, 0.36, 1];
const desktopQuery = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const normalizeService = (value) => value.replace(/[’‘]/g, "'").toLowerCase();

function subscribeDesktop(callback) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia(desktopQuery).matches;
}

function getServerSnapshot() {
  return false;
}

function bookingOption(itemName, categoryName) {
  return BOOKING_SERVICES.find((option) => normalizeService(option) === normalizeService(itemName))
    || BOOKING_SERVICES.find((option) => normalizeService(option) === normalizeService(categoryName));
}

function getStageTitleParts(title) {
  if (title.includes(" & ")) {
    const [a, b] = title.split(" & ");
    return { line1: `${a} &`, line2: b };
  }
  const parts = title.split(" ");
  return { line1: parts[0], line2: parts.slice(1).join(" ") };
}

function StageImage({ service, cinematic, reducedMotion, x, y }) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      className={styles.stageImageCurtain}
      style={{ zIndex: isPresent ? 1 : 2 }}
      initial={{ opacity: cinematic ? 1 : 0, clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      exit={cinematic ? { clipPath: "inset(0% 0% 100% 0%)" } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : cinematic ? 0.58 : 0.2, ease }}
      aria-hidden={!isPresent}
    >
      <motion.div className={styles.stageImageWrap} style={{ x, y }}>
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(max-width: 1023px) 100vw, 60vw"
          className={styles.stageImage}
          style={{ objectPosition: service.image.position }}
          priority={service.id === "01"}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ServicesExperimentalV3() {
  const { isOpen, openBooking } = useBooking();
  const [activeId, setActiveId] = useState("01");
  const [previewId, setPreviewId] = useState(null);
  const reducedMotion = useReducedMotion();
  const desktopPointer = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getServerSnapshot);
  const cinematic = desktopPointer && !reducedMotion;
  const groupId = useId();
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const x = useSpring(xTarget, { stiffness: 120, damping: 28, mass: 0.5 });
  const y = useSpring(yTarget, { stiffness: 120, damping: 28, mass: 0.5 });
  const active = servicesData.find((service) => service.id === activeId) || servicesData[0];
  const preview = cinematic && previewId !== activeId && !isOpen
    ? servicesData.find((service) => service.id === previewId)
    : null;
  const highlightedId = isOpen ? activeId : (preview?.id || activeId);
  const categoryBooking = bookingOption(active.title, active.title);
  const stageTitle = getStageTitleParts(active.title);

  // Freeze parallax motion when BookingModal is open
  useEffect(() => {
    if (isOpen) {
      xTarget.set(0);
      yTarget.set(0);
    }
  }, [isOpen, xTarget, yTarget]);

  function selectCategory(id) {
    setActiveId(id);
    setPreviewId(null);
  }

  function moveImage(event) {
    if (!cinematic || event.pointerType !== "mouse" || isOpen) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const clamp = (value) => Math.max(-5, Math.min(5, value));
    xTarget.set(clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 10));
    yTarget.set(clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * 10));
  }

  function resetImage() {
    xTarget.set(0);
    yTarget.set(0);
  }

  return (
    <section id="services" aria-labelledby="services-heading" className={styles.section}>
      <div className={styles.atelier}>
        
        {/* Editorial Top Masthead */}
        <header className={styles.masthead}>
          <span>GLAMOUR EMPORIUM <span className={styles.slash}>/</span> SERVICE ATELIER</span>
          <span>PANIPAT <span className={styles.slash}>/</span> {active.number} OF 03</span>
        </header>

        {/* 2-Column Balanced Main Spread */}
        <div className={styles.stage}>
          
          {/* ============================================================ */}
          {/* LEFT SIDE: Heading + Large Index + Official Brand Signature */}
          {/* ============================================================ */}
          <div className={styles.leftColumn}>
            
            {/* Heading & Intro Block */}
            <div className={styles.headingBlock}>
              <div className={styles.headingTitleArea}>
                <span className={styles.eyebrow}>WHAT WE DO</span>
                <h2 id="services-heading" className={styles.heading}>
                  Crafted<br /><em>around you.</em>
                </h2>
              </div>

              <div className={styles.headingSideText}>
                <p>Explore hair, beauty and grooming services for men and women at our unisex salon on Jattal Road, Panipat.</p>
                <button
                  type="button"
                  onClick={() => openBooking({ category: active.title })}
                  className={styles.ourServicesLink}
                >
                  <span>OUR SERVICES</span>
                  <span className={styles.linkLine} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Large Editorial Service Index */}
            <LayoutGroup id={groupId}>
              <div className={styles.index} aria-label="Choose a service category">
                {servicesData.map((service) => {
                  const isActive = activeId === service.id;
                  const isHighlighted = highlightedId === service.id;

                  return (
                    <button
                      key={service.id}
                      id={`services-v3-selector-${service.id}`}
                      type="button"
                      className={styles.indexRow}
                      data-active={isActive}
                      data-preview={isHighlighted}
                      aria-pressed={isActive}
                      aria-controls="services-v3-stage-card"
                      onClick={() => selectCategory(service.id)}
                      onPointerEnter={(event) => {
                        if (cinematic && event.pointerType === "mouse" && !isOpen) setPreviewId(service.id);
                      }}
                      onFocus={() => { if (cinematic && !isOpen) setPreviewId(service.id); }}
                      onBlur={() => setPreviewId(null)}
                    >
                      <span className={styles.indexNumber}>{service.number}</span>
                      <span className={styles.indexTitle}>{service.title}</span>
                      <ArrowUpRight className={styles.indexArrow} size={20} aria-hidden="true" />

                      {/* Active line with solid gold circular dot on the left */}
                      {isActive && (
                        <motion.div
                          layoutId="service-active-line-dot"
                          className={styles.activeLineContainer}
                          transition={{ duration: reducedMotion ? 0 : 0.45, ease }}
                          aria-hidden="true"
                        >
                          <span className={styles.activeDot} />
                          <span className={styles.activeLine} />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            {/* Lower-Left Official Brand Area (No Fake Monogram) */}
            <div className={styles.brandFooter}>
              <div className={styles.brandEmblemWrap}>
                <Image
                  src="/images/logo/logo-mark.webp"
                  alt="Glamour Emporium Emblem"
                  width={34}
                  height={34}
                  className={styles.officialEmblem}
                />
              </div>

              <div className={styles.brandMeta}>
                <span className={styles.brandTitle}>UNISEX SALON</span>
                <span className={styles.brandSubtitle}>PANIPAT, HARYANA</span>
              </div>

              <div className={styles.brandDivider} aria-hidden="true" />

              <div className={styles.brandTagline}>
                <span>More than a salon.</span>
                <em>A better you.</em>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDE: Cinematic Dark Service Stage Card               */}
          {/* ============================================================ */}
          <div
            id="services-v3-stage-card"
            role="region"
            aria-label="Selected service stage"
            className={styles.stageCard}
            onPointerMove={moveImage}
            onPointerLeave={resetImage}
          >
            {/* Background Photographic Curtain */}
            <div className={styles.stageBackground}>
              <AnimatePresence initial={false}>
                <StageImage
                  key={activeId}
                  service={active}
                  cinematic={cinematic}
                  reducedMotion={reducedMotion}
                  x={cinematic ? x : 0}
                  y={cinematic ? y : 0}
                />
              </AnimatePresence>

              {/* Preview overlay on hover */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    key={`preview-${preview.id}`}
                    className={styles.previewCurtain}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    aria-hidden="true"
                  >
                    <Image
                      src={preview.image.src}
                      alt=""
                      fill
                      sizes="60vw"
                      className={styles.stageImage}
                      style={{ objectPosition: preview.image.position }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Atmospheric Dark Gradient for crisp text readability */}
              <div className={styles.stageOverlay} aria-hidden="true" />

              {/* Atmospheric Handwritten Script Overlay on the right */}
              <div className={styles.scriptOverlay} aria-hidden="true">
                <span>{active.quoteLines[0]}</span>
                <em>{active.quoteLines[1]}</em>
                <span>{active.quoteLines[2]}</span>
                <em>{active.quoteLines[3]}</em>
              </div>
            </div>

            {/* Stage Foreground Content Spread */}
            <div className={styles.stageContent}>
              
              {/* Top Bar: Descriptor Badge (Left) & Official Brand (Right) */}
              <div className={styles.stageTopBar}>
                <span className={styles.descriptorBadge}>{active.descriptor}</span>
                
                <div className={styles.stageBrandSign}>
                  <div className={styles.stageBrandEmblem}>
                    <Image
                      src="/images/logo/logo-mark.webp"
                      alt="Glamour Emporium"
                      width={22}
                      height={22}
                      className={styles.stageEmblemImg}
                    />
                  </div>
                  <div className={styles.stageBrandText}>
                    <span>GLAMOUR EMPORIUM</span>
                    <span>PANIPAT</span>
                  </div>
                </div>
              </div>

              {/* Middle Body: Category Title + Description + 5 Sub-Services */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeId}
                  className={styles.stageBody}
                  initial={{ opacity: 0, y: cinematic ? 6 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: cinematic ? -4 : 0, transition: { duration: reducedMotion ? 0 : 0.15 } }}
                  transition={{ duration: reducedMotion ? 0 : 0.35, ease }}
                >
                  {/* Category Hero Title with large translucent numeral */}
                  <div className={styles.stageHeroTitle}>
                    <span className={styles.stageBigNumber} aria-hidden="true">
                      {active.number}
                    </span>
                    <h3 className={styles.stageTitleText}>
                      <span>{stageTitle.line1}</span>
                      <span>{stageTitle.line2}</span>
                    </h3>
                  </div>

                  {/* Short Narrative Description */}
                  <p className={styles.stageDescription}>{active.shortDesc}</p>

                  {/* Sub-Services Rows (Compact with thin dividers) */}
                  <ul className={styles.stageServiceList}>
                    {active.services.map((item) => (
                      <li key={item.name} className={styles.stageServiceItem}>
                        <button
                          type="button"
                          onClick={() => openBooking({ category: active.title, service: item.name })}
                          className={styles.stageServiceBtn}
                          aria-label={`Book ${item.name}`}
                        >
                          <span>{item.name}</span>
                          <ArrowUpRight size={13} className={styles.serviceArrow} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Bar: Action Button + Advance Note (Left) & Category Pagination (Right) */}
              <div className={styles.stageBottomBar}>
                
                {/* Left: Book Button + Advance */}
                <div className={styles.stageActionGroup}>
                  <button
                    type="button"
                    onClick={() => openBooking({ category: active.title })}
                    className={styles.stageBookBtn}
                  >
                    <CalendarDays size={14} className={styles.bookCalIcon} aria-hidden="true" />
                    <span>BOOK A SLOT</span>
                    <ArrowUpRight size={14} className={styles.bookArrow} aria-hidden="true" />
                  </button>

                  <div className={styles.stageAdvanceNote}>
                    <span className={styles.advanceAmount}>₹{BOOKING_ADVANCE} adjustable advance</span>
                    <span className={styles.advanceHint}>(in final bill)</span>
                  </div>
                </div>

                {/* Right: Numbered Pagination 01  02  03 */}
                <div className={styles.stagePagination} role="tablist" aria-label="Service category tabs">
                  {servicesData.map((service) => {
                    const isTabActive = activeId === service.id;

                    return (
                      <button
                        key={service.id}
                        type="button"
                        role="tab"
                        aria-selected={isTabActive}
                        onClick={() => selectCategory(service.id)}
                        className={styles.pageTabBtn}
                        data-active={isTabActive}
                      >
                        <span>{service.number}</span>
                        {isTabActive && (
                          <motion.span
                            layoutId="stage-active-page-line"
                            className={styles.pageActiveLine}
                            transition={{ duration: reducedMotion ? 0 : 0.35, ease }}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* BOTTOM UTILITY STRIP (Thin Full-Width Row)                   */}
        {/* ============================================================ */}
        <div className={styles.utilityStrip}>
          
          {/* 1. WhatsApp Action */}
          <a
            href={customEnquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.utilityItemLink}
          >
            <WhatsAppIcon className={styles.whatsappGreenIcon} aria-hidden="true" />
            <span className={styles.utilityItemPrompt}>CAN&apos;T FIND YOUR SERVICE?</span>
            <span className={styles.utilityItemAction}>
              <span>ASK US ON WHATSAPP</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </a>

          <div className={styles.utilityDivider} aria-hidden="true" />

          {/* 2. Easy Booking */}
          <div className={styles.utilityItem}>
            <CalendarDays size={14} className={styles.utilityMutedIcon} aria-hidden="true" />
            <span className={styles.utilityLabel}>EASY BOOKING</span>
          </div>

          <div className={styles.utilityDivider} aria-hidden="true" />

          {/* 3. Premium Experience */}
          <div className={styles.utilityItem}>
            <Sparkles size={14} className={styles.utilityMutedIcon} aria-hidden="true" />
            <span className={styles.utilityLabel}>PREMIUM EXPERIENCE</span>
          </div>

          <div className={styles.utilityDivider} aria-hidden="true" />

          {/* 4. Unisex Salon */}
          <div className={styles.utilityItem}>
            <Heart size={14} className={styles.utilityMutedIcon} aria-hidden="true" />
            <span className={styles.utilityLabel}>UNISEX SALON</span>
          </div>

        </div>

      </div>
    </section>
  );
}
