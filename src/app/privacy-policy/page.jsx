import PolicyShell from "@/components/layout/PolicyShell";
import { ShieldCheck, Lock, CreditCard, Bell, Database, UserCheck, HelpCircle } from "lucide-react";

export const metadata = {
  title: {
    absolute: "Privacy Policy | Glamour Emporium",
  },
  description:
    "Privacy Policy for Glamour Emporium Unisex Salon in Panipat. Learn how we collect, use, and protect your contact and appointment details, and our secure third-party payment processing terms.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell
      title="Privacy Policy"
      description="This Privacy Policy outlines how Glamour Emporium Unisex Salon collects, uses, protects, and handles your personal information when you visit our website, schedule appointments, or communicate with our salon."
      lastUpdated="September 2026"
    >
      <div className="space-y-12 sm:space-y-14">
        
        {/* Section 1: Overview & Scope */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>01. INTRODUCTION &amp; SCOPE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Commitment to Your Privacy
          </h2>
          <p>
            Welcome to <strong className="text-[#f5f2eb]">Glamour Emporium Unisex Salon</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Salon&rdquo;), located at Jattal Road, Near Choudhary Hospital, Panipat, Haryana - 132103. We are committed to protecting your personal information and respecting your privacy rights.
          </p>
          <p>
            This Privacy Policy applies to personal information gathered through our official website (<a href="https://glamouremporium.com" className="text-[#c9a87c] underline underline-offset-4">glamouremporium.com</a>), online appointment booking interfaces, WhatsApp concierge communication, telephone inquiries, and direct salon visits.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>02. INFORMATION WE COLLECT</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Data Collected During Booking &amp; Inquiries
          </h2>
          <p>
            We collect only the minimum necessary information required to facilitate salon services, confirm appointment reservations, and deliver high-quality personal care:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-5 bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#c9a87c] font-semibold text-xs uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                <span>Customer Contact Details</span>
              </div>
              <p className="text-xs text-[#eae6df]/80 leading-relaxed">
                Full name, mobile telephone number, and optional email address provided during the appointment booking flow or contact form.
              </p>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#c9a87c] font-semibold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Appointment Preferences</span>
              </div>
              <p className="text-xs text-[#eae6df]/80 leading-relaxed">
                Selected salon service category (Hair &amp; Styling, Men&rsquo;s Grooming, Beauty &amp; Care), preferred appointment date and time slot, and special requests or notes.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#eae6df]/70 pt-2">
            Technical usage data (such as browser type, IP address, and standard log data) may be recorded automatically to maintain website stability, performance, and security.
          </p>
        </section>

        {/* Section 3: How We Use Your Information */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>03. PURPOSE &amp; USAGE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            How Your Information Is Used
          </h2>
          <p>
            Your personal information is utilized strictly for lawful salon management and customer service purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#eae6df]/85">
            <li>
              <strong className="text-[#f5f2eb]">Appointment Scheduling:</strong> Generating booking codes, reserving requested stylist time slots, and managing daily salon capacity.
            </li>
            <li>
              <strong className="text-[#f5f2eb]">Customer Communication:</strong> Dispatching appointment confirmations, booking status updates, slot reminders, and rescheduling notices via SMS, WhatsApp, or phone.
            </li>
            <li>
              <strong className="text-[#f5f2eb]">Service Preparation:</strong> Enabling our stylists and beauty specialists to review your requested treatment and preferences prior to your arrival.
            </li>
            <li>
              <strong className="text-[#f5f2eb]">Support &amp; Feedback:</strong> Responding to client inquiries, feedback, and customer support requests.
            </li>
          </ul>
        </section>

        {/* Section 4: Third-Party Payment Processing & Gateway Security */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>04. PAYMENT PROCESSING &amp; FINANCIAL SECURITY</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Secure Payment Gateway Terms
          </h2>
          <p>
            To confirm online appointment slots, an appointment booking advance of <strong className="text-[#f5f2eb]">₹99</strong> is required. All online transactions are routed through authorized, RBI-compliant third-party payment gateway providers (including Cashfree Payments).
          </p>

          <div className="p-5 sm:p-6 bg-[#c9a87c]/10 border border-[#c9a87c]/40 relative">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-[#c9a87c] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-[#f5f2eb] font-normal">
                  Strict Payment Credentials Privacy
                </h3>
                <p className="text-xs sm:text-sm text-[#eae6df]/90 leading-relaxed">
                  <strong className="text-[#f5f2eb]">Glamour Emporium does NOT collect, store, or have access to</strong> your credit/debit card numbers, CVV codes, card expiration dates, net banking passwords, UPI PINs, or sensitive financial credentials. All payment processing occurs entirely within the encrypted, PCI-DSS compliant infrastructure of our payment gateway partners.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#eae6df]/70">
            We retain only transactional metadata (such as Payment Gateway Order ID, Payment ID, transaction timestamp, payment status, and booked amount) to verify and credit your appointment advance against your final salon bill.
          </p>
        </section>

        {/* Section 5: Data Sharing & Third-Party Service Providers */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>05. DATA DISCLOSURE &amp; THIRD PARTIES</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            We Never Sell Your Data
          </h2>
          <p>
            Glamour Emporium maintains a strict zero-spam policy. <strong className="text-[#f5f2eb]">We do not sell, rent, trade, or monetize your personal details to any third-party marketing companies.</strong>
          </p>
          <p>
            We share information solely with verified operational partners who assist in operating our website and delivering services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#eae6df]/85">
            <li>Authorized payment gateway processors (e.g., Cashfree Payments) for completing the ₹99 booking advance.</li>
            <li>Cloud database and hosting service providers hosting our website infrastructure.</li>
            <li>Transactional communication service providers (SMS, WhatsApp Business API) for booking notifications.</li>
            <li>Law enforcement or regulatory authorities only when strictly required by applicable Indian law.</li>
          </ul>
        </section>

        {/* Section 6: Data Retention & Security */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>06. DATA RETENTION &amp; SECURITY</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Security Measures &amp; Retention
          </h2>
          <p>
            We implement industry-standard organizational and technical safeguards to prevent unauthorized access, disclosure, alteration, or destruction of your personal data. Web traffic is secured with HTTPS (TLS/SSL encryption).
          </p>
          <p>
            Booking records and transaction logs are retained for the duration necessary to satisfy salon scheduling, accounting, tax compliance, and customer service requirements under applicable Indian laws.
          </p>
        </section>

        {/* Section 7: Customer Rights & Contact */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>07. CUSTOMER RIGHTS &amp; INQUIRIES</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Your Rights &amp; Policy Updates
          </h2>
          <p>
            You have the right to inquire about your stored appointment details, request corrections to inaccurate contact numbers, or request deletion of historical records by contacting our salon directly.
          </p>
          <p>
            We may periodically update this Privacy Policy to reflect operational or regulatory improvements. Any revisions will be published directly on this page with an updated &ldquo;Last Updated&rdquo; date.
          </p>
        </section>

      </div>
    </PolicyShell>
  );
}
