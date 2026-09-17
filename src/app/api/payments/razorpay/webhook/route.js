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

    // 2. Handle Payment Success Events
    const isSuccess =
      event === "payment.captured" ||
      event === "order.paid" ||
      paymentEntity?.status === "captured";

    if (isSuccess) {
      const notes = orderEntity?.notes || paymentEntity?.notes || {};
      let booking = await prisma.booking.findFirst({
        where: {
          OR: [
            razorpayOrderId ? { razorpayOrderId } : undefined,
            razorpayPaymentId ? { razorpayPaymentId } : undefined,
            notes.bookingCode ? { bookingCode: notes.bookingCode } : undefined,
          ].filter(Boolean),
        },
      });

      if (booking) {
        if (booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS") {
          console.log(`[Razorpay Webhook] Booking ${booking.bookingCode} already confirmed.`);
          return NextResponse.json(
            { received: true, status: "ALREADY_CONFIRMED" },
            { status: 200 }
          );
        }

        booking = await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: "SUCCESS",
            bookingStatus: "CONFIRMED",
            razorpayOrderId: razorpayOrderId || booking.razorpayOrderId,
            razorpayPaymentId: razorpayPaymentId || booking.razorpayPaymentId,
          },
        });
      } else {
        // Create confirmed booking from order metadata notes
        booking = await prisma.booking.create({
          data: {
            bookingCode: notes.bookingCode || `GE-${Date.now().toString(36).toUpperCase()}`,
            customerName: notes.customerName || "Salon Customer",
            phone: notes.customerPhone || "0000000000",
            serviceCategory: notes.serviceCategory || "Hair & Styling",
            service: notes.service || null,
            bookingDate: notes.bookingDate || new Date().toISOString().split("T")[0],
            bookingTime: notes.bookingTime || "10:00 AM",
            notes: notes.notes || null,
            amount: 99,
            currency: "INR",
            paymentStatus: "SUCCESS",
            bookingStatus: "CONFIRMED",
            razorpayOrderId,
            razorpayPaymentId,
          },
        });
      }

      console.log(`[Razorpay Webhook] Booking ${booking.bookingCode} confirmed via webhook.`);

      // Trigger notification service
      try {
        await notifyConfirmedBooking(booking);
      } catch (notifyErr) {
        console.warn("[Razorpay Webhook] Notification warning:", notifyErr.message);
      }

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
