import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyRazorpayPaymentSignature,
  fetchRazorpayPayment,
  fetchRazorpayOrder,
} from "@/lib/razorpay";
import { generateBookingCode, sanitizePhone } from "@/lib/bookingService";
import { notifyConfirmedBooking } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      bookingCode,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerName,
      phone,
      serviceCategory,
      service,
      bookingDate,
      bookingTime,
      notes,
    } = body || {};

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { error: "razorpayOrderId and razorpayPaymentId are required" },
        { status: 400 }
      );
    }

    // 1. Cryptographic HMAC SHA256 Signature Verification
    let isSignatureValid = false;
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      isSignatureValid = verifyRazorpayPaymentSignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });
    }

    // 2. Direct Server API Fallback Check (if client signature wasn't provided or failed local test)
    let isPaymentCaptured = isSignatureValid;
    if (!isPaymentCaptured && razorpayPaymentId) {
      try {
        const paymentData = await fetchRazorpayPayment(razorpayPaymentId);
        if (
          paymentData &&
          (paymentData.status === "captured" || paymentData.status === "authorized") &&
          paymentData.order_id === razorpayOrderId
        ) {
          isPaymentCaptured = true;
          console.log(
            `[Verify Route] Fallback API check confirmed payment ${razorpayPaymentId} for order ${razorpayOrderId}`
          );
        }
      } catch (fetchErr) {
        console.warn("[Verify Route] Razorpay direct check warning:", fetchErr.message);
      }
    }

    if (!isPaymentCaptured) {
      return NextResponse.json(
        {
          success: false,
          isConfirmed: false,
          error: "Payment could not be verified. Signature mismatch or payment not captured.",
        },
        { status: 400 }
      );
    }

    // 3. Check for existing booking (Idempotency check)
    let booking = await prisma.booking.findFirst({
      where: {
        OR: [
          razorpayOrderId ? { razorpayOrderId } : undefined,
          razorpayPaymentId ? { razorpayPaymentId } : undefined,
          bookingCode ? { bookingCode } : undefined,
        ].filter(Boolean),
      },
    });

    if (booking) {
      // If already confirmed in DB, return immediately
      if (booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS") {
        return NextResponse.json({
          success: true,
          isConfirmed: true,
          booking,
        });
      }

      // Update to confirmed
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "SUCCESS",
          bookingStatus: "CONFIRMED",
          razorpayOrderId: razorpayOrderId || booking.razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId || booking.razorpayPaymentId,
          razorpaySignature: razorpaySignature || booking.razorpaySignature,
        },
      });
    } else {
      // 4. Create Confirmed Booking in Database upon verified payment
      const finalBookingCode = bookingCode || generateBookingCode();
      const cleanedPhone = sanitizePhone(phone);

      booking = await prisma.booking.create({
        data: {
          bookingCode: finalBookingCode,
          customerName: (customerName || "Salon Customer").trim(),
          phone: cleanedPhone,
          serviceCategory: serviceCategory || "Hair & Styling",
          service: service || null,
          bookingDate: bookingDate || new Date().toISOString().split("T")[0],
          bookingTime: bookingTime || "10:00 AM",
          notes: notes ? String(notes).trim() : null,
          amount: 99,
          currency: "INR",
          paymentStatus: "SUCCESS",
          bookingStatus: "CONFIRMED",
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature: razorpaySignature || null,
        },
      });
    }

    console.log(`[Verify Route] Booking ${booking.bookingCode} CONFIRMED.`);

    // Send transactional confirmations
    try {
      await notifyConfirmedBooking(booking);
    } catch (notifyErr) {
      console.warn("[Verify Route] Notification warning:", notifyErr.message);
    }

    return NextResponse.json({
      success: true,
      isConfirmed: true,
      booking,
    });
  } catch (err) {
    console.error("[Verify Route] Booking verification error:", err);
    return NextResponse.json(
      { error: "Verification error", details: err.message },
      { status: 500 }
    );
  }
}
