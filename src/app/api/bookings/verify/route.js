import { NextResponse } from "next/server";
import {
  verifyRazorpayPaymentSignature,
  fetchRazorpayPayment,
  getRazorpayConfig,
} from "@/lib/razorpay";
import {
  sanitizePhone,
  confirmBookingWithCapacityCheck,
} from "@/lib/bookingService";
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
      customerPhone,
      phone,
      serviceCategory,
      service,
      bookingDate,
      bookingTime,
      notes,
    } = body || {};

    const rawPhone = customerPhone || phone || "";
    const cleanedPhone = sanitizePhone(rawPhone);

    const { keyId, keySecret, isConfigured } = getRazorpayConfig();

    // Safe diagnostics
    console.log("[Verify Route Diagnostics]", {
      hasKeyId: Boolean(keyId),
      hasSecret: Boolean(keySecret),
      isConfigured,
      receivedBookingCode: bookingCode || null,
      receivedOrderId: razorpayOrderId || null,
      receivedPaymentId: razorpayPaymentId || null,
      hasSignature: Boolean(razorpaySignature),
      phone: cleanedPhone || null,
    });

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        {
          success: false,
          isConfirmed: false,
          error: "Payment could not be verified. Missing payment reference.",
          code: "MISSING_PAYMENT_REF",
        },
        { status: 400 }
      );
    }

    // 1. Cryptographic HMAC SHA256 Signature Verification
    let isSignatureValid = false;
    if (razorpaySignature) {
      isSignatureValid = verifyRazorpayPaymentSignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });
    }

    // 2. Direct Server API Fallback Check (if signature check wasn't possible or failed)
    let isPaymentVerified = isSignatureValid;
    if (!isPaymentVerified && isConfigured) {
      try {
        console.log(`[Verify Route] Checking payment directly with Razorpay API for ${razorpayPaymentId}...`);
        const paymentData = await fetchRazorpayPayment(razorpayPaymentId);
        if (
          paymentData &&
          (paymentData.status === "captured" || paymentData.status === "authorized") &&
          paymentData.order_id === razorpayOrderId
        ) {
          isPaymentVerified = true;
          console.log(
            `[Verify Route] API direct check confirmed payment ${razorpayPaymentId} for order ${razorpayOrderId} (status: ${paymentData.status})`
          );
        } else {
          console.warn(
            `[Verify Route] Direct check failed. Status: ${paymentData?.status}, order: ${paymentData?.order_id}`
          );
        }
      } catch (fetchErr) {
        console.warn("[Verify Route] Razorpay direct check warning:", fetchErr.message);
      }
    }

    if (!isPaymentVerified) {
      console.warn("[Verify Route] Payment verification rejected for order:", razorpayOrderId);
      return NextResponse.json(
        {
          success: false,
          isConfirmed: false,
          error: "Payment could not be verified. Please try again.",
          code: "PAYMENT_NOT_VERIFIED",
        },
        { status: 400 }
      );
    }

    // 3. Atomically Confirm Booking Under Concurrency & Capacity Protection
    const confirmationResult = await confirmBookingWithCapacityCheck({
      bookingCode,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || null,
      customerName: (customerName || "Salon Customer").trim(),
      phone: cleanedPhone || "0000000000",
      serviceCategory: serviceCategory || "Hair & Styling",
      service: service || null,
      bookingDate,
      bookingTime,
      notes: notes ? String(notes).trim() : null,
    });

    if (!confirmationResult.success || !confirmationResult.isConfirmed) {
      console.warn("[Verify Route] Booking confirmation failed:", confirmationResult);
      return NextResponse.json(
        {
          success: false,
          isConfirmed: false,
          error: confirmationResult.error || "This time slot just became full. Please select another time.",
          code: confirmationResult.code || "SLOT_FULL",
        },
        { status: confirmationResult.code === "SLOT_FULL" ? 409 : 400 }
      );
    }

    console.log(`[Verify Route] Booking ${confirmationResult.booking.bookingCode} confirmed successfully.`);

    // 4. Send Owner & Customer Notifications (Deduplicated)
    if (!confirmationResult.alreadyConfirmed) {
      try {
        await notifyConfirmedBooking(confirmationResult.booking);
      } catch (notifyErr) {
        console.warn("[Verify Route] Notification warning:", notifyErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      isConfirmed: true,
      booking: confirmationResult.booking,
    });
  } catch (err) {
    console.error("[Verify Route] Unexpected error during booking confirmation:", err);
    return NextResponse.json(
      {
        success: false,
        isConfirmed: false,
        error: "Payment could not be verified. Please try again.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
