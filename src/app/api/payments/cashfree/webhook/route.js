import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { notifyConfirmedBooking } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    // 1. Verify Webhook Signature
    const isSignatureValid = verifyCashfreeWebhookSignature({
      rawBody,
      signature,
      timestamp,
    });

    if (!isSignatureValid) {
      console.warn("[WEBHOOK] Invalid Cashfree signature rejected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const eventType = event?.type;
    const orderData = event?.data?.order;
    const paymentData = event?.data?.payment;
    const cashfreeOrderId = orderData?.order_id;

    if (!cashfreeOrderId) {
      return NextResponse.json({ error: "Missing order_id in webhook" }, { status: 400 });
    }

    // 2. Find Booking by Cashfree Order ID
    const booking = await prisma.booking.findUnique({
      where: { cashfreeOrderId },
    });

    if (!booking) {
      console.warn(`[WEBHOOK] Booking not found for orderId: ${cashfreeOrderId}`);
      return NextResponse.json({ received: true, note: "Booking not found" }, { status: 200 });
    }

    // 3. Idempotency Check: If already confirmed & success, don't duplicate work
    if (booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS") {
      console.log(`[WEBHOOK] Booking ${booking.bookingCode} already confirmed. Idempotent return.`);
      return NextResponse.json({ received: true, status: "ALREADY_CONFIRMED" }, { status: 200 });
    }

    // 4. Handle Payment Success
    const isPaymentSuccess =
      eventType === "PAYMENT_SUCCESS_WEBHOOK" ||
      paymentData?.payment_status === "SUCCESS" ||
      orderData?.order_status === "PAID";

    if (isPaymentSuccess) {
      const paymentId = paymentData?.cf_payment_id ? String(paymentData.cf_payment_id) : null;

      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "SUCCESS",
          bookingStatus: "CONFIRMED",
          cashfreePaymentId: paymentId || booking.cashfreePaymentId,
        },
      });

      console.log(`[WEBHOOK] Booking ${booking.bookingCode} CONFIRMED via webhook.`);

      // Trigger notification helper
      await notifyConfirmedBooking(updatedBooking);

      return NextResponse.json({ received: true, status: "CONFIRMED" }, { status: 200 });
    }

    // 5. Handle Payment Failure / Dropped
    const isPaymentFailed =
      eventType === "PAYMENT_FAILED_WEBHOOK" ||
      eventType === "PAYMENT_USER_DROPPED_WEBHOOK" ||
      paymentData?.payment_status === "FAILED";

    if (isPaymentFailed) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "FAILED",
          bookingStatus: "CANCELLED",
        },
      });

      console.log(`[WEBHOOK] Booking ${booking.bookingCode} marked as FAILED/CANCELLED.`);
      return NextResponse.json({ received: true, status: "FAILED" }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[WEBHOOK] Error processing Cashfree webhook:", err);
    return NextResponse.json(
      { error: "Webhook internal processing error", details: err.message },
      { status: 500 }
    );
  }
}
