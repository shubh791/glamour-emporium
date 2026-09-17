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
      phone,
      serviceCategory,
      service,
      bookingDate,
      bookingTime,
      notes,
    } = body || {};

    // 1. Validate required fields
    if (!customerName || !customerName.trim()) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    const cleanedPhone = sanitizePhone(phone);
    if (!isValidPhone(cleanedPhone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!serviceCategory) {
      return NextResponse.json(
        { error: "Service category is required" },
        { status: 400 }
      );
    }

    if (!bookingDate) {
      return NextResponse.json(
        { error: "Booking date is required" },
        { status: 400 }
      );
    }

    if (!bookingTime) {
      return NextResponse.json(
        { error: "Time slot is required" },
        { status: 400 }
      );
    }

    // 2. Enforce Tuesday Closure Rule (Server-side defense)
    if (isTuesday(bookingDate)) {
      return NextResponse.json(
        { error: "Salon is closed every Tuesday. Please select another date." },
        { status: 400 }
      );
    }

    // 3. Reject Past Dates
    if (isPastDate(bookingDate)) {
      return NextResponse.json(
        { error: "Please select today or a future date." },
        { status: 400 }
      );
    }

    // 4. Validate 15-minute lead buffer if date is today
    if (!isSlotAvailableTimeWise(bookingDate, bookingTime, 15)) {
      return NextResponse.json(
        {
          error: "This time slot is no longer available today. Please select another slot.",
          code: "SLOT_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    // 5. Check Slot Availability in Database (Capacity < 3)
    const available = await isSlotAvailable(bookingDate, bookingTime);
    if (!available) {
      return NextResponse.json(
        {
          error: "This time slot is already fully booked. Please choose another slot.",
          code: "SLOT_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    // 6. Check Razorpay Configuration
    const razorpayConfig = getRazorpayConfig();
    if (!razorpayConfig.isConfigured) {
      return NextResponse.json(
        {
          error:
            "Razorpay test keys are not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file to test checkout.",
          code: "RAZORPAY_KEYS_NOT_CONFIGURED",
        },
        { status: 400 }
      );
    }

    // 7. Generate Unique Booking Code for Receipt
    const bookingCode = generateBookingCode();
    const amount = BOOKING_ADVANCE; // ₹99

    // 8. Create Razorpay Order on Server
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
