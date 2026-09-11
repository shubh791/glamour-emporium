"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import styles from "./ServicesExperimental.module.css";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useBooking } from "@/context/BookingContext";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const servicesData = [
  {
    id: "01",
    number: "01",
    title: "HAIR & STYLING",
    descriptor: "WOMEN & MEN",
    shortDesc:
      "From everyday haircuts and styling to colour and hair care, choose a service that suits your look, occasion and preferences.",
    ctaLabel: "ENQUIRE ABOUT HAIR & STYLING",
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
      position: "50% 30%",
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
      position: "50% 30%",
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
      position: "50% 35%",
      label: "03 / BEAUTY & CARE",
    },
    whatsappMessage:
      "Hello Glamour Emporium,\n\nI would like to enquire about Beauty & Care.\n\nPlease share the available options and appointment availability.\n\nThank you.",
  },
];

const customEnquiryMessage =
  "Hello Glamour Emporium,\n\nI have a custom service enquiry.\n\nI'm looking for: [describe your requirement]\n\nPlease help me with the available options.\n\nThank you.";

const customEnquiryUrl = `https://wa.me/917495068282?text=${encodeURIComponent(customEnquiryMessage)}`;

const editorialEase = [0.22, 1, 0.36, 1];

// These data and enquiry messages are intentionally copied from the approved
// Services.jsx. Keep the fallback file unchanged throughout this experiment.
function getServiceItemUrl(serviceName) {
  const msg = `Hello Glamour Emporium,\n\nI would like to enquire about ${serviceName}.\n\nPlease share the available options and appointment availability.\n\nThank you.`;
  return `https://wa.me/917495068282?text=${encodeURIComponent(msg)}`;
}

