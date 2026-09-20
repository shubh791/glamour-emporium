import prisma from "@/lib/prisma";
import { sanitizePhone } from "@/lib/bookingService";
import { generateReceiptHtml } from "@/lib/receipt";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, bookingCode } = body || {};

    const cleanCode = String(bookingCode || "").trim().toUpperCase();
    const cleanPhone = sanitizePhone(phone);

    if (!cleanCode || !cleanPhone) {
      return new Response("<h1>Missing booking reference or phone number</h1>", {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        bookingCode: cleanCode,
        phone: cleanPhone,
      },
    });

    if (!booking) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head><title>Receipt Not Found</title></head>
        <body style="background:#0c0b0a; color:#fff; font-family:sans-serif; text-align:center; padding:50px;">
          <h2>Receipt Not Found</h2>
          <p>No booking record matched this reference and mobile number.</p>
        </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (booking.bookingStatus !== "CONFIRMED" || booking.paymentStatus !== "SUCCESS") {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head><title>Receipt Unavailable</title></head>
        <body style="background:#0c0b0a; color:#fff; font-family:sans-serif; text-align:center; padding:50px;">
          <h2>Payment Not Completed</h2>
          <p>Receipts are available only after successful payment confirmation.</p>
        </body>
        </html>`,
        { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const html = generateReceiptHtml(booking);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("[Receipt Route Error]", err);
    return new Response("<h1>Unable to generate receipt. Please try again.</h1>", {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
