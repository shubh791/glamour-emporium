import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fetchCashfreeOrder, fetchCashfreeOrderPayments } from "@/lib/cashfree";
import { notifyConfirmedBooking } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { bookingCode, cashfreeOrderId } = await request.json();

    if (!bookingCode && !cashfreeOrderId) {
      return NextResponse.json(
        { error: "bookingCode or cashfreeOrderId is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          bookingCode ? { bookingCode } : undefined,
          cashfreeOrderId ? { cashfreeOrderId } : undefined,
        ].filter(Boolean),
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If already confirmed in DB, return immediately
    if (booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS") {
      return NextResponse.json({
        success: true,
        isConfirmed: true,
        booking,
      });
    }

    // Verify order directly with Cashfree PG API as authoritative backup
    if (booking.cashfreeOrderId) {
      try {
        const orderData = await fetchCashfreeOrder(booking.cashfreeOrderId);
        const payments = await fetchCashfreeOrderPayments(booking.cashfreeOrderId);
        const successPayment = payments.find((p) => p.payment_status === "SUCCESS");

        if (orderData.order_status === "PAID" || successPayment) {
          const paymentId = successPayment?.cf_payment_id
            ? String(successPayment.cf_payment_id)
            : null;

          const updatedBooking = await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: "SUCCESS",
              bookingStatus: "CONFIRMED",
              cashfreePaymentId: paymentId || booking.cashfreePaymentId,
            },
          });

          await notifyConfirmedBooking(updatedBooking);

          return NextResponse.json({
            success: true,
            isConfirmed: true,
            booking: updatedBooking,
          });
        }
      } catch (cfErr) {
        console.warn("Cashfree verify check warning:", cfErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      isConfirmed: false,
      booking,
    });
  } catch (err) {
    console.error("Booking verification error:", err);
    return NextResponse.json(
      { error: "Verification error", details: err.message },
      { status: 500 }
    );
  }
}
