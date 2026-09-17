import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateBookingCode,
  sanitizePhone,
  isValidPhone,
  isSlotAvailable,
  HOLD_DURATION_MINUTES,
} from "@/lib/bookingService";
import { createRazorpayOrder, getRazorpayConfig } from "@/lib/razorpay";
import { isTuesday, isPastDate, BOOKING_ADVANCE } from "@/data/bookingConfig";

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
        { error: "Please enter a valid 10-digit Indian phone number" },
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
        { error: "Glamour Emporium is closed every Tuesday. Please choose another date." },
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

    // 4. Check Slot Availability
    const available = await isSlotAvailable(bookingDate, bookingTime);
    if (!available) {
      return NextResponse.json(
        {
          error: "This time slot is no longer available. Please choose another slot.",
          code: "SLOT_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    // 5. Generate Unique Booking Code
    let bookingCode = generateBookingCode();
    let isCodeUnique = false;
    let attempts = 0;
    while (!isCodeUnique && attempts < 5) {
      const existing = await prisma.booking.findUnique({ where: { bookingCode } });
      if (!existing) {
        isCodeUnique = true;
      } else {
        bookingCode = generateBookingCode();
        attempts++;
      }
    }

    // 6. Calculate 10-minute hold expiration
    const slotHoldExpiresAt = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000);
    const amount = BOOKING_ADVANCE; // Force 99 INR server-side

    // 7. Create Temporary Booking Record in Database
    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        customerName: customerName.trim(),
        phone: cleanedPhone,
        serviceCategory,
        service: service || null,
        bookingDate,
        bookingTime,
        notes: notes ? notes.trim() : null,
        amount,
        currency: "INR",
        paymentStatus: "PENDING",
        bookingStatus: "PENDING_PAYMENT",
        slotHoldExpiresAt,
      },
    });

    console.log("[Create Booking Route] Pending booking created in DB:", {
      bookingCode,
      date: bookingDate,
      slot: bookingTime,
      phoneLast4: cleanedPhone.slice(-4),
    });

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
        serviceCategory,
        service: service || serviceCategory,
        bookingDate,
        bookingTime,
      },
    });

    if (!razorpayOrderResult.success || !razorpayOrderResult.orderId) {
      console.error("[Create Booking Route] Razorpay order creation failed:", {
        bookingCode: booking.bookingCode,
        error: razorpayOrderResult.error,
        code: razorpayOrderResult.code,
      });

      // Delete temporary booking on immediate order creation failure
      await prisma.booking.delete({ where: { id: booking.id } }).catch(() => {});

      return NextResponse.json(
        {
          error: "We couldn't start the secure payment session. Please try again.",
          details: razorpayOrderResult.error || "Failed to initialize Razorpay order",
          code: razorpayOrderResult.code || "PAYMENT_INIT_FAILED",
        },
        { status: 502 }
      );
    }

    // Link Razorpay Order ID to the booking record
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        razorpayOrderId: razorpayOrderResult.orderId,
      },
    });

    console.log("[Create Booking Route] Razorpay order ready:", {
      bookingCode: booking.bookingCode,
      razorpayOrderId: razorpayOrderResult.orderId,
      amountPaise: razorpayOrderResult.amount,
    });

    return NextResponse.json({
      success: true,
      bookingCode: booking.bookingCode,
      razorpayOrderId: razorpayOrderResult.orderId,
      keyId: razorpayOrderResult.keyId,
      amount: razorpayOrderResult.amount, // in paise (9900)
      amountInRupees: amount, // ₹99
      currency: razorpayOrderResult.currency || "INR",
      slotHoldExpiresAt: slotHoldExpiresAt.toISOString(),
      customerName: booking.customerName,
      phone: booking.phone,
      service: booking.service || booking.serviceCategory,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
    });
  } catch (err) {
    console.error("[Create Booking Route] Unhandled exception:", err);
    return NextResponse.json(
      {
        error: "Internal server error while processing booking",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
