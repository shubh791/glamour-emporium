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
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import {
  BOOKING_ADVANCE,
  BOOKING_CATALOGUE,
  BOOKING_SLOTS,
  PAYMENT_STATUS,
  getServicesForCategory,
  normalizeServiceName,
  isTuesday,
  isPastDate,
  formatDisplayDate,
  getTodayKolkataString,
  isSlotAvailableTimeWise,
  sanitizePhone,
  isValidPhone,
  buildCustomerConfirmationWhatsAppUrl,
} from "@/data/bookingConfig";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(false);
    }
    if (window.Razorpay) {
      return resolve(true);
    }
    const existingScript = document.getElementById("razorpay-checkout-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function BookingModalInner({ bookingPayload, closeBooking }) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const dateInputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const modalShellRef = useRef(null);

  // Form State initialized from payload
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: bookingPayload?.category || "",
    service: bookingPayload?.service || "",
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

  // Today string for min attribute in date picker (Asia/Kolkata)
  const todayKolkataString = getTodayKolkataString();

  // Load slot availability when date changes
  useEffect(() => {
    let ignore = false;

    if (!formData.date || isTuesday(formData.date) || isPastDate(formData.date)) {
      return;
    }

    const loadSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(formData.date)}`);
        const data = await res.json();
        if (!ignore) {
          if (data.success && Array.isArray(data.slots)) {
            setSlotsState(data.slots);
            // Automatically clear selected slot if it became full
            setFormData((prev) => {
              if (prev.timeSlot) {
                const chosen = data.slots.find((s) => s.slot === prev.timeSlot);
                if (chosen && (chosen.available === false || chosen.remainingSeats <= 0)) {
                  return { ...prev, timeSlot: "" };
                }
              }
              return prev;
            });
          } else {
            setSlotsState([]);
          }
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
        if (!ignore) setSlotsState([]);
      } finally {
        if (!ignore) setIsLoadingSlots(false);
      }
    };

    loadSlots();

    return () => {
      ignore = true;
    };
  }, [formData.date]);

  // Manual refresh helper
  const refreshAvailability = async (targetDate) => {
    if (!targetDate || isTuesday(targetDate) || isPastDate(targetDate)) return;
    setIsLoadingSlots(true);
    try {
      const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(targetDate)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.slots)) {
        setSlotsState(data.slots);
      }
    } catch (err) {
      console.error("Failed to refresh availability:", err);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Lock document/body scroll and freeze background when modal is open
  useEffect(() => {
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
  }, [paymentStatus, closeBooking]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhoneInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    handleChange("phone", raw);
  };

  const handleDateChange = (newDate) => {
    setSlotsState([]); // Reset slot state on new date selection
    setFormData((prev) => {
      const updated = { ...prev, date: newDate };
      // When date changes, immediately clear any previously selected invalid/past slot
      if (prev.timeSlot) {
        const isStillValid = isSlotAvailableTimeWise(newDate, prev.timeSlot, 15);
        if (!isStillValid || isTuesday(newDate)) {
          updated.timeSlot = "";
        }
      }
      return updated;
    });

    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: "" }));
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

    const cleanPhone = sanitizePhone(formData.phone);
    if (!cleanPhone) {
      newErrors.phone = "Mobile number is required.";
    } else if (cleanPhone.length < 10) {
      const remaining = 10 - cleanPhone.length;
      newErrors.phone = `Enter the remaining ${remaining} digit${remaining > 1 ? "s" : ""}.`;
    } else if (!isValidPhone(cleanPhone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a service category";
    }

    if (!formData.date) {
      newErrors.date = "Please select a preferred date";
    } else if (isSelectedDateTuesday) {
      newErrors.date = "Salon is closed every Tuesday. Please select another date.";
    } else if (isSelectedDatePast) {
      newErrors.date = "Please select today or a future date";
    }

    if (!formData.timeSlot) {
      if (!isSelectedDateTuesday) {
        newErrors.timeSlot = "Please choose a preferred time slot";
      }
    } else if (formData.date && !isSlotAvailableTimeWise(formData.date, formData.timeSlot, 15)) {
      newErrors.timeSlot = "This time slot is no longer available today";
    } else if (slotsState.length > 0) {
      const chosen = slotsState.find((s) => s.slot === formData.timeSlot);
      if (chosen && (chosen.available === false || chosen.remainingSeats <= 0)) {
        newErrors.timeSlot = "This time slot just became full. Please select another time.";
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
          return;
        } catch {
          // fallback
        }
      }
      dateInputRef.current.focus();
    }
  };

  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setPaymentErrorMessage("");
    setPaymentStatus(PAYMENT_STATUS.IDLE);
    setStep(2);
  };

  // Real Production Payment Flow via Razorpay Standard Checkout
  const handlePayAdvance = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
    setPaymentErrorMessage("");
    setPaymentErrorTitle("PAYMENT COULD NOT START");

    const cleanPhone = sanitizePhone(formData.phone);

    try {
      console.log("[Razorpay Flow] 1. Requesting order creation for:", {
        date: formData.date,
        timeSlot: formData.timeSlot,
        category: formData.category,
        phone: cleanPhone,
      });

      // 1. Create Razorpay Order on Server
      let createRes;
      let createData = {};
      try {
        createRes = await fetch("/api/bookings/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: formData.name.trim(),
            customerPhone: cleanPhone,
            serviceCategory: formData.category,
            service: formData.service,
            bookingDate: formData.date,
            bookingTime: formData.timeSlot,
            notes: formData.notes,
          }),
        });

        const rawText = await createRes.text();
        try {
          createData = JSON.parse(rawText);
        } catch {
          createData = { error: "Unable to start payment session. Please try again." };
        }
      } catch (fetchErr) {
        console.error("[Razorpay Flow] Network error creating order:", fetchErr);
        setPaymentErrorTitle("NETWORK ERROR");
        setPaymentErrorMessage("Unable to connect to booking server. Please check your internet connection and try again.");
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setIsSubmitting(false);
        return;
      }

      console.log("[Razorpay Flow] 2. Server create order response:", {
        httpStatus: createRes?.status,
        success: Boolean(createData?.success),
        bookingCode: createData?.bookingCode,
        razorpayOrderId: createData?.razorpayOrderId,
        error: createData?.error || null,
        code: createData?.code || null,
      });

      // Handle Slot Full Conflict (HTTP 409) during Order Creation
      if (createRes?.status === 409 || createData.code === "SLOT_FULL" || createData.code === "SLOT_UNAVAILABLE") {
        setStep(1); // Return back to slot selection
        setFormData((prev) => ({ ...prev, timeSlot: "" }));
        setErrors((prev) => ({
          ...prev,
          timeSlot: createData.error || "This time slot just became full. Please select another time.",
        }));
        setPaymentStatus(PAYMENT_STATUS.IDLE);
        setIsSubmitting(false);
        if (formData.date) {
          refreshAvailability(formData.date);
        }
        return;
      }

      if (!createRes?.ok || !createData.success || !createData.razorpayOrderId) {
        const errorText =
          createData.error ||
          createData.details ||
          "We couldn't start the secure payment session. Please try again.";
        setPaymentErrorTitle(
          createData.code === "RAZORPAY_KEYS_NOT_CONFIGURED"
            ? "RAZORPAY SETUP REQUIRED"
            : createData.code === "INVALID_PHONE"
            ? "INVALID PHONE NUMBER"
            : "PAYMENT COULD NOT START"
        );
        setPaymentErrorMessage(errorText);
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setIsSubmitting(false);

        if (formData.date) {
          refreshAvailability(formData.date);
        }
        return;
      }

      const { bookingCode, razorpayOrderId, keyId, amount, currency } = createData;

      // 2. Load Official Razorpay Checkout Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window.Razorpay !== "function") {
        console.error("[Razorpay Flow] Razorpay SDK could not be loaded.");
        setPaymentErrorTitle("PAYMENT COULD NOT START");
        setPaymentErrorMessage(
          "Unable to load Razorpay payment gateway script. Please check your internet connection or ad blocker."
        );
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setIsSubmitting(false);
        return;
      }

      // 3. Launch Standard Razorpay Modal
      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount || BOOKING_ADVANCE * 100,
        currency: currency || "INR",
        name: "Glamour Emporium",
        description: `Appointment Advance (₹${BOOKING_ADVANCE})`,
        image: "/images/logo/logo-mark.webp",
        order_id: razorpayOrderId,
        prefill: {
          name: formData.name.trim(),
          contact: cleanPhone ? `+91${cleanPhone}` : "",
        },
        theme: {
          color: "#c9a87c",
          backdrop_color: "#0c0b0a",
        },
        modal: {
          ondismiss: function () {
            console.log("[Razorpay Flow] Checkout modal dismissed by customer.");
            setIsSubmitting(false);
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            setPaymentErrorTitle("PAYMENT NOT COMPLETED");
            setPaymentErrorMessage(
              "Checkout was closed before completing payment. Your appointment has not been confirmed."
            );
          },
          escape: true,
          backdropclose: false,
        },
        handler: async function (response) {
          console.log("[Razorpay Flow] Payment completed by customer, verifying signature:", response);
          setIsSubmitting(true);
          setPaymentStatus(PAYMENT_STATUS.PROCESSING);

          try {
            const verifyRes = await fetch("/api/bookings/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingCode,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                customerName: formData.name.trim(),
                customerPhone: cleanPhone,
                serviceCategory: formData.category,
                service: formData.service,
                bookingDate: formData.date,
                bookingTime: formData.timeSlot,
                notes: formData.notes,
              }),
            });

            let verifyData = {};
            try {
              const verifyRawText = await verifyRes.text();
              verifyData = JSON.parse(verifyRawText);
            } catch {
              verifyData = { error: "Payment verification could not be completed. Please contact salon support." };
            }

            console.log("[Razorpay Flow] Verification result:", verifyData);

            // Handle Slot Full Conflict during Payment Verification
            if (verifyRes?.status === 409 || verifyData.code === "SLOT_FULL" || verifyData.code === "SLOT_UNAVAILABLE") {
              setStep(1); // Return back to slot selection
              setFormData((prev) => ({ ...prev, timeSlot: "" }));
              setErrors((prev) => ({
                ...prev,
                timeSlot: verifyData.error || "This time slot just became full. Please select another time.",
              }));
              setPaymentStatus(PAYMENT_STATUS.FAILED);
              setPaymentErrorTitle("SLOT NO LONGER AVAILABLE");
              setPaymentErrorMessage(
                verifyData.error || "This time slot just became full. Please select another time."
              );
              setIsSubmitting(false);
              if (formData.date) {
                refreshAvailability(formData.date);
              }
              return;
            }

            if (verifyData.isConfirmed || verifyData?.booking?.bookingStatus === "CONFIRMED") {
              setTransactionRef(bookingCode);
              setPaymentStatus(PAYMENT_STATUS.SUCCESS);
              setStep(3); // Transition to Confirmed state
            } else {
              setPaymentErrorTitle("PAYMENT VERIFICATION FAILED");
              setPaymentStatus(PAYMENT_STATUS.FAILED);
              setPaymentErrorMessage(
                verifyData.error || "Payment verification could not be completed. Please contact support."
              );
            }
          } catch (verifyErr) {
            console.error("[Razorpay Flow] Verification error:", verifyErr);
            setPaymentErrorTitle("VERIFICATION ERROR");
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            setPaymentErrorMessage(
              "A network error occurred while confirming your payment. Please contact salon support with your payment receipt."
            );
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("[Razorpay Flow] Payment failed on gateway:", response.error);
        setIsSubmitting(false);
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setPaymentErrorTitle("PAYMENT FAILED");
        setPaymentErrorMessage(
          response.error?.description ||
            "Payment was declined by your bank or UPI app. Please try again with a different payment method."
        );
      });

      rzp.open();
    } catch (err) {
      console.error("[Razorpay Flow] Unhandled payment execution error:", err);
      setPaymentErrorTitle("PAYMENT COULD NOT START");
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      setPaymentErrorMessage(
        err.message || "We couldn't start the secure payment session. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppConfirmation = () => {
    const url = buildCustomerConfirmationWhatsAppUrl({
      ...formData,
      phone: formData.phone,
      bookingCode: transactionRef,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFinish = () => {
    closeBooking();
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop (Non-closing on outside/sideways click) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-0 select-none pointer-events-auto"
        aria-hidden="true"
      />

      {/* Modal Container Shell */}
      <motion.div
        ref={modalShellRef}
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
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
        className="relative z-10 w-full max-w-xl max-h-[90dvh] sm:max-h-[92dvh] bg-[#121110] text-[#f5f2eb] border border-[#c9a87c]/35 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden rounded-[2px] my-auto"
      >
        {/* Modal Header Bar (Fixed / Sticky at top) */}
        <div className="shrink-0 z-20 flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-[#0c0b0a]">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#c9a87c]/60 shrink-0">
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
                {step === 1
                  ? "BOOK YOUR VISIT"
                  : step === 2
                  ? "YOUR APPOINTMENT"
                  : "BOOKING CONFIRMED"}
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
        <div className="shrink-0 z-10 bg-[#181614] border-b border-[#c9a87c]/25 px-5 sm:px-6 py-2 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c9a87c] shrink-0" />
            <p className="text-[11px] sm:text-xs font-mono text-[#eae6df] leading-tight truncate">
              <span className="text-[#c9a87c] font-semibold">₹{BOOKING_ADVANCE} ADVANCE:</span>{" "}
              Adjusted against final salon bill.
            </p>
          </div>
          <span className="font-mono text-[9.5px] uppercase text-[#c9a87c] tracking-wider shrink-0 hidden sm:inline">
            NO EXTRA CHARGE
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={scrollAreaRef}
          data-lenis-prevent="true"
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
              
              {/* Row 1: Name & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
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
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] placeholder:text-[#eae6df]/40 text-base sm:text-sm font-sans px-3.5 py-2.5 border transition-colors min-h-[46px] focus:outline-none ${
                      errors.name
                        ? "border-[#df9b8a] focus:border-[#df9b8a]"
                        : "border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="booking-phone"
                    className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center gap-1.5"
                  >
                    <Phone className="w-3 h-3 text-[#c9a87c]" />
                    <span>Mobile Number <span className="text-[#c9a87c]">*</span></span>
                  </label>
                  <div
                    className={`flex items-center w-full bg-[#0c0b0a]/90 border transition-colors min-h-[46px] focus-within:ring-1 ${
                      errors.phone
                        ? "border-[#df9b8a] focus-within:border-[#df9b8a] focus-within:ring-[#df9b8a]/30"
                        : "border-white/15 focus-within:border-[#c9a87c]/80 focus-within:ring-[#c9a87c]/30"
                    }`}
                  >
                    <div className="flex items-center gap-1 px-3 bg-white/[0.04] border-r border-white/10 text-xs font-mono text-[#c9a87c] select-none h-full py-2.5 shrink-0">
                      <span>+91</span>
                    </div>
                    <input
                      id="booking-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handlePhoneInputChange}
                      placeholder="10-digit mobile"
                      className="w-full bg-transparent text-[#f5f2eb] placeholder:text-[#eae6df]/40 text-base sm:text-sm font-mono px-3 py-2.5 focus:outline-none"
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                      {errors.phone}
                    </span>
                  )}
                </div>

              </div>

              {/* Row 2: Service Category & Specific Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* 1. Service Category */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="booking-category"
                    className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center justify-between"
                  >
                    <span>SERVICE CATEGORY <span className="text-[#c9a87c]">*</span></span>
                  </label>
                  <div className="relative">
                    <select
                      id="booking-category"
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] text-base sm:text-sm font-sans px-3.5 py-2.5 border transition-colors min-h-[46px] appearance-none focus:outline-none pr-9 cursor-pointer ${
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
                  {errors.category && (
                    <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                      {errors.category}
                    </span>
                  )}
                </div>

                {/* 2. Specific Service */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="booking-service"
                    className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center justify-between"
                  >
                    <span>SPECIFIC SERVICE</span>
                    <span className="text-[9px] text-[#c9a87c]/70 uppercase tracking-widest">OPTIONAL</span>
                  </label>
                  <div className="relative">
                    <select
                      id="booking-service"
                      disabled={!formData.category}
                      value={formData.service}
                      onChange={(e) => handleChange("service", e.target.value)}
                      className="w-full bg-[#0c0b0a]/90 text-[#f5f2eb] text-base sm:text-sm font-sans px-3.5 py-2.5 border border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30 transition-colors min-h-[46px] appearance-none focus:outline-none pr-9 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-[#141312] text-[#eae6df]/50">
                        {formData.category ? "Select specific service..." : "Choose category first"}
                      </option>
                      {formData.category &&
                        getServicesForCategory(formData.category).map((s) => (
                          <option key={s.name} value={s.name} className="bg-[#141312] text-[#f5f2eb]">
                            {s.name}
                          </option>
                        ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a87c]/70">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 3: Appointment Date Selection */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="booking-date"
                  onClick={handleOpenDatePicker}
                  className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center justify-between cursor-pointer select-none"
                >
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-3 h-3 text-[#c9a87c]" />
                    <span>PREFERRED DATE <span className="text-[#c9a87c]">*</span></span>
                  </span>
                  <span className="text-[9px] text-[#c9a87c] tracking-widest uppercase">
                    CLOSED TUESDAYS
                  </span>
                </label>

                <div
                  onClick={handleOpenDatePicker}
                  className="relative cursor-pointer group"
                >
                  <input
                    ref={dateInputRef}
                    id="booking-date"
                    type="date"
                    min={todayKolkataString}
                    value={formData.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    onClick={(e) => {
                      if (typeof e.currentTarget.showPicker === "function") {
                        try {
                          e.currentTarget.showPicker();
                        } catch {
                          // fallback
                        }
                      }
                    }}
                    className={`w-full bg-[#0c0b0a]/90 text-[#f5f2eb] text-base sm:text-sm font-mono px-3.5 py-2.5 border transition-colors min-h-[46px] focus:outline-none cursor-pointer scheme-dark ${
                      errors.date || isSelectedDateTuesday
                        ? "border-[#df9b8a] focus:border-[#df9b8a]"
                        : "border-white/15 group-hover:border-[#c9a87c]/60 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDatePicker();
                    }}
                    aria-label="Open date calendar picker"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a87c] group-hover:text-[#f5f2eb] hover:text-[#f5f2eb] transition-colors p-1 cursor-pointer"
                  >
                    <CalendarDays className="w-4 h-4" />
                  </button>
                </div>

                {/* Tuesday Closure Warning Alert */}
                {isSelectedDateTuesday && (
                  <div className="p-3 bg-[#2d110f] border border-[#df9b8a]/50 text-[#df9b8a] text-xs font-mono flex items-start gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold uppercase tracking-wider">Salon Closed on Tuesdays</p>
                      <p className="text-[11px] text-[#df9b8a]/90 mt-0.5">
                        Glamour Emporium is closed every Tuesday. Please select another day.
                      </p>
                    </div>
                  </div>
                )}

                {errors.date && !isSelectedDateTuesday && (
                  <span className="text-[11px] text-[#df9b8a] font-mono tracking-wide">
                    {errors.date}
                  </span>
                )}
              </div>

              {/* Row 4: Time Slot Selection (Capacity Aware - 3 spots per slot) */}
              <div className={`flex flex-col gap-2 transition-opacity duration-200 ${isSelectedDateTuesday ? "opacity-30 pointer-events-none select-none" : ""}`}>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#c9a87c]" />
                    <span>TIME SLOT <span className="text-[#c9a87c]">*</span></span>
                  </label>
                  <span className="text-[9.5px] font-mono text-[#c9a87c]/80">
                    {formData.timeSlot ? formData.timeSlot : "Choose time"}
                  </span>
                </div>

                {/* Slot Helper Line & Live Status Indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#eae6df]/70 px-0.5">
                  <span>Up to 3 appointments are available per time slot.</span>
                  {isLoadingSlots && (
                    <span className="flex items-center gap-1 text-[#c9a87c] animate-pulse">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      <span className="text-[9px]">Checking slots...</span>
                    </span>
                  )}
                </div>

                {/* Time Slot Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-52 overflow-y-auto p-1.5 bg-[#0c0b0a]/70 border border-white/10 rounded-[1px]">
                  {BOOKING_SLOTS.map((slot) => {
                    const slotInfo = slotsState.find((s) => s.slot === slot);
                    const isPastTime =
                      formData.date && !isSlotAvailableTimeWise(formData.date, slot, 15);
                    const remainingSeats =
                      slotInfo && typeof slotInfo.remainingSeats === "number"
                        ? slotInfo.remainingSeats
                        : slotInfo && typeof slotInfo.spotsLeft === "number"
                        ? slotInfo.spotsLeft
                        : 3;
                    const isFullyBooked =
                      Boolean(
                        slotInfo &&
                          (slotInfo.status === "FULLY_BOOKED" ||
                            slotInfo.available === false ||
                            remainingSeats <= 0)
                      );
                    const isUnavailable = isSelectedDateTuesday || isPastTime || isFullyBooked;
                    const isSelected = formData.timeSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isUnavailable}
                        tabIndex={isUnavailable ? -1 : 0}
                        aria-disabled={isUnavailable}
                        aria-label={`${slot}, ${isFullyBooked ? "Fully booked" : isPastTime ? "Past slot" : `${remainingSeats} slots left`}`}
                        onClick={() => handleChange("timeSlot", slot)}
                        className={`relative px-1.5 py-1.5 text-xs font-mono uppercase tracking-wider border text-center transition-all min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[1px] ${
                          isSelected
                            ? "bg-[#c9a87c] text-[#0c0b0a] border-[#c9a87c] font-bold shadow-sm cursor-pointer ring-1 ring-[#c9a87c]"
                            : isUnavailable
                            ? isFullyBooked
                              ? "bg-[#1f1010]/70 text-white/30 border-red-950/40 cursor-not-allowed select-none"
                              : "bg-white/[0.02] text-white/20 border-white/5 line-through cursor-not-allowed select-none"
                            : "bg-white/[0.03] text-[#eae6df] border-white/10 hover:border-[#c9a87c]/70 hover:text-[#f5f2eb] cursor-pointer"
                        }`}
                      >
                        <span className="leading-tight text-[11px] sm:text-xs font-semibold">{slot}</span>
                        
                        {/* Availability Sub-label */}
                        {isSelectedDateTuesday ? null : isPastTime ? (
                          <span className="text-[7.5px] font-mono text-white/25 uppercase leading-none">PAST</span>
                        ) : isFullyBooked ? (
                          <span className="text-[8px] font-mono font-bold text-[#df9b8a] bg-[#2d110f] px-1 py-0.2 rounded-[1px] leading-none uppercase tracking-wider">
                            FULL
                          </span>
                        ) : remainingSeats === 1 ? (
                          <span
                            className={`text-[8px] font-sans font-semibold px-1 py-0.2 rounded leading-none transition-colors ${
                              isSelected
                                ? "text-[#0c0b0a] font-bold bg-white/30"
                                : "text-[#fca5a5] bg-[#450a0a]/80 border border-[#ef4444]/40 animate-pulse"
                            }`}
                          >
                            1 slot left
                          </span>
                        ) : remainingSeats === 2 ? (
                          <span
                            className={`text-[8px] font-sans font-medium leading-none ${
                              isSelected ? "text-[#0c0b0a]/85 font-semibold" : "text-[#c9a87c]/90"
                            }`}
                          >
                            2 slots left
                          </span>
                        ) : (
                          <span
                            className={`text-[8px] font-sans leading-none ${
                              isSelected ? "text-[#0c0b0a]/75" : "text-white/45"
                            }`}
                          >
                            3 slots left
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

              {/* Row 5: Special Notes */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="booking-notes"
                  className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#eae6df]/85 flex items-center justify-between"
                >
                  <span>SPECIAL REQUESTS OR PREFERENCES</span>
                  <span className="text-[9px] text-white/40 uppercase">OPTIONAL</span>
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="e.g. Specific hair length, sensitive scalp, event styling..."
                  className="w-full bg-[#0c0b0a]/90 text-[#f5f2eb] placeholder:text-[#eae6df]/30 text-xs font-sans px-3.5 py-2 border border-white/15 focus:border-[#c9a87c]/80 focus:ring-1 focus:ring-[#c9a87c]/30 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button (Step 1 -> Step 2 Review) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSelectedDateTuesday}
                  className="w-full py-3.5 px-6 bg-[#f5f2eb] hover:bg-[#c9a87c] text-[#0c0b0a] font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(245,242,235,0.12)] disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px]"
                >
                  <span>CONTINUE TO CONFIRMATION</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 2: Review Appointment & Pay ₹99 Advance                 */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-5 animate-fadeIn">
              
              {/* Summary Card */}
              <div className="bg-[#0c0b0a] border border-[#c9a87c]/30 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#c9a87c] tracking-[0.2em]">
                    APPOINTMENT SUMMARY
                  </span>
                  <span className="text-[10px] font-mono text-white/50">
                    ₹{BOOKING_ADVANCE} ADVANCE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase tracking-wider">Customer</span>
                    <span className="text-[#f5f2eb] font-sans font-medium text-sm">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase tracking-wider">Mobile</span>
                    <span className="text-[#f5f2eb] font-mono">+91 {formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase tracking-wider">Service</span>
                    <span className="text-[#c9a87c] font-sans font-medium">
                      {formData.service || formData.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase tracking-wider">Date &amp; Time</span>
                    <span className="text-[#f5f2eb]">
                      {formatDisplayDate(formData.date)}, {formData.timeSlot}
                    </span>
                  </div>
                </div>

                {formData.notes && (
                  <div className="pt-2 border-t border-white/10 text-[11px] text-white/70">
                    <span className="text-white/40 block text-[9px] font-mono uppercase tracking-wider">Notes</span>
                    <p className="mt-0.5 italic">&ldquo;{formData.notes}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Payment Breakdown */}
              <div className="bg-white/[0.02] border border-white/10 p-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-[#eae6df]/80">
                  <span>Appointment Reservation Fee</span>
                  <span>₹{BOOKING_ADVANCE}.00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#c9a87c] pt-1 border-t border-white/10">
                  <span className="font-semibold uppercase tracking-wider">Total Due Now</span>
                  <span className="text-sm font-bold">₹{BOOKING_ADVANCE}.00</span>
                </div>
                <p className="text-[10.5px] text-white/50 pt-1 leading-relaxed">
                  ✦ 100% of this ₹{BOOKING_ADVANCE} advance will be deducted from your final bill at the salon.
                </p>
              </div>

              {/* Error Notification during payment */}
              {paymentStatus === PAYMENT_STATUS.FAILED && paymentErrorMessage && (
                <div className="p-3.5 bg-[#2d110f] border border-[#df9b8a]/50 text-[#df9b8a] text-xs font-mono space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentErrorTitle}</span>
                  </div>
                  <p className="text-[11px] text-[#df9b8a]/90 leading-relaxed pl-5">
                    {paymentErrorMessage}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(1)}
                  className="py-3 px-4 border border-white/20 hover:border-white/40 text-[#eae6df] font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[46px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>EDIT DETAILS</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePayAdvance}
                  className="flex-1 py-3 px-4 bg-[#f5f2eb] hover:bg-[#c9a87c] text-[#0c0b0a] font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(245,242,235,0.12)] disabled:opacity-50 min-h-[46px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0c0b0a]" />
                      <span>PROCESSING ADVANCE...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-[#0c0b0a]" />
                      <span>PAY ₹{BOOKING_ADVANCE} &amp; CONFIRM</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: Confirmed Screen with Receipt Download               */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-5 text-center py-2 animate-fadeIn">
              
              <div className="w-14 h-14 mx-auto rounded-full bg-[#114b2d] border border-[#2d8f58] flex items-center justify-center text-[#e5fbe8] shadow-[0_0_30px_rgba(45,143,88,0.35)]">
                <CheckCircle2 className="w-7 h-7 text-[#e5fbe8]" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a87c]">
                  APPOINTMENT RESERVED
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] font-light">
                  See You Soon, {formData.name.split(" ")[0]}!
                </h3>
                <p className="text-xs text-[#eae6df]/70 font-sans max-w-sm mx-auto">
                  Your appointment is confirmed and your ₹{BOOKING_ADVANCE} advance has been recorded.
                </p>
              </div>

              {/* Reference Box */}
              <div className="bg-[#0c0b0a] border border-[#c9a87c]/40 p-4 text-left font-mono text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-white/40 uppercase">Booking ID</span>
                  <span className="text-[#c9a87c] font-bold text-sm">{transactionRef}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-white/40 uppercase">Service</span>
                  <span className="text-[#f5f2eb] font-sans">{formData.service || formData.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-white/40 uppercase">Schedule</span>
                  <span className="text-[#f5f2eb]">{formatDisplayDate(formData.date)}, {formData.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase">Advance Paid</span>
                  <span className="text-[#114b2d] bg-[#e5fbe8] px-1.5 py-0.5 rounded font-bold">₹{BOOKING_ADVANCE} PAID</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 max-w-sm mx-auto pt-2">
                
                {/* View / Download Official Receipt Button */}
                <a
                  href={`/api/bookings/${transactionRef}/receipt?phone=${encodeURIComponent(formData.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#c9a87c] hover:bg-[#dfbe93] text-[#0c0b0a] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>VIEW / PRINT ADVANCE RECEIPT</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* WhatsApp Confirmation Button */}
                <button
                  type="button"
                  onClick={handleOpenWhatsAppConfirmation}
                  className="w-full py-2.5 px-4 border border-white/20 hover:border-[#c9a87c] text-[#f5f2eb] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" color="#25D366" />
                  <span>WHATSAPP CONFIRMATION</span>
                </button>

                {/* Close Modal Button */}
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-2.5 px-4 text-white/50 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  DONE / CLOSE
                </button>
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

export default function BookingModal() {
  const { isOpen, bookingPayload, closeBooking } = useBooking();

  return (
    <AnimatePresence>
      {isOpen && (
        <BookingModalInner
          key={isOpen ? `${bookingPayload?.category || ""}-${bookingPayload?.service || ""}` : "closed"}
          bookingPayload={bookingPayload}
          closeBooking={closeBooking}
        />
      )}
    </AnimatePresence>
  );
}
