import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { notifyConfirmedBooking } from "@/lib/notifications";
import { sanitizePhone, confirmBookingWithCapacityCheck } from "@/lib/bookingService";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // 1. Cryptographic Webhook Signature Verification
    const isSignatureValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isSignatureValid) {
      console.warn("[Razorpay Webhook] Invalid signature rejected.");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const event = payload?.event;
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;

    console.log("[Razorpay Webhook] Event received:", {
      event,
      razorpayOrderId,
      razorpayPaymentId,
    });

    if (!razorpayOrderId) {
      return NextResponse.json({ error: "Missing order_id in webhook" }, { status: 400 });
    }

    // 2. Handle Payment Success Events
    const isSuccess =
      event === "payment.captured" ||
      event === "order.paid" ||
      paymentEntity?.status === "captured";

    if (isSuccess) {
      const notes = orderEntity?.notes || paymentEntity?.notes || {};
      
      const confirmationResult = await confirmBookingWithCapacityCheck({
        bookingCode: notes.bookingCode,
        razorpayOrderId,
        razorpayPaymentId,
        customerName: notes.customerName || "Salon Customer",
        phone: notes.customerPhone ? sanitizePhone(notes.customerPhone) : "0000000000",
        serviceCategory: notes.serviceCategory || "Hair & Styling",
        service: notes.service || null,
        bookingDate: notes.bookingDate,
        bookingTime: notes.bookingTime,
        notes: notes.notes || null,
      });

      if (!confirmationResult.success || !confirmationResult.isConfirmed) {
        console.warn("[Razorpay Webhook] Booking confirmation note:", confirmationResult);
        return NextResponse.json(
          { received: true, status: confirmationResult.code || "REJECTED" },
          { status: 200 }
        );
      }

      if (confirmationResult.alreadyConfirmed) {
        console.log(`[Razorpay Webhook] Booking ${confirmationResult.booking.bookingCode} was already confirmed.`);
        return NextResponse.json(
          { received: true, status: "ALREADY_CONFIRMED" },
          { status: 200 }
        );
      }

      console.log(`[Razorpay Webhook] Booking ${confirmationResult.booking.bookingCode} confirmed via webhook.`);

      // Trigger notification service
      try {
        await notifyConfirmedBooking(confirmationResult.booking);
      } catch (notifyErr) {
        console.warn("[Razorpay Webhook] Notification warning:", notifyErr.message);
      }

      return NextResponse.json({ received: true, status: "CONFIRMED" }, { status: 200 });
    }

    // 3. Handle Payment Failure Events
    const isFailed = event === "payment.failed" || paymentEntity?.status === "failed";
    if (isFailed && razorpayOrderId) {
      const booking = await prisma.booking.findFirst({
        where: { razorpayOrderId },
      });
      if (booking && booking.bookingStatus === "PENDING_PAYMENT") {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: "FAILED",
          },
        });
        console.log(`[Razorpay Webhook] Booking ${booking.bookingCode} marked as FAILED.`);
      }
      return NextResponse.json({ received: true, status: "FAILED" }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[Razorpay Webhook] Processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing error", details: err.message },
      { status: 500 }
    );
  }
}
