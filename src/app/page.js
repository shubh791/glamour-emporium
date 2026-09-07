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
 * Acts as a clean composition layer for sections and layout elements.
 */
export default function HomePage() {
  return (
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
    </div>
  );
}
