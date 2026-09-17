import Link from "next/link";
import PolicyShell from "@/components/layout/PolicyShell";
import { AlertCircle, CheckCircle, Clock, ShieldAlert, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: {
    absolute: "Terms & Conditions | Glamour Emporium",
  },
  description:
    "Terms & Conditions for Glamour Emporium Unisex Salon in Panipat. Review rules for website usage, service bookings, our ₹99 non-refundable appointment advance, and salon policies.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyShell
      title="Terms & Conditions"
      description="These Terms & Conditions govern your access to the Glamour Emporium website, online appointment booking services, and the provision of salon treatments at our Panipat salon."
      lastUpdated="September 2026"
    >
      <div className="space-y-12 sm:space-y-14">
        
        {/* Section 1: Acceptance */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>01. ACCEPTANCE OF TERMS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Agreement Between You and Glamour Emporium
          </h2>
          <p>
            By accessing or using the website of <strong className="text-[#f5f2eb]">Glamour Emporium Unisex Salon</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Salon&rdquo;), initiating an appointment booking, or visiting our salon premises at Jattal Road, Near Choudhary Hospital, Panipat, Haryana - 132103, you agree to be bound by these Terms &amp; Conditions.
          </p>
          <p>
            If you do not agree to these Terms, please refrain from using our online booking platform.
          </p>
        </section>

        {/* Section 2: Salon Services & Schedule */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>02. SALON SERVICES &amp; SCHEDULE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Service Availability &amp; Weekly Off
          </h2>
          <p>
            Glamour Emporium provides unisex hair styling, men&rsquo;s grooming, beauty, and skin care rituals.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#eae6df]/85">
            <li>
              <strong className="text-[#f5f2eb]">Weekly Off (Tuesday):</strong> The salon remains <strong className="text-[#f5f2eb]">closed every Tuesday</strong>. Online booking slots are unavailable for Tuesdays.
            </li>
            <li>
              <strong className="text-[#f5f2eb]">Operating Hours:</strong> Standard salon appointments operate between 10:00 AM and 8:30 PM (Wednesday to Monday).
            </li>
            <li>
              <strong className="text-[#f5f2eb]">Stylist Availability:</strong> Specific stylists and treatment durations are subject to real-time salon schedule and prior confirmed bookings.
            </li>
          </ul>
        </section>

        {/* Section 3: Online Booking & ₹99 Advance Policy */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>03. ONLINE BOOKING &amp; APPOINTMENT ADVANCE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            ₹99 Booking Advance Terms
          </h2>
          <p>
            To eliminate unverified bookings and ensure committed slot availability for our patrons, online appointments require an advance payment:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-5 bg-[#c9a87c]/10 border border-[#c9a87c]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#c9a87c] font-semibold text-xs uppercase tracking-wider font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>₹99 Advance Required</span>
              </div>
              <p className="text-xs text-[#eae6df]/90 leading-relaxed">
                A booking advance of <strong className="text-[#f5f2eb]">₹99</strong> is required to confirm any online appointment reservation.
              </p>
            </div>

            <div className="p-5 bg-[#c9a87c]/10 border border-[#c9a87c]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#c9a87c] font-semibold text-xs uppercase tracking-wider font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>Adjusted on Final Bill</span>
              </div>
              <p className="text-xs text-[#eae6df]/90 leading-relaxed">
                The ₹99 advance is <strong className="text-[#f5f2eb]">fully adjusted against your final salon bill</strong> when you attend your scheduled appointment.
              </p>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-red-400/90 font-semibold text-xs uppercase tracking-wider font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>Strictly Non-Refundable</span>
              </div>
              <p className="text-xs text-[#eae6df]/80 leading-relaxed">
                The ₹99 appointment advance is <strong className="text-[#f5f2eb]">strictly non-refundable</strong> under any circumstances.
              </p>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-red-400/90 font-semibold text-xs uppercase tracking-wider font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>Cancellation &amp; No-Show</span>
              </div>
              <p className="text-xs text-[#eae6df]/80 leading-relaxed">
                If the customer cancels the appointment or fails to attend (no-show), the ₹99 advance <strong className="text-[#f5f2eb]">will not be refunded</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/10 mt-3 flex items-center justify-between gap-4">
            <span className="text-xs text-[#eae6df]/80">
              For complete details, please review our dedicated policy document.
            </span>
            <Link
              href="/cancellation-refund-policy"
              className="inline-flex items-center gap-1 text-xs font-mono uppercase text-[#c9a87c] hover:underline shrink-0"
            >
              <span>Cancellation &amp; Refund Policy</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Section 4: Pricing & Final Billing */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>04. SERVICE PRICING &amp; SETTLEMENT</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Pricing, Consultation &amp; Billing
          </h2>
          <p>
            Salon treatment pricing is determined by specific service selection, product formulation, hair length/density, or bespoke styling requirements discussed during initial consultation at the salon.
          </p>
          <p>
            At the conclusion of your salon service, the ₹99 advance paid online will be credited directly against your total bill, and the balance amount is payable via cash, UPI, or card at the salon reception desk.
          </p>
        </section>

        {/* Section 5: Customer Responsibilities */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>05. CUSTOMER RESPONSIBILITIES</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Punctuality, Health &amp; Safety Disclosures
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#eae6df]/85">
            <li>
              <strong className="text-[#f5f2eb]">Punctuality:</strong> Clients are requested to arrive 5–10 minutes before their booked time slot. Late arrivals exceeding 15 minutes may result in shortened treatment duration or slot rescheduling.
            </li>
            <li>
              <strong className="text-[#f5f2eb]">Health &amp; Allergies:</strong> Clients must inform our stylists or skin specialists prior to service of any known chemical allergies, skin sensitivities, scalp conditions, or medical considerations.
            </li>
            <li>
              <strong className="text-[#f5f2eb]">Accurate Contact Information:</strong> You agree to provide a valid, reachable mobile number for appointment confirmation and SMS/WhatsApp communications.
            </li>
          </ul>
        </section>

        {/* Section 6: Payment Processing via Razorpay */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>06. PAYMENT GATEWAY INTEGRATION</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Third-Party Payment Infrastructure
          </h2>
          <p>
            All online payments on this website are facilitated through authorized third-party payment gateway partner <strong className="text-[#f5f2eb]">Razorpay</strong> (Razorpay Software Private Limited). By completing a transaction, you agree to abide by the applicable terms and policies of the payment gateway.
          </p>
          <p className="text-xs text-[#eae6df]/75">
            Glamour Emporium is not responsible for transaction failures resulting from incorrect card/UPI information, insufficient bank funds, or banking network downtime.
          </p>
        </section>

        {/* Section 7: Limitation of Liability & Governing Law */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>07. LIMITATION OF LIABILITY &amp; JURISDICTION</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Governing Law &amp; Dispute Resolution
          </h2>
          <p>
            To the maximum extent permitted by applicable Indian law, Glamour Emporium Unisex Salon shall not be liable for any indirect, incidental, or consequential damages resulting from website unavailability, scheduling delays, or technical errors.
          </p>
          <p>
            These Terms &amp; Conditions are governed by the laws of India. Any disputes arising out of or in connection with these terms or salon services shall be subject to the exclusive jurisdiction of the competent courts in <strong className="text-[#f5f2eb]">Panipat, Haryana</strong>.
          </p>
        </section>

      </div>
    </PolicyShell>
  );
}
