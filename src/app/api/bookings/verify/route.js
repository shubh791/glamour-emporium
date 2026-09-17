import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyRazorpayPaymentSignature,
  fetchRazorpayPayment,
  fetchRazorpayOrder,
} from "@/lib/razorpay";
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
    } = body || {};

    if (!bookingCode && !razorpayOrderId) {
      return NextResponse.json(
        { error: "bookingCode or razorpayOrderId is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          bookingCode ? { bookingCode } : undefined,
          razorpayOrderId ? { razorpayOrderId } : undefined,
        ].filter(Boolean),
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 1. If already confirmed in DB, return immediately (idempotency)
    if (booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS") {
      return NextResponse.json({
        success: true,
        isConfirmed: true,
        booking,
      });
    }

    // 2. Cryptographic HMAC SHA256 Signature Verification
    let isSignatureValid = false;
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      isSignatureValid = verifyRazorpayPaymentSignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });
    }

    // 3. Direct Server API Fallback Check (if client signature wasn't provided or needed verification)
    let isPaymentCaptured = isSignatureValid;
    if (!isPaymentCaptured && razorpayPaymentId) {
      try {
        const paymentData = await fetchRazorpayPayment(razorpayPaymentId);
        if (
          paymentData &&
          paymentData.status === "captured" &&
          paymentData.order_id === (razorpayOrderId || booking.razorpayOrderId)
        ) {
          isPaymentCaptured = true;
          console.log(
            `[Verify Route] Fallback API check confirmed payment ${razorpayPaymentId} for booking ${booking.bookingCode}`
          );
        }
      } catch (fetchErr) {
        console.warn("[Verify Route] Razorpay direct check warning:", fetchErr.message);
      }
    }

    if (isPaymentCaptured) {
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "SUCCESS",
          bookingStatus: "CONFIRMED",
          razorpayPaymentId: razorpayPaymentId || booking.razorpayPaymentId,
          razorpaySignature: razorpaySignature || booking.razorpaySignature,
        },
      });

      console.log(`[Verify Route] Booking ${updatedBooking.bookingCode} CONFIRMED.`);

      // Send transactional confirmations
      await notifyConfirmedBooking(updatedBooking);

      return NextResponse.json({
        success: true,
        isConfirmed: true,
        booking: updatedBooking,
      });
    }

    return NextResponse.json(
      {
        success: false,
        isConfirmed: false,
        error: "Payment could not be verified. Signature mismatch or payment not captured.",
        booking,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("[Verify Route] Booking verification error:", err);
    return NextResponse.json(
      { error: "Verification error", details: err.message },
      { status: 500 }
    );
  }
}
