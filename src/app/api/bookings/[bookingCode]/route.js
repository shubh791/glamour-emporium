import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { bookingCode } = await params;

    if (!bookingCode) {
      return NextResponse.json({ error: "Booking code is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      select: {
        bookingCode: true,
        customerName: true,
        phone: true,
        serviceCategory: true,
        service: true,
        bookingDate: true,
        bookingTime: true,
        notes: true,
        amount: true,
        currency: true,
        paymentStatus: true,
        bookingStatus: true,
        cashfreePaymentId: true,
        createdAt: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        isConfirmed: booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS",
      },
    });
  } catch (err) {
    console.error("Booking lookup API error:", err);
    return NextResponse.json(
      { error: "Failed to look up booking", details: err.message },
      { status: 500 }
    );
  }
}
