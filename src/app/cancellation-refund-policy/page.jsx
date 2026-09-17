import PolicyShell from "@/components/layout/PolicyShell";
import { CheckCircle2, XCircle, AlertTriangle, CreditCard, RefreshCw, Calendar, Sparkles } from "lucide-react";

export const metadata = {
  title: {
    absolute: "Cancellation & Refund Policy | Glamour Emporium",
  },
  description:
    "Cancellation & Refund Policy for Glamour Emporium Unisex Salon in Panipat. Read clear terms regarding our ₹99 appointment advance, final bill adjustment, cancellation, and no-show rules.",
  alternates: {
    canonical: "/cancellation-refund-policy",
  },
};

export default function CancellationRefundPolicyPage() {
  return (
    <PolicyShell
      title="Cancellation & Refund Policy"
      description="Clear, transparent terms regarding your ₹99 online appointment advance payment, bill adjustment at the salon, cancellation rules, and no-show policies at Glamour Emporium."
      lastUpdated="September 2026"
    >
      <div className="space-y-12 sm:space-y-14">
        
        {/* Policy Summary Cards Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>CORE APPOINTMENT POLICY SUMMARY</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* 1. BOOKING ADVANCE */}
            <div className="p-6 bg-[#0c0b0a] border border-[#c9a87c]/40 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#c9a87c]/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a87c]">
                    STEP 01 • ADVANCE
                  </span>
                  <span className="px-2 py-0.5 bg-[#c9a87c]/20 text-[#c9a87c] text-[10px] font-mono font-bold">
                    ₹99 ONLY
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#f5f2eb] font-light mb-2">
                  BOOKING ADVANCE
                </h3>
                <p className="text-xs sm:text-sm text-[#eae6df]/85 leading-relaxed">
                  A <strong className="text-[#f5f2eb]">₹99 advance payment</strong> is required to confirm an online appointment at Glamour Emporium.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/50">
                Secures your chosen stylist &amp; time slot
              </div>
            </div>

            {/* 2. ADJUSTMENT */}
            <div className="p-6 bg-[#0c0b0a] border border-[#c9a87c]/40 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#c9a87c]/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a87c]">
                    STEP 02 • BILL CREDIT
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#c9a87c]" />
                </div>
                <h3 className="font-serif text-2xl text-[#f5f2eb] font-light mb-2">
                  BILL ADJUSTMENT
                </h3>
                <p className="text-xs sm:text-sm text-[#eae6df]/85 leading-relaxed">
                  The ₹99 advance is <strong className="text-[#f5f2eb]">adjusted against the customer&rsquo;s final salon bill</strong> when they attend their scheduled appointment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-[#c9a87c]/90">
                100% credited at salon checkout
              </div>
            </div>

            {/* 3. NON-REFUNDABLE */}
            <div className="p-6 bg-[#0c0b0a] border border-white/15 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-300/80">
                    IMPORTANT CONDITION
                  </span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="font-serif text-2xl text-[#f5f2eb] font-light mb-2">
                  NON-REFUNDABLE
                </h3>
                <p className="text-xs sm:text-sm text-[#eae6df]/85 leading-relaxed">
                  The ₹99 booking advance is <strong className="text-[#f5f2eb]">non-refundable</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/50">
                Standard salon reservation policy
              </div>
            </div>

            {/* 4. CANCELLATION */}
            <div className="p-6 bg-[#0c0b0a] border border-white/15 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-300/80">
                    CANCELLATION
                  </span>
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="font-serif text-2xl text-[#f5f2eb] font-light mb-2">
                  CANCELLATION
                </h3>
                <p className="text-xs sm:text-sm text-[#eae6df]/85 leading-relaxed">
                  If the customer cancels the appointment, the <strong className="text-[#f5f2eb]">₹99 advance will not be refunded</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/50">
                Applicable to all online cancellations
              </div>
            </div>

            {/* 5. NO-SHOW (Full width card) */}
            <div className="p-6 bg-[#0c0b0a] border border-white/15 relative overflow-hidden md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-red-300/80 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>NO-SHOW POLICY</span>
                </div>
                <h3 className="font-serif text-2xl text-[#f5f2eb] font-light mb-1">
                  NO-SHOW
                </h3>
                <p className="text-xs sm:text-sm text-[#eae6df]/85 leading-relaxed max-w-2xl">
                  If the customer does not attend the scheduled appointment, the <strong className="text-[#f5f2eb]">₹99 advance will not be refunded</strong>.
                </p>
              </div>
              <div className="shrink-0 font-mono text-[11px] text-white/50 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-6">
                Protects reserved stylist time
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Detailed Policy Terms */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>DETAILED POLICY SPECIFICATIONS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            How the Policy Operates
          </h2>
          
          <div className="space-y-4 text-xs sm:text-sm text-[#eae6df]/85">
            <p>
              At <strong className="text-[#f5f2eb]">Glamour Emporium Unisex Salon</strong> (Panipat, Haryana), our goal is to deliver an exceptional, unhurried salon experience. Because our stylists and therapists dedicate dedicated time blocks for each reservation, the ₹99 booking advance ensures committed appointment attendance.
            </p>

            <div className="p-5 bg-white/[0.02] border border-white/10 space-y-2">
              <h4 className="font-serif text-base text-[#f5f2eb] font-normal">
                Example of Final Bill Settlement
              </h4>
              <p className="text-xs text-[#eae6df]/80 leading-relaxed">
                If you book a Haircut &amp; Styling service and pay the ₹99 advance online, and your total bill at the salon counter comes to ₹500, your ₹99 advance is deducted immediately. You will only pay the remaining balance of <strong className="text-[#c9a87c]">₹401</strong> at the salon.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Rescheduling & Support */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>SCHEDULING ASSISTANCE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Running Late or Need to Reschedule?
          </h2>
          <p>
            We understand that unforeseen schedule changes happen. If you anticipate being late or cannot make your scheduled time slot, please contact our salon reception directly via phone or WhatsApp at <strong className="text-[#c9a87c] font-mono">+91 74950 68282</strong> as early as possible.
          </p>
          <p className="text-xs text-[#eae6df]/75">
            Our salon desk will do their best to adjust your timing within the same operational day subject to available stylist slots.
          </p>
        </section>

        {/* Section 4: Technical & Payment Gateway Failures */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>PAYMENT DISPUTES &amp; DEDUCTIONS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Payment Deductions on Failed Bookings
          </h2>
          <p>
            In rare cases where ₹99 is debited from your bank account, card, or UPI app, but our website fails to issue a Booking Confirmation Code due to an internet drop or banking gateway timeout:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#eae6df]/85">
            <li>The debited amount is securely held by the payment gateway/banking system.</li>
            <li>Such failed transactions are automatically reconciled and reversed to your original payment source within 3–7 business days per RBI guidelines.</li>
            <li>You may also WhatsApp our team with your transaction reference or screenshot at <strong className="text-[#c9a87c] font-mono">+91 74950 68282</strong> for instant manual verification.</li>
          </ul>
        </section>

        {/* Section 5: Legal Business Information */}
        <section className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#c9a87c]">
            <span>05. LEGAL BUSINESS INFORMATION</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-normal tracking-tight">
            Operating Entity &amp; Billing Authority
          </h2>
          <p className="text-xs sm:text-sm text-[#eae6df]/85">
            Appointment reservations, ₹99 advance adjustments, and billing receipts are issued under the following registered entity:
          </p>

          <div className="p-5 sm:p-6 bg-white/[0.02] border border-white/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">Legal Business Name</span>
                <span className="text-[#f5f2eb] font-semibold text-sm">SS Enterprises</span>
              </div>
              <div className="space-y-1">
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">Operating Brand</span>
                <span className="text-[#f5f2eb] font-semibold text-sm">Glamour Emporium Unisex Salon</span>
              </div>
              <div className="space-y-1">
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">Proprietor</span>
                <span className="text-[#f5f2eb] text-sm">Salma Saifi</span>
              </div>
              <div className="space-y-1">
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">GSTIN</span>
                <span className="text-[#c9a87c] font-semibold text-sm tracking-wider">06OXPPS0718P1ZD</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs text-[#eae6df]/80 font-sans">
              <p className="leading-relaxed">
                <strong className="text-[#f5f2eb]">Glamour Emporium Unisex Salon is operated by SS Enterprises.</strong>
              </p>
            </div>
          </div>
        </section>

      </div>
    </PolicyShell>
  );
}
