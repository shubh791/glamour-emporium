"use client";

import { BookingProvider } from "@/context/BookingContext";
import BookingModal from "@/components/booking/BookingModal";
import Navbar from "@/components/layout/Navbar";
import PromoAnnouncementStrip from "@/components/ui/PromoAnnouncementStrip";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import ServicesExperimental from "@/components/sections/ServicesExperimental";
import ServicesExperimentalV3 from "@/components/sections/ServicesExperimentalV3";
import Experience from "@/components/sections/Experience";
import Showcase from "@/components/sections/Showcase";
import BookingCTA from "@/components/sections/BookingCTA";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Preview: "original" | "v1" | "v2" | "v3". Change only this value to switch.
const SERVICES_VARIANT = "v3";
const SERVICE_VARIANTS = {
  original: Services,
  v1: ServicesExperimental,
  // No separate V2 exists in this checkout; retain the preserved experiment.
  v2: ServicesExperimental,
  v3: ServicesExperimentalV3,
};
const SelectedServices = SERVICE_VARIANTS[SERVICES_VARIANT] || Services;

/**
 * Main Page Entrypoint
 * Acts as a clean composition layer for sections, booking modal, and layout elements.
 */
export default function HomePage() {
  return (
    <BookingProvider>
      <div className="site-shell">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Main Content Sections */}
        <main id="main-content" tabIndex={-1}>
          <PromoAnnouncementStrip />
          <Hero />
          <SelectedServices />
          <Experience />
          <Showcase />
          <BookingCTA />
          <Contact />
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
