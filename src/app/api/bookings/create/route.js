import { NextResponse } from "next/server";
import {
  generateBookingCode,
  sanitizePhone,
  isValidPhone,
  isSlotAvailable,
} from "@/lib/bookingService";
import { createRazorpayOrder, getRazorpayConfig } from "@/lib/razorpay";
import {
  isTuesday,
  isPastDate,
  isSlotAvailableTimeWise,
  BOOKING_ADVANCE,
} from "@/data/bookingConfig";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      phone,
      serviceCategory,
      service,
      bookingDate,
      bookingTime,
      notes,
    } = body || {};

    // 1. Validate required customer name
    if (!customerName || !customerName.trim()) {
      return NextResponse.json(
        { error: "Please provide your full name for the booking.", code: "INVALID_NAME" },
        { status: 400 }
      );
    }

    // 2. Validate required 10-digit Indian phone number
    const rawPhone = customerPhone || phone || "";
    const cleanedPhone = sanitizePhone(rawPhone);
    if (!isValidPhone(cleanedPhone)) {
      return NextResponse.json(
        {
          error: "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).",
          code: "INVALID_PHONE",
        },
        { status: 400 }
      );
    }

    // 3. Validate service details
    if (!serviceCategory) {
      return NextResponse.json(
        { error: "Please select a service category.", code: "INVALID_CATEGORY" },
        { status: 400 }
      );
    }

    if (!bookingDate) {
      return NextResponse.json(
        { error: "Please select an appointment date.", code: "INVALID_DATE" },
        { status: 400 }
      );
    }

    if (!bookingTime) {
      return NextResponse.json(
        { error: "Please select an appointment time slot.", code: "INVALID_TIME" },
        { status: 400 }
      );
    }

    // 4. Enforce Tuesday Closure Rule (Server-side defense)
    if (isTuesday(bookingDate)) {
      return NextResponse.json(
        { error: "The salon is closed every Tuesday. Please select another date.", code: "TUESDAY_CLOSED" },
        { status: 400 }
      );
    }

    // 5. Reject Past Dates
    if (isPastDate(bookingDate)) {
      return NextResponse.json(
        { error: "Please select today or a future date for your appointment.", code: "PAST_DATE" },
        { status: 400 }
      );
    }

    // 6. Validate 15-minute lead buffer if date is today
    if (!isSlotAvailableTimeWise(bookingDate, bookingTime, 15)) {
      return NextResponse.json(
        {
          error: "This time slot is no longer available today. Please choose another time slot.",
          code: "SLOT_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    // 7. Check Slot Availability in Database (Capacity < 3)
    const available = await isSlotAvailable(bookingDate, bookingTime);
    if (!available) {
      return NextResponse.json(
        {
          error: "This time slot just became full. Please select another time.",
          code: "SLOT_FULL",
        },
        { status: 409 }
      );
    }

    // 8. Check Razorpay Configuration
    const razorpayConfig = getRazorpayConfig();
    if (!razorpayConfig.isConfigured) {
      return NextResponse.json(
        {
          error:
            "Razorpay keys are not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file.",
          code: "RAZORPAY_KEYS_NOT_CONFIGURED",
        },
        { status: 400 }
      );
    }

    // 9. Generate Unique Booking Code for Tracking & Receipt
    const bookingCode = generateBookingCode();
    const amount = BOOKING_ADVANCE; // ₹99

    // 10. Create Razorpay Order on Server
    const razorpayOrderResult = await createRazorpayOrder({
      bookingCode,
      orderAmount: amount,
      customerDetails: {
        customerName: customerName.trim(),
        customerPhone: cleanedPhone,
        customerEmail: "customer@glamouremporium.in",
      },
      notes: {
        bookingCode,
        customerName: customerName.trim(),
        customerPhone: cleanedPhone,
        serviceCategory,
        service: service || serviceCategory,
        bookingDate,
        bookingTime,
        notes: notes ? String(notes).trim().slice(0, 200) : "",
      },
    });

    if (!razorpayOrderResult.success || !razorpayOrderResult.orderId) {
      console.error("[Create Booking Route] Razorpay order creation failed:", {
        bookingCode,
        error: razorpayOrderResult.error,
        code: razorpayOrderResult.code,
      });

      return NextResponse.json(
        {
          error: razorpayOrderResult.error || "We couldn't start the secure payment session. Please try again.",
          code: razorpayOrderResult.code || "PAYMENT_INIT_FAILED",
        },
        { status: razorpayOrderResult.code === "RAZORPAY_KEYS_NOT_CONFIGURED" ? 400 : 502 }
      );
    }

    console.log("[Create Booking Route] Razorpay order created successfully:", {
      bookingCode,
      razorpayOrderId: razorpayOrderResult.orderId,
      amountPaise: razorpayOrderResult.amount,
      phone: cleanedPhone,
    });

    return NextResponse.json({
      success: true,
      bookingCode,
      razorpayOrderId: razorpayOrderResult.orderId,
      keyId: razorpayOrderResult.keyId,
      amount: razorpayOrderResult.amount, // in paise (9900)
      amountInRupees: amount, // ₹99
      currency: razorpayOrderResult.currency || "INR",
      customerName: customerName.trim(),
      phone: cleanedPhone,
      serviceCategory,
      service: service || serviceCategory,
      bookingDate,
      bookingTime,
      notes: notes ? notes.trim() : null,
    });
  } catch (err) {
    console.error("[Create Booking Route] Unhandled exception:", err);
    return NextResponse.json(
      {
        error: "Unable to process booking request. Please check your details and try again.",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
