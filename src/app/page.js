"use client";

import { BookingProvider } from "@/context/BookingContext";
import BookingModal from "@/components/booking/BookingModal";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Showcase from "@/components/sections/Showcase";
import BookingCTA from "@/components/sections/BookingCTA";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

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
          <Hero />
          <Services />
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
