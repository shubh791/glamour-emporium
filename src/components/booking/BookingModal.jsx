"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
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
  RotateCcw,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import {
  BOOKING_ADVANCE,
  BOOKING_CATALOGUE,
  BOOKING_SERVICES,
  BOOKING_SLOTS,
  ONLINE_BOOKING_OFFER,
  PAYMENT_STATUS,
  getServicesForCategory,
  normalizeServiceName,
  isTuesday,
  isPastDate,
  formatDisplayDate,
  buildCustomerConfirmationWhatsAppUrl,
} from "@/data/bookingConfig";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function BookingModal() {
  const { isOpen, bookingPayload, closeBooking } = useBooking();
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const dateInputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const modalShellRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    service: "",
    date: "",
    timeSlot: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1 = Details, 2 = Review & Pay Advance, 3 = Confirmed
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.IDLE);
  const [paymentErrorTitle, setPaymentErrorTitle] = useState("PAYMENT COULD NOT START");
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time Slot Availability State
  const [slotsState, setSlotsState] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Today string for min attribute in date picker
  const todayString = new Date().toISOString().split("T")[0];

  // Fetch live slot availability for chosen date
  const fetchAvailability = useCallback(async (dateStr) => {
    if (!dateStr || isTuesday(dateStr) || isPastDate(dateStr)) {
      setSlotsState([]);
      return;
    }

    setIsLoadingSlots(true);
    try {
      const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(dateStr)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.slots)) {
        setSlotsState(data.slots);
      } else {
        setSlotsState([]);
      }
    } catch (err) {
      console.error("Failed to load availability:", err);
      setSlotsState([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  // Sync pre-selected category/service & reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        category: bookingPayload?.category || "",
        service: bookingPayload?.service || "",
      }));
      setStep(1);
      setErrors({});
      setPaymentStatus(PAYMENT_STATUS.IDLE);
      setPaymentErrorMessage("");
      setTransactionRef("");
      setIsSubmitting(false);
    }
  }, [isOpen, bookingPayload]);

  // Fetch availability when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailability(formData.date);
    }
  }, [formData.date, fetchAvailability]);

  // Lock document/body scroll and freeze background when modal is open
  useEffect(() => {
    if (!isOpen) return;

    // 1. Pause Lenis smooth-scroll instance for background page
    if (typeof window !== "undefined" && window.__lenis) {
      try {
        window.__lenis.stop();
      } catch {
        // safety
      }
    }

    // 2. Lock body scroll natively
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Stop wheel/touch event propagation from modal to prevent global interception
    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    const scrollEl = scrollAreaRef.current;
    const shellEl = modalShellRef.current;

    if (scrollEl) {
      scrollEl.addEventListener("wheel", stopPropagation, { passive: true });
      scrollEl.addEventListener("touchmove", stopPropagation, { passive: true });
    }
    if (shellEl) {
      shellEl.addEventListener("wheel", stopPropagation, { passive: true });
      shellEl.addEventListener("touchmove", stopPropagation, { passive: true });
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && paymentStatus !== PAYMENT_STATUS.PROCESSING) {
        closeBooking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollEl) {
        scrollEl.removeEventListener("wheel", stopPropagation);
        scrollEl.removeEventListener("touchmove", stopPropagation);
      }
      if (shellEl) {
        shellEl.removeEventListener("wheel", stopPropagation);
        shellEl.removeEventListener("touchmove", stopPropagation);
      }
      document.body.style.overflow = originalBodyOverflow;

      // Resume Lenis smooth-scroll instance
      if (typeof window !== "undefined" && window.__lenis) {
        try {
          window.__lenis.start();
        } catch {
          // safety
        }
      }
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

  const handleCategoryChange = (newCategory) => {
    setFormData((prev) => {
      const servicesInNewCat = getServicesForCategory(newCategory);
      const isServiceInNewCat = servicesInNewCat.some(
        (s) => normalizeServiceName(s.name) === normalizeServiceName(prev.service)
      );

      return {
        ...prev,
        category: newCategory,
        service: isServiceInNewCat ? prev.service : "",
      };
    });

    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "", service: "" }));
    }
  };

  const isSelectedDateTuesday = isTuesday(formData.date);
  const isSelectedDatePast = isPastDate(formData.date);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name";
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    if (!formData.category) {
      newErrors.category = "Please select a service category";
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
    setPaymentErrorMessage("");
    setPaymentStatus(PAYMENT_STATUS.IDLE);
    setStep(2);
  };

  // Real Production Payment Flow via Cashfree
  const handlePayAdvance = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
    setPaymentErrorMessage("");
    setPaymentErrorTitle("PAYMENT COULD NOT START");

    try {
      console.log("[Cashfree Flow] 1. Requesting order creation for:", {
        date: formData.date,
        timeSlot: formData.timeSlot,
        category: formData.category,
      });

      // 1. Create Booking & Temporary 10-min Slot Hold on Server
      const createRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          serviceCategory: formData.category,
          service: formData.service,
          bookingDate: formData.date,
          bookingTime: formData.timeSlot,
          notes: formData.notes,
        }),
      });

      const createData = await createRes.json();

      console.log("[Cashfree Flow] 2. Server create order response:", {
        httpStatus: createRes.status,
        success: Boolean(createData?.success),
        bookingCode: createData?.bookingCode,
        cashfreeOrderId: createData?.cashfreeOrderId,
        hasPaymentSessionId: Boolean(createData?.paymentSessionId),
        error: createData?.error || null,
        details: createData?.details || null,
      });

      if (!createRes.ok || !createData.success || !createData.paymentSessionId) {
        const errorText =
          createData.error ||
          createData.details ||
          "We couldn't start the secure payment session. Please try again.";
        setPaymentErrorTitle("PAYMENT COULD NOT START");
        setPaymentErrorMessage(errorText);
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setIsSubmitting(false);

        // If slot conflict, refresh availability
        if (createData.code === "SLOT_UNAVAILABLE") {
          fetchAvailability(formData.date);
        }
        return;
      }

      const { bookingCode, paymentSessionId, cashfreeOrderId } = createData;

      // 2. Launch Official Cashfree Checkout Modal
      const envMode = (process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox").toLowerCase();
      console.log("[Cashfree Flow] 3. Initializing Cashfree SDK with mode:", envMode);

      let cashfree;
      try {
        const { load } = await import("@cashfreepayments/cashfree-js");
        cashfree = await load({
          mode: envMode === "production" ? "production" : "sandbox",
        });
      } catch (loadErr) {
        console.error("[Cashfree Flow] SDK Load Exception:", loadErr);
        setPaymentErrorTitle("PAYMENT COULD NOT START");
        setPaymentErrorMessage(
          "Unable to load Cashfree payment gateway script. Please check your internet connection or ad blocker."
        );
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setIsSubmitting(false);
        return;
      }

      if (!cashfree || typeof cashfree.checkout !== "function") {
        console.error("[Cashfree Flow] Cashfree JS SDK object unavailable.");
        setPaymentErrorTitle("PAYMENT COULD NOT START");
        setPaymentErrorMessage("Payment gateway initialization failed. Please try again.");
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setIsSubmitting(false);
        return;
      }

      console.log("[Cashfree Flow] 4. Launching Cashfree checkout for session:", {
        bookingCode,
        cashfreeOrderId,
        hasSession: Boolean(paymentSessionId),
      });

      try {
        await cashfree.checkout({
          paymentSessionId,
          redirectTarget: "_modal",
        });
        console.log("[Cashfree Flow] 5. Modal checkout interaction concluded.");
      } catch (sdkErr) {
        console.warn("[Cashfree Flow] Modal checkout notice:", sdkErr);
      }

      // 3. Authoritative Verification via Backend
      console.log("[Cashfree Flow] 6. Verifying payment status on server...");
      const verifyRes = await fetch("/api/bookings/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          cashfreeOrderId,
        }),
      });

      const verifyData = await verifyRes.json();
      console.log("[Cashfree Flow] 7. Verification result:", {
        isConfirmed: Boolean(verifyData?.isConfirmed),
        bookingStatus: verifyData?.booking?.bookingStatus,
        paymentStatus: verifyData?.booking?.paymentStatus,
      });

      if (verifyData.isConfirmed || verifyData?.booking?.bookingStatus === "CONFIRMED") {
        setTransactionRef(bookingCode);
        setPaymentStatus(PAYMENT_STATUS.SUCCESS);
        setStep(3); // Transition to Confirmed state
      } else {
        setPaymentErrorTitle("PAYMENT NOT COMPLETED");
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setPaymentErrorMessage(
          "Payment was not completed. Your appointment has not been confirmed."
        );
      }
    } catch (err) {
      console.error("[Cashfree Flow] Unhandled payment execution error:", err);
      setPaymentErrorTitle("PAYMENT COULD NOT START");
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      setPaymentErrorMessage(
        err.message || "We couldn't start the secure payment session. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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
          data-lenis-prevent="true"
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={paymentStatus === PAYMENT_STATUS.PROCESSING ? undefined : closeBooking}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-0 cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container Shell */}
          <motion.div
            ref={modalShellRef}
            data-lenis-prevent="true"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
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
            className="relative z-10 w-full max-w-xl max-h-[90dvh] sm:max-h-[92dvh] bg-[#121110] text-[#f5f2eb] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden rounded-none my-auto"
          >
            {/* Modal Header Bar (Fixed / Sticky at top) */}
            <div className="shrink-0 z-20 flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-[#0c0b0a]">
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

            {/* Advance Explanation Banner (Sticky directly below header) */}
            <div className="shrink-0 z-10 bg-[#1a1815] border-b border-[#c9a87c]/20 px-5 sm:px-7 py-2 flex items-center justify-between gap-2 text-xs">
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

            {/* Scrollable Content Body (The ONLY area that scrolls) */}
            <div
              ref={scrollAreaRef}
              data-lenis-prevent="true"
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="modal-scroll-area flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5 sm:p-7 space-y-5"
              style={{
                flex: "1 1 0%",
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                touchAction: "pan-y",
              }}
            >
              
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

                  {/* Row 2: Service Category & Specific Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    
                    {/* 1. Service Category */}
                    <div className={`flex flex-col gap-1.5 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-40 pointer-events-none select-none" : ""}`}>
                      <label
                        htmlFor="booking-category"
                        className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center justify-between"
                      >
                        <span>SERVICE CATEGORY <span className="text-[#c9a87c]">*</span></span>
                      </label>
                      <div className="relative">
                        <select
                          id="booking-category"
                          disabled={isSelectedDateTuesday}
                          value={formData.category}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] text-sm font-sans px-3.5 py-2.5 border transition-colors min-h-[46px] appearance-none focus:outline-none pr-9 cursor-pointer disabled:cursor-not-allowed ${
                            errors.category
                              ? "border-[#df9b8a] focus:border-[#df9b8a]"
                              : "border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                          }`}
                        >
                          <option value="" className="bg-[#141312] text-[#eae6df]/50">
                            Choose Category...
                          </option>
                          {BOOKING_CATALOGUE.map((cat) => (
                            <option key={cat.id} value={cat.category} className="bg-[#141312] text-[#f5f2eb]">
                              {cat.category}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a87c]/70">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      {errors.category && !isSelectedDateTuesday && (
                        <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                          {errors.category}
                        </span>
                      )}
                    </div>

                    {/* 2. Specific Service */}
                    <div className={`flex flex-col gap-1.5 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-40 pointer-events-none select-none" : ""}`}>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="booking-service"
                          className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85"
                        >
                          SERVICE
                        </label>
                        {formData.category && (
                          <span className="text-[9px] font-mono text-[#eae6df]/50 uppercase">
                            Optional
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          id="booking-service"
                          disabled={isSelectedDateTuesday || !formData.category}
                          value={formData.service}
                          onChange={(e) => handleChange("service", e.target.value)}
                          className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] text-sm font-sans px-3.5 py-2.5 border transition-colors min-h-[46px] appearance-none focus:outline-none pr-9 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                            errors.service
                              ? "border-[#df9b8a] focus:border-[#df9b8a]"
                              : "border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                          }`}
                        >
                          {!formData.category ? (
                            <option value="" className="bg-[#141312] text-[#eae6df]/50">
                              Select Category First
                            </option>
                          ) : (
                            <>
                              <option value="" className="bg-[#141312] text-[#eae6df]/60">
                                General / Consultation or Choose Service...
                              </option>
                              {getServicesForCategory(formData.category).map((srv) => (
                                <option key={srv.name} value={srv.name} className="bg-[#141312] text-[#f5f2eb]">
                                  {srv.name}
                                </option>
                              ))}
                            </>
                          )}
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

                  </div>

                  {/* Row 3: Preferred Date (ALWAYS INTERACTIVE & VISUAL FOCUS ON TUESDAY) */}
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

                  {/* Row 3: Selectable Time Slots Grid (Live Server Availability) */}
                  <div className={`flex flex-col gap-2 pt-1 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-35 pointer-events-none select-none" : ""}`}>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#c9a87c]" />
                        <span>Select Time Slot <span className="text-[#c9a87c]">*</span></span>
                      </label>
                      <div className="flex items-center gap-2">
                        {isLoadingSlots && (
                          <span className="text-[9px] font-mono text-[#c9a87c] flex items-center gap-1">
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            <span>Checking slots...</span>
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-[#c9a87c] uppercase">
                          10:00 AM – 08:00 PM
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {BOOKING_SLOTS.map((slot) => {
                        const serverSlotInfo = slotsState.find((s) => s.slot === slot);
                        const isUnavailable = serverSlotInfo ? !serverSlotInfo.available : false;
                        const slotBadge = serverSlotInfo?.status === "HELD" ? "Reserved" : "Booked";
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
                                {slotBadge}
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

                  {/* Payment Failure Notice */}
                  {paymentStatus === PAYMENT_STATUS.FAILED && (
                    <div className="bg-[#241310] border border-[#df9b8a]/50 p-4 space-y-2 text-left shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                      <div className="flex items-center gap-2.5 text-[#df9b8a]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="font-mono text-xs uppercase tracking-widest font-bold">
                          {paymentErrorTitle}
                        </span>
                      </div>
                      <p className="text-xs text-[#eae6df]/90 font-sans leading-relaxed">
                        {paymentErrorMessage || "Your appointment has not been confirmed. The ₹99 advance was not completed."}
                      </p>
                    </div>
                  )}

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
                        <span className="font-medium text-[#c9a87c] text-sm block">
                          {formData.service || formData.category}
                        </span>
                        {formData.service && formData.category && formData.service !== formData.category && (
                          <span className="text-[11px] text-[#eae6df]/60 block font-normal font-sans">
                            {formData.category}
                          </span>
                        )}
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
                      disabled={paymentStatus === PAYMENT_STATUS.PROCESSING || isSubmitting}
                      onClick={handlePayAdvance}
                      className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0c0b0a] bg-[#f5f2eb] border border-[#f5f2eb] overflow-hidden transition-all duration-300 hover:border-[#c9a87c] shadow-[0_4px_25px_rgba(245,242,235,0.15)] hover:shadow-[0_4px_30px_rgba(201,168,124,0.35)] min-h-[50px] w-full text-center cursor-pointer disabled:opacity-75"
                      style={{ color: "#0c0b0a", backgroundColor: "#f5f2eb" }}
                    >
                      <span className="absolute inset-0 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                      <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-[#0c0b0a]">
                        {paymentStatus === PAYMENT_STATUS.PROCESSING || isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#0c0b0a]" />
                            <span>INITIALIZING CASHFREE CHECKOUT...</span>
                          </>
                        ) : paymentStatus === PAYMENT_STATUS.FAILED ? (
                          <>
                            <RotateCcw className="w-4 h-4 text-[#0c0b0a]" />
                            <span>TRY PAYMENT AGAIN (₹{BOOKING_ADVANCE})</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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

                    {paymentStatus !== PAYMENT_STATUS.PROCESSING && !isSubmitting && (
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setPaymentStatus(PAYMENT_STATUS.IDLE);
                          setPaymentErrorMessage("");
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.16em] text-[#eae6df]/75 hover:text-white border border-white/10 hover:border-white/30 transition-colors w-full cursor-pointer"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>{paymentStatus === PAYMENT_STATUS.FAILED ? "Choose Another Slot / Date" : "Edit Details"}</span>
                      </button>
                    )}

                    <div className="flex items-center justify-center gap-2 text-[10.5px] text-[#eae6df]/60 font-mono tracking-tight pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c9a87c]" />
                      <span>Encrypted &amp; Secure Cashfree Payment Gateway Checkout</span>
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
                        <span className="font-medium text-[#c9a87c] block">
                          {formData.service || formData.category}
                        </span>
                        {formData.service && formData.category && formData.service !== formData.category && (
                          <span className="text-[10px] text-[#eae6df]/60 block font-sans">
                            {formData.category}
                          </span>
                        )}
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
                          Booking Code
                        </span>
                        <span className="font-mono text-xs font-bold text-[#c9a87c]">
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

