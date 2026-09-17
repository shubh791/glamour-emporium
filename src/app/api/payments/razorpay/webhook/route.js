import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { notifyConfirmedBooking } from "@/lib/notifications";

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

    // 2. Find Associated Booking
    const booking = await prisma.booking.findUnique({
      where: { razorpayOrderId },
    });

    if (!booking) {
      console.warn(`[Razorpay Webhook] Booking not found for orderId: ${razorpayOrderId}`);
      return NextResponse.json(
        { received: true, note: "Booking record not found" },
        { status: 200 }
      );
    }

    // 3. Idempotency Check: Don't duplicate if already confirmed
    if (booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS") {
      console.log(`[Razorpay Webhook] Booking ${booking.bookingCode} already confirmed.`);
      return NextResponse.json(
        { received: true, status: "ALREADY_CONFIRMED" },
        { status: 200 }
      );
    }

    // 4. Handle Payment Success Events
    const isSuccess =
      event === "payment.captured" ||
      event === "order.paid" ||
      paymentEntity?.status === "captured";

    if (isSuccess) {
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "SUCCESS",
          bookingStatus: "CONFIRMED",
          razorpayPaymentId: razorpayPaymentId || booking.razorpayPaymentId,
        },
      });

      console.log(`[Razorpay Webhook] Booking ${booking.bookingCode} confirmed via webhook.`);

      // Trigger notification service
      await notifyConfirmedBooking(updatedBooking);

      return NextResponse.json({ received: true, status: "CONFIRMED" }, { status: 200 });
    }

    // 5. Handle Payment Failure Events
    const isFailed = event === "payment.failed" || paymentEntity?.status === "failed";
    if (isFailed && booking.bookingStatus === "PENDING_PAYMENT") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "FAILED",
        },
      });

      console.log(`[Razorpay Webhook] Booking ${booking.bookingCode} marked as FAILED.`);
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
