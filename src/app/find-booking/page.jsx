"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Search,
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  Receipt,
  CalendarCheck,
} from "lucide-react";
import { sanitizePhone, isValidPhone, formatDisplayDate, BOOKING_ADVANCE } from "@/data/bookingConfig";
import { siteData } from "@/data/siteData";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function FindBookingPage() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(raw);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanPhone = sanitizePhone(phone);

    if (!cleanPhone) {
      setError("Mobile number is required.");
      return;
    }

    if (cleanPhone.length < 10) {
      const remaining = 10 - cleanPhone.length;
      setError(`Enter the remaining ${remaining} digit${remaining > 1 ? "s" : ""}.`);
      return;
    }

    if (!isValidPhone(cleanPhone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsLoading(true);
    setHasSearched(false);
    setBookings([]);

    try {
      const res = await fetch("/api/bookings/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to look up bookings. Please check your connection and try again.");
        setIsLoading(false);
        return;
      }

      setSearchedPhone(cleanPhone);
      setHasSearched(true);
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      console.error("Lookup network error:", err);
      setError("Network connection issue. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppInquiry = (booking) => {
    const msg = `Hello Glamour Emporium, I am inquiring regarding my appointment ${booking.bookingCode} for ${booking.service || booking.serviceCategory} scheduled on ${booking.bookingDate} at ${booking.bookingTime}.`;
    window.open(`https://wa.me/917495068282?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[#0c0b0a] text-[#f5f2eb] flex flex-col justify-between selection:bg-[#c9a87c] selection:text-[#0c0b0a]">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#090909]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 sm:py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] font-mono text-[#eae6df] hover:text-[#c9a87c] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#c9a87c]" />
            <span>Back to Salon</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#c9a87c]/60 shrink-0">
              <Image
                src="/images/logo/logo-mark.webp"
                alt="Glamour Emporium Emblem"
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <span className="font-serif text-sm tracking-wider uppercase text-[#f5f2eb]">
              GLAMOUR EMPORIUM
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-14 flex flex-col justify-start">
        
        {/* Page Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c9a87c]/10 border border-[#c9a87c]/30 text-[#c9a87c] text-[10px] font-mono tracking-[0.2em] uppercase rounded-full mb-3">
            <Sparkles className="w-3 h-3" />
            <span>APPOINTMENT HISTORY</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f5f2eb] font-light tracking-tight">
            Find Your Bookings &amp; Receipts
          </h1>
          <p className="text-xs sm:text-sm text-[#eae6df]/70 max-w-md mx-auto mt-2 font-sans leading-relaxed">
            Enter your 10-digit mobile number to view your appointment history and download official advance payment receipts.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="bg-[#121110] border border-[#c9a87c]/30 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* Phone Input */}
            <div>
              <label
                htmlFor="lookup-phone"
                className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#eae6df]/85 mb-1.5"
              >
                Registered Mobile Number <span className="text-[#c9a87c]">*</span>
              </label>
              <div className="flex border border-white/15 focus-within:border-[#c9a87c] transition-colors bg-[#0c0b0a]">
                <div className="flex items-center gap-1.5 px-3.5 bg-white/[0.04] border-r border-white/10 text-xs font-mono text-[#c9a87c] select-none shrink-0">
                  <Phone className="w-3.5 h-3.5 text-[#c9a87c]" />
                  <span>+91</span>
                </div>
                <input
                  id="lookup-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit mobile number"
                  className="w-full bg-transparent text-[#f5f2eb] placeholder:text-[#eae6df]/30 font-mono text-sm px-3.5 py-2.5 focus:outline-none min-h-[46px]"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-[#2d110f] border border-[#df9b8a]/40 text-[#df9b8a] text-xs font-mono leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#f5f2eb] hover:bg-[#c9a87c] text-[#0c0b0a] font-bold text-xs font-mono uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[46px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0c0b0a]" />
                  <span>SEARCHING APPOINTMENTS...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-[#0c0b0a]" />
                  <span>FIND MY BOOKINGS</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-4">
            
            {/* Header info */}
            <div className="flex items-center justify-between px-1 text-xs font-mono text-white/50 border-b border-white/10 pb-2">
              <span>Mobile: +91 {searchedPhone}</span>
              <span>{bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"} Found</span>
            </div>

            {/* Empty State */}
            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-[#121110] border border-white/10 space-y-3">
                <CalendarCheck className="w-8 h-8 text-[#c9a87c]/60 mx-auto" />
                <p className="font-serif text-lg text-[#f5f2eb]">No bookings found</p>
                <p className="text-xs text-white/60 font-sans max-w-sm mx-auto">
                  No bookings were found for this mobile number. Please double-check the 10-digit number used during reservation.
                </p>
                <div className="pt-2">
                  <Link
                    href="/#services"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c9a87c] text-[#0c0b0a] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#dfbe93] transition-colors"
                  >
                    <span>BOOK AN APPOINTMENT</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Booking Cards List (Newest first) */
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.bookingCode}
                    className="bg-[#121110] border border-[#c9a87c]/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] space-y-4"
                  >
                    {/* Top Status Bar */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#c9a87c] tracking-widest block">
                          BOOKING REFERENCE
                        </span>
                        <span className="font-mono text-base font-bold text-[#f5f2eb]">
                          {b.bookingCode}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1 ${
                        b.isConfirmed
                          ? "bg-[#114b2d] text-[#e5fbe8]"
                          : "bg-white/10 text-white/70"
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{b.isConfirmed ? "CONFIRMED & PAID" : b.bookingStatus}</span>
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#0c0b0a] p-3.5 border border-white/5">
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase tracking-wider">Customer</span>
                        <span className="text-[#f5f2eb] font-sans font-medium text-sm">{b.customerName}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase tracking-wider">Advance Paid</span>
                        <span className="text-[#c9a87c] font-bold">₹{b.amount != null ? b.amount : BOOKING_ADVANCE} INR</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase tracking-wider">Service</span>
                        <span className="text-[#eae6df] font-sans font-medium">
                          {b.service || b.serviceCategory}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase tracking-wider">Appointment</span>
                        <span className="text-[#f5f2eb]">
                          {formatDisplayDate(b.bookingDate) || b.bookingDate}, {b.bookingTime}
                        </span>
                      </div>
                      <div className="col-span-2 text-[10.5px] text-white/40 pt-1 border-t border-white/5 flex justify-between">
                        <span>Booked on: {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        {b.maskedRazorpayPaymentId && <span>Ref: {b.maskedRazorpayPaymentId}</span>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      {b.isConfirmed && (
                        <a
                          href={`/api/bookings/${b.bookingCode}/receipt?phone=${encodeURIComponent(searchedPhone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 bg-[#c9a87c] hover:bg-[#dfbe93] text-[#0c0b0a] font-bold text-xs font-mono uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>DOWNLOAD RECEIPT</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleWhatsAppInquiry(b)}
                        className="py-2.5 px-3 border border-white/20 hover:border-[#c9a87c] text-[#f5f2eb] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" color="#25D366" />
                        <span>WHATSAPP SALON</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Footer Notice */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-[11px] font-mono text-white/40">
        <p>{siteData.business.name} • {siteData.business.address.fullAddress}</p>
        <p className="mt-1">For assistance, call or WhatsApp {siteData.business.contact.phoneDisplay}</p>
      </footer>
    </main>
  );
}
