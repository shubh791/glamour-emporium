import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizePhone, isValidPhone } from "@/lib/bookingService";

export const dynamic = "force-dynamic";

// Simple in-memory IP rate limiter: max 20 lookups per minute per IP
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;

  const record = rateLimitMap.get(ip);
  if (!record || now - record.startTime > windowMs) {
    rateLimitMap.set(ip, { startTime: now, count: 1 });
    return false;
  }

  record.count++;
  if (record.count > maxRequests) {
    return true;
  }
  return false;
}

function maskName(name = "") {
  const trimmed = String(name).trim();
  if (!trimmed) return "Salon Customer";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    const single = parts[0];
    if (single.length <= 2) return single;
    return single.slice(0, 2) + "*".repeat(Math.min(single.length - 2, 4));
  }
  return `${parts[0]} ${parts[1].charAt(0)}***`;
}

function maskPaymentId(paymentId = "") {
  if (!paymentId) return null;
  const clean = String(paymentId).trim();
  if (clean.length <= 8) return "pay_••••••••";
  return `pay_••••${clean.slice(-4)}`;
}

export async function POST(request) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown-ip";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          error: "Too many search requests. Please wait a minute and try again.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { phone } = body || {};

    const cleanPhone = sanitizePhone(phone);

    if (!cleanPhone) {
      return NextResponse.json(
        { error: "Mobile number is required.", code: "PHONE_REQUIRED" },
        { status: 400 }
      );
    }

    if (cleanPhone.length < 10) {
      const remaining = 10 - cleanPhone.length;
      return NextResponse.json(
        {
          error: `Enter the remaining ${remaining} digit${remaining > 1 ? "s" : ""}.`,
          code: "INCOMPLETE_PHONE",
        },
        { status: 400 }
      );
    }

    if (!isValidPhone(cleanPhone)) {
      return NextResponse.json(
        {
          error: "Enter a valid 10-digit Indian mobile number.",
          code: "INVALID_PHONE",
        },
        { status: 400 }
      );
    }

    // Query all bookings for this mobile number, newest first
    const bookings = await prisma.booking.findMany({
      where: {
        phone: cleanPhone,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        bookingCode: true,
        customerName: true,
        serviceCategory: true,
        service: true,
        bookingDate: true,
        bookingTime: true,
        amount: true,
        currency: true,
        paymentStatus: true,
        bookingStatus: true,
        razorpayPaymentId: true,
        createdAt: true,
      },
    });

    // Sanitize and mask all customer records before returning
    const sanitizedBookings = bookings.map((b) => ({
      bookingCode: b.bookingCode,
      customerName: maskName(b.customerName),
      serviceCategory: b.serviceCategory,
      service: b.service,
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      amount: b.amount,
      currency: b.currency,
      paymentStatus: b.paymentStatus,
      bookingStatus: b.bookingStatus,
      maskedRazorpayPaymentId: maskPaymentId(b.razorpayPaymentId),
      isConfirmed: b.bookingStatus === "CONFIRMED" && b.paymentStatus === "SUCCESS",
      createdAt: b.createdAt,
    }));

    return NextResponse.json({
      success: true,
      phone: cleanPhone,
      count: sanitizedBookings.length,
      bookings: sanitizedBookings,
    });
  } catch (err) {
    console.error("[Find Booking Route Error]", err);
    return NextResponse.json(
      { error: "Unable to look up bookings. Please check your connection and try again." },
      { status: 500 }
    );
  }
}