function ServicePortrait({ service, reducedMotion, mobile = false }) {
  return (
    <figure className={mobile ? styles.mobilePortrait : styles.portrait}>
      <div className={styles.imageFrame}>
        {/* Keep the incoming and outgoing images overlapped during the dissolve. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={service.id}
            className={styles.imageLayer}
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.48, ease: editorialEase }}
          >
            <Image
              src={service.image.src}
              alt={service.image.alt}
              fill
              sizes={mobile ? "(max-width: 767px) 92vw, 700px" : "(min-width: 1280px) 480px, 42vw"}
              className={styles.image}
              style={{ objectPosition: service.image.position }}
            />
          </motion.div>
        </AnimatePresence>
        <div className={styles.imageShade} aria-hidden="true" />
        <span className={styles.imageDescriptor}>{service.descriptor}</span>
        <div className={styles.imageSignature}>
          <Image src="/images/logo/logo-mark.webp" alt="" width={20} height={20} />
          <span>GLAMOUR EMPORIUM</span>
        </div>
        <div className={styles.imageCaption} aria-hidden="true">
          <span className={styles.imageNumber}>{service.number}</span>
          <span>{service.title}</span>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>PANIPAT, HARYANA</span>
        <span>UNISEX SALON</span>
      </figcaption>
    </figure>
  );
}

export default function ServicesExperimental() {
  const { openBooking } = useBooking();
  const [activeServiceId, setActiveServiceId] = useState("01");
  const [lastViewedServiceId, setLastViewedServiceId] = useState("01");
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.36;
  const displayedService = servicesData.find(
    (service) => service.id === (activeServiceId || lastViewedServiceId)
  ) || servicesData[0];

  function handleServiceToggle(serviceId) {
    setActiveServiceId(activeServiceId === serviceId ? null : serviceId);
    setLastViewedServiceId(serviceId);
  }

  const entrance = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: [0.65, 1], y: prefersReducedMotion ? 0 : [12, 0] },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: prefersReducedMotion ? 0 : 0.55, ease: editorialEase },
  };

  return (
    <section id="services" aria-labelledby="services-heading" className={styles.section}>
      <div className={styles.container}>
        <motion.header className={styles.intro} {...entrance}>
          <div>
            <span className={styles.eyebrow}>WHAT WE DO</span>
            <h2 id="services-heading" className={styles.heading}>
              CRAFTED<br /><em>AROUND YOU.</em>
            </h2>
          </div>
          <p className={styles.introCopy}>
            Explore hair, beauty and grooming services for men and women at our unisex salon on Jattal Road, Panipat.
          </p>
        </motion.header>

        <motion.div className={styles.spread} {...entrance}>
          <div className={styles.categories}>
            {servicesData.map((service) => {
              const isActive = service.id === activeServiceId;
              const triggerId = `experimental-service-trigger-${service.id}`;
              const panelId = `experimental-service-panel-${service.id}`;

              return (
                <article key={service.id} className={styles.category} data-active={isActive}>
                  <h3>
                    <button
                      id={triggerId}
                      type="button"
                      onClick={() => handleServiceToggle(service.id)}
                      className={styles.categoryTrigger}
                      aria-expanded={isActive}
                      aria-controls={panelId}
                    >
                      <span className={styles.number}>{service.number}</span>
                      <span className={styles.categoryName}>{service.title}</span>
                      <ArrowUpRight className={styles.categoryArrow} size={21} aria-hidden="true" />
                    </button>
                  </h3>
                  {/* Persistent panel IDs; closed content cannot receive focus,
                      including while its visual exit animation is running. */}
                  <div id={panelId} role="region" aria-labelledby={triggerId} aria-hidden={!isActive} inert={!isActive}>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key={service.id}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration, ease: editorialEase }}
                          className={styles.panelClip}
                        >
                          <motion.div
                            className={styles.details}
                            initial={{ y: prefersReducedMotion ? 0 : 7 }}
                            animate={{ y: 0 }}
                            transition={{ duration, ease: editorialEase }}
                          >
                            <div className={styles.currentLabel}>
                              <span>CURRENT SERVICE</span>
                              <span className={styles.currentRule} aria-hidden="true" />
                              <span>{service.descriptor}</span>
                            </div>
                            <p className={styles.description}>{service.shortDesc}</p>
                            <div className={styles.catalogue}>
                              <span className={styles.eyebrow}>SERVICES IN THIS CATEGORY</span>
                              <ul className={styles.serviceList}>
                                {service.services.map((item, index) => (
                                  <motion.li
                                    key={item.name}
                                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: prefersReducedMotion ? 0 : 0.24,
                                      delay: prefersReducedMotion ? 0 : index * 0.025,
                                      ease: editorialEase,
                                    }}
                                  >
                                    <a href={getServiceItemUrl(item.name)} target="_blank" rel="noopener noreferrer" title={`Enquire about ${item.name}`}>
                                      <span>{item.name}</span>
                                      <ArrowUpRight size={14} aria-hidden="true" />
                                    </a>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            <ServicePortrait service={service} reducedMotion={prefersReducedMotion} mobile />
                            <div className={styles.bookingAction}>
                              <button type="button" className={styles.bookButton} onClick={() => openBooking(service.title)}>
                                <CalendarDays size={15} aria-hidden="true" />
                                <span>BOOK A SLOT</span>
                                <ArrowUpRight size={17} aria-hidden="true" />
                              </button>
                              <p className={styles.advance}>Reserve with ₹99 adjustable advance</p>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.visual}>
            <div className={styles.visualMasthead}>
              <span className={styles.eyebrow}>CURRENT SERVICE</span>
              <span className={styles.pageIndex}>{displayedService.number} <span>/ 03</span></span>
            </div>
            <ServicePortrait service={displayedService} reducedMotion={prefersReducedMotion} />
            <div className={styles.visualProgress} aria-hidden="true">
              {servicesData.map((service) => (
                <span key={service.id} data-current={service.id === displayedService.id} />
              ))}
            </div>
          </div>
        </motion.div>

        <div className={styles.customEnquiry}>
          <div>
            <span className={styles.eyebrow}>CAN&apos;T FIND WHAT YOU&apos;RE LOOKING FOR?</span>
            <p>Need something specific? Tell us what you have in mind and our team will assist you.</p>
          </div>
          <a href={customEnquiryUrl} target="_blank" rel="noopener noreferrer" className={styles.enquiryLink}>
            <WhatsAppIcon className={styles.whatsappIcon} />
            <span>ASK ON WHATSAPP</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
