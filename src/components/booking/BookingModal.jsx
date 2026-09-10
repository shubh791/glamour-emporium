"use client";

import { useState, useEffect, useId, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarDays,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Phone,
  User,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import {
  BOOKING_ADVANCE,
  BOOKING_SERVICES,
  BOOKING_SLOTS,
  DEMO_UNAVAILABLE_SLOTS,
  ONLINE_BOOKING_OFFER,
  PAYMENT_STATUS,
  isTuesday,
  isPastDate,
  formatDisplayDate,
  processBookingAdvancePayment,
  buildCustomerConfirmationWhatsAppUrl,
} from "@/data/bookingConfig";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function BookingModal() {
  const { isOpen, selectedService: prefilledService, closeBooking } = useBooking();
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const dateInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: BOOKING_SERVICES[0],
    date: "",
    timeSlot: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1 = Details, 2 = Review & Pay Advance, 3 = Confirmed
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.IDLE);
  const [transactionRef, setTransactionRef] = useState("");

  // Today string for min attribute in date picker
  const todayString = new Date().toISOString().split("T")[0];

  // Sync pre-selected service & reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        service: prefilledService || prev.service || BOOKING_SERVICES[0],
      }));
      setStep(1);
      setErrors({});
      setPaymentStatus(PAYMENT_STATUS.IDLE);
      setTransactionRef("");
    }
  }, [isOpen, prefilledService]);

  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && paymentStatus !== PAYMENT_STATUS.PROCESSING) {
        closeBooking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, paymentStatus, closeBooking]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // If date changed to Tuesday, clear selected timeSlot
      if (field === "date" && isTuesday(value)) {
        updated.timeSlot = "";
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isSelectedDateTuesday = isTuesday(formData.date);
  const isSelectedDatePast = isPastDate(formData.date);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (formData.phone.trim().replace(/\D/g, "").length < 8) {
      newErrors.phone = "Please enter a valid phone number (at least 8 digits)";
    }

    if (!formData.service) {
      newErrors.service = "Please choose a service";
    }

    if (!formData.date) {
      newErrors.date = "Please select a preferred date";
    } else if (isSelectedDateTuesday) {
      newErrors.date = "Glamour Emporium is closed on Tuesdays";
    } else if (isSelectedDatePast) {
      newErrors.date = "Please select today or a future date";
    }

    if (!formData.timeSlot) {
      if (!isSelectedDateTuesday) {
        newErrors.timeSlot = "Please choose a preferred time slot";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        try {
          dateInputRef.current.showPicker();
        } catch {
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setStep(2);
  };

  // Payment Execution Step
  const handlePayAdvance = async () => {
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);

    try {
      const result = await processBookingAdvancePayment(formData);

      if (result.success) {
        setTransactionRef(result.transactionId || "GE_ADV_CONFIRMED");
        setPaymentStatus(PAYMENT_STATUS.SUCCESS);
        setStep(3); // Move to Confirmed state
      } else {
        setPaymentStatus(PAYMENT_STATUS.FAILED);
      }
    } catch {
      setPaymentStatus(PAYMENT_STATUS.FAILED);
    }
  };

  const handleOpenWhatsAppConfirmation = () => {
    const url = buildCustomerConfirmationWhatsAppUrl(formData);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFinish = () => {
    closeBooking();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={paymentStatus === PAYMENT_STATUS.PROCESSING ? undefined : closeBooking}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-0 cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 16 }
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-xl max-h-[92dvh] bg-[#121110] text-[#f5f2eb] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col my-auto overflow-hidden rounded-none"
          >
            {/* Modal Header Bar */}
            <div className="relative flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-[#0c0b0a]/90">
              <div className="flex items-center gap-2.5">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#c9a87c]/50 shrink-0">
                  <Image
                    src="/images/logo/logo-mark.webp"
                    alt="GE Emblem"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#c9a87c] block font-semibold">
                    GLAMOUR EMPORIUM
                  </span>
                  <span id={titleId} className="font-serif text-sm sm:text-base text-[#f5f2eb] font-light">
                    {step === 1 && "BOOK YOUR VISIT"}
                    {step === 2 && "YOUR APPOINTMENT"}
                    {step === 3 && "BOOKING CONFIRMED"}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              {paymentStatus !== PAYMENT_STATUS.PROCESSING && (
                <button
                  type="button"
                  onClick={closeBooking}
                  aria-label="Close booking modal"
                  className="w-8 h-8 rounded-[2px] flex items-center justify-center border border-white/15 text-white/70 hover:text-white hover:border-[#c9a87c] transition-colors cursor-pointer focus-visible:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Advance Explanation Banner */}
            <div className="bg-[#1a1815] border-b border-[#c9a87c]/20 px-5 sm:px-7 py-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c9a87c] shrink-0" />
                <p className="text-[11px] sm:text-xs font-mono text-[#eae6df] leading-tight truncate">
                  <span className="text-[#c9a87c] font-semibold">₹{BOOKING_ADVANCE} ADVANCE:</span>{" "}
                  Adjusted against your final salon bill.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#c9a87c] tracking-wider shrink-0 hidden sm:inline">
                NO EXTRA CHARGE
              </span>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 sm:p-7 overflow-y-auto max-h-[calc(92dvh-125px)] space-y-5">
              
              {/* ============================================================ */}
              {/* STEP 1: Details & Slot Selection Form                        */}
              {/* ============================================================ */}
              {step === 1 && (
                <form onSubmit={handleProceedToReview} noValidate className="space-y-4 sm:space-y-4.5">
                  
                  {/* Row 1: Name & Phone Number (Preserved & Visually Locked if Tuesday) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    
                    {/* Full Name */}
                    <div className={`flex flex-col gap-1.5 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-40 pointer-events-none select-none" : ""}`}>
                      <label
                        htmlFor="booking-name"
                        className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center gap-1.5"
                      >
                        <User className="w-3 h-3 text-[#c9a87c]" />
                        <span>Full Name <span className="text-[#c9a87c]">*</span></span>
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        disabled={isSelectedDateTuesday}
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] placeholder:text-[#eae6df]/40 text-sm font-sans px-3.5 py-2.5 border transition-colors min-h-[46px] focus:outline-none disabled:cursor-not-allowed ${
                          errors.name
                            ? "border-[#df9b8a] focus:border-[#df9b8a]"
                            : "border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                        }`}
                      />
                      {errors.name && !isSelectedDateTuesday && (
                        <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className={`flex flex-col gap-1.5 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-40 pointer-events-none select-none" : ""}`}>
                      <label
                        htmlFor="booking-phone"
                        className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-[#c9a87c]" />
                        <span>Phone Number <span className="text-[#c9a87c]">*</span></span>
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        disabled={isSelectedDateTuesday}
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] placeholder:text-[#eae6df]/40 text-sm font-sans px-3.5 py-2.5 border transition-colors min-h-[46px] focus:outline-none disabled:cursor-not-allowed ${
                          errors.phone
                            ? "border-[#df9b8a] focus:border-[#df9b8a]"
                            : "border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                        }`}
                      />
                      {errors.phone && !isSelectedDateTuesday && (
                        <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                          {errors.phone}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Row 2: Service & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    
                    {/* Service Dropdown (Preserved & Visually Locked if Tuesday) */}
                    <div className={`flex flex-col gap-1.5 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-40 pointer-events-none select-none" : ""}`}>
                      <label
                        htmlFor="booking-service"
                        className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85"
                      >
                        Service <span className="text-[#c9a87c]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="booking-service"
                          disabled={isSelectedDateTuesday}
                          value={formData.service}
                          onChange={(e) => handleChange("service", e.target.value)}
                          className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] text-sm font-sans px-3.5 py-2.5 border transition-colors min-h-[46px] appearance-none focus:outline-none pr-9 cursor-pointer disabled:cursor-not-allowed ${
                            errors.service
                              ? "border-[#df9b8a] focus:border-[#df9b8a]"
                              : "border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                          }`}
                        >
                          {BOOKING_SERVICES.map((srv) => (
                            <option key={srv} value={srv} className="bg-[#141312] text-[#f5f2eb]">
                              {srv}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a87c]/70">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      {errors.service && !isSelectedDateTuesday && (
                        <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                          {errors.service}
                        </span>
                      )}
                    </div>

                    {/* Preferred Date (ALWAYS INTERACTIVE & VISUAL FOCUS ON TUESDAY) */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="booking-date"
                          className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center gap-1.5"
                        >
                          <CalendarDays className="w-3 h-3 text-[#c9a87c]" />
                          <span>Preferred Date <span className="text-[#c9a87c]">*</span></span>
                        </label>
                        {isSelectedDateTuesday && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#df9b8a] font-semibold">
                            TUESDAY · CLOSED
                          </span>
                        )}
                      </div>
                      <input
                        ref={dateInputRef}
                        id="booking-date"
                        type="date"
                        min={todayString}
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        style={{ colorScheme: "dark" }}
                        className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] text-sm font-sans px-3.5 py-2.5 border transition-all min-h-[46px] focus:outline-none cursor-pointer ${
                          errors.date
                            ? "border-[#df9b8a] focus:border-[#df9b8a]"
                            : isSelectedDateTuesday
                            ? "border-[#c9a87c] ring-1 ring-[#c9a87c]/50 shadow-[0_0_14px_rgba(201,168,124,0.2)]"
                            : "border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                        }`}
                      />
                      {isSelectedDateTuesday ? (
                        <p className="text-[10.5px] text-[#eae6df]/65 font-sans mt-0.5">
                          Choose any date except Tuesday.
                        </p>
                      ) : errors.date ? (
                        <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                          {errors.date}
                        </span>
                      ) : null}
                    </div>

                  </div>

                  {/* Refined Tuesday Closed Notice */}
                  {isSelectedDateTuesday && (
                    <div className="bg-[#181412] border border-[#c9a87c]/35 p-3.5 sm:p-4 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a87c]/15 border border-[#c9a87c]/30 flex items-center justify-center text-[#c9a87c] shrink-0 mt-0.5">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#c9a87c] font-bold block mb-0.5">
                            CLOSED ON TUESDAYS
                          </span>
                          <p className="text-xs text-[#eae6df]/90 font-sans leading-relaxed">
                            Glamour Emporium is closed every Tuesday.<br className="hidden sm:inline" />
                            Please choose another date to continue your booking.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenDatePicker}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-[10.5px] font-mono uppercase tracking-[0.16em] font-semibold text-[#0c0b0a] bg-[#c9a87c] hover:bg-[#eae6df] transition-all duration-200 shrink-0 cursor-pointer self-start sm:self-center shadow-sm"
                      >
                        <span>CHANGE DATE</span>
                      </button>
                    </div>
                  )}

                  {/* Row 3: Selectable Time Slots Grid (Visual layout preserved; locked if Tuesday) */}
                  <div className={`flex flex-col gap-2 pt-1 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-35 pointer-events-none select-none" : ""}`}>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#c9a87c]" />
                        <span>Select Time Slot <span className="text-[#c9a87c]">*</span></span>
                      </label>
                      <span className="text-[9px] font-mono text-[#c9a87c] uppercase">
                        10:00 AM – 08:00 PM
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {BOOKING_SLOTS.map((slot) => {
                        const isUnavailable = DEMO_UNAVAILABLE_SLOTS.includes(slot);
                        const isSelected = formData.timeSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isSelectedDateTuesday || isUnavailable}
                            onClick={() => handleChange("timeSlot", slot)}
                            className={`relative px-2.5 py-2 text-xs font-mono tracking-wider transition-all duration-200 border text-center flex flex-col items-center justify-center min-h-[42px] ${
                              isSelectedDateTuesday
                                ? "bg-white/[0.02] border-white/10 text-white/40 cursor-not-allowed"
                                : isUnavailable
                                ? "bg-white/[0.02] border-white/5 text-white/30 cursor-not-allowed line-through"
                                : isSelected
                                ? "bg-[#c9a87c] border-[#c9a87c] text-[#0c0b0a] font-bold shadow-[0_2px_10px_rgba(201,168,124,0.3)]"
                                : "bg-[#0c0b0a]/70 border-white/15 text-[#eae6df] hover:border-[#c9a87c]/70 hover:text-white cursor-pointer"
                            }`}
                          >
                            <span>{slot}</span>
                            {isUnavailable && !isSelectedDateTuesday && (
                              <span className="text-[7px] font-mono uppercase tracking-widest text-white/40 not-line-through">
                                Booked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {errors.timeSlot && !isSelectedDateTuesday && (
                      <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                        {errors.timeSlot}
                      </span>
                    )}
                  </div>

                  {/* Row 4: Optional Notes (Preserved & Visually Locked if Tuesday) */}
                  <div className={`flex flex-col gap-1.5 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-40 pointer-events-none select-none" : ""}`}>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="booking-notes"
                        className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85"
                      >
                        Notes / Style Preference
                      </label>
                      <span className="text-[9px] font-mono text-[#eae6df]/50 uppercase">
                        Optional
                      </span>
                    </div>
                    <textarea
                      id="booking-notes"
                      rows={2}
                      disabled={isSelectedDateTuesday}
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Specific haircut style, beard length, hair texture details..."
                      className="w-full bg-[#0c0b0a]/90 text-[#f5f2eb] placeholder:text-[#eae6df]/40 text-sm font-sans p-3 border border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30 transition-colors focus:outline-none resize-none min-h-[64px] disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Step 1 Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSelectedDateTuesday}
                      className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] shadow-[0_4px_20px_rgba(245,242,235,0.12)] hover:shadow-[0_4px_25px_rgba(201,168,124,0.3)] min-h-[48px] w-full text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                      style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                    >
                      <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                      <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-[#0c0b0a]">
                        <span>CONTINUE TO REVIEW</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </button>
                  </div>

                </form>
              )}

              {/* ============================================================ */}
              {/* STEP 2: Review Booking & Pay ₹99 Advance                      */}
              {/* ============================================================ */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="border-b border-white/10 pb-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a87c] font-semibold block">
                      STEP 02 / 02
                    </span>
                    <h3 className="font-serif text-2xl text-[#f5f2eb] font-light mt-0.5">
                      Review &amp; Pay ₹{BOOKING_ADVANCE} Advance
                    </h3>
                  </div>

                  {/* Summary Details Card */}
                  <div className="bg-[#0c0b0a] border border-white/12 p-4 sm:p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Client Name
                        </span>
                        <span className="font-medium text-[#f5f2eb] text-sm">
                          {formData.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Phone Number
                        </span>
                        <span className="font-medium text-[#f5f2eb] text-sm">
                          {formData.phone}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Service
                        </span>
                        <span className="font-medium text-[#c9a87c] text-sm">
                          {formData.service}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Date &amp; Slot
                        </span>
                        <span className="font-medium text-[#f5f2eb] text-sm">
                          {formatDisplayDate(formData.date)}, {formData.timeSlot}
                        </span>
                      </div>
                    </div>

                    {formData.notes && (
                      <div className="text-xs border-b border-white/10 pb-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block mb-0.5">
                          Special Requests:
                        </span>
                        <p className="text-[#eae6df]/85 font-sans italic">
                          &ldquo;{formData.notes}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* ₹99 Advance Clear Breakdown */}
                    <div className="pt-1 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#eae6df]">
                          APPOINTMENT ADVANCE
                        </span>
                        <span className="font-serif text-xl text-[#c9a87c] font-semibold">
                          ₹{BOOKING_ADVANCE}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#eae6df]/75 font-sans leading-relaxed">
                        ₹{BOOKING_ADVANCE} will be adjusted against your final salon bill. No additional booking fee.
                      </p>
                    </div>

                  </div>

                  {/* Payment Actions */}
                  <div className="space-y-3 pt-1">
                    <button
                      type="button"
                      disabled={paymentStatus === PAYMENT_STATUS.PROCESSING}
                      onClick={handlePayAdvance}
                      className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] shadow-[0_4px_25px_rgba(245,242,235,0.15)] hover:shadow-[0_4px_30px_rgba(201,168,124,0.35)] min-h-[50px] w-full text-center cursor-pointer disabled:opacity-75"
                      style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                    >
                      <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                      <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-[#0c0b0a]">
                        {paymentStatus === PAYMENT_STATUS.PROCESSING ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#0c0b0a]" />
                            <span>PROCESSING ADVANCE...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 text-[#0c0b0a]" />
                            <span>PAY ₹{BOOKING_ADVANCE} &amp; RESERVE SLOT</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>

                    {paymentStatus !== PAYMENT_STATUS.PROCESSING && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.16em] text-[#eae6df]/75 hover:text-white border border-white/10 hover:border-white/30 transition-colors w-full cursor-pointer"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Edit Details</span>
                      </button>
                    )}

                    <div className="flex items-center justify-center gap-2 text-[10.5px] text-[#eae6df]/60 font-mono tracking-tight pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c9a87c]" />
                      <span>Encrypted &amp; Secure Salon Booking Checkout</span>
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 3: Confirmed / Success State                            */}
              {/* ============================================================ */}
              {step === 3 && (
                <div className="space-y-6 text-center py-2">
                  
                  {/* Verified Icon & Header */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#c9a87c]/15 border border-[#c9a87c]/40 flex items-center justify-center text-[#c9a87c] shadow-[0_4px_20px_rgba(201,168,124,0.2)]">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#c9a87c] font-semibold block mb-1">
                        APPOINTMENT CONFIRMED ✓
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-light">
                        Your Slot is Reserved
                      </h3>
                    </div>

                    <p className="text-sm text-[#eae6df]/85 font-sans max-w-md mx-auto leading-relaxed">
                      Please arrive <strong className="text-[#f5f2eb] font-semibold">5–10 minutes before</strong> your scheduled appointment so we can start your service on time.
                    </p>
                  </div>

                  {/* Confirmed Details Badge */}
                  <div className="bg-[#0c0b0a] border border-white/12 p-4 sm:p-5 text-left space-y-2.5">
                    <div className="grid grid-cols-2 gap-2 text-xs border-b border-white/10 pb-2.5">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Service
                        </span>
                        <span className="font-medium text-[#c9a87c]">
                          {formData.service}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Client
                        </span>
                        <span className="font-medium text-[#f5f2eb]">
                          {formData.name}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-b border-white/10 pb-2.5">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Date
                        </span>
                        <span className="font-medium text-[#f5f2eb]">
                          {formatDisplayDate(formData.date)}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Time Slot
                        </span>
                        <span className="font-medium text-[#f5f2eb]">
                          {formData.timeSlot}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Booking Advance Paid
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#c9a87c]">
                          ₹{BOOKING_ADVANCE} (Adjustable against bill)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#eae6df]/60 block">
                          Ref No.
                        </span>
                        <span className="font-mono text-[10px] text-[#eae6df]/80">
                          {transactionRef}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] shadow-[0_4px_25px_rgba(245,242,235,0.15)] min-h-[48px] w-full text-center cursor-pointer"
                      style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                    >
                      <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                      <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-[#0c0b0a]">
                        <span>DONE</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenWhatsAppConfirmation}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.14em] text-[#c9a87c] hover:text-[#f5f2eb] border border-[#c9a87c]/40 hover:border-[#f5f2eb] transition-colors w-full cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>OPEN WHATSAPP CONFIRMATION</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              )}

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

