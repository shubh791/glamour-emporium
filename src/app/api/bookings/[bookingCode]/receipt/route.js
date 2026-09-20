import prisma from "@/lib/prisma";
import { sanitizePhone } from "@/lib/bookingService";
import { generateReceiptHtml } from "@/lib/receipt";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { bookingCode } = await params;
    const { searchParams } = new URL(request.url);
    const phoneParam = searchParams.get("phone");

    if (!bookingCode) {
      return new Response("<h1>Booking ID required</h1>", {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const cleanCode = String(bookingCode).trim().toUpperCase();

    const booking = await prisma.booking.findUnique({
      where: { bookingCode: cleanCode },
    });

    if (!booking) {
      return new Response(
        `<!DOCTYPE html>
        <html lang="en">
        <head><title>Booking Not Found - Glamour Emporium</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="font-family: system-ui, sans-serif; background:#0c0b0a; color:#f5f2eb; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:20px; text-align:center;">
          <div style="max-width:440px; border:1px solid #333; padding:32px; background:#141312; border-radius:4px;">
            <h2 style="color:#c9a87c; margin-top:0; font-family:serif;">Booking Not Found</h2>
            <p style="color:#aaa; font-size:14px; line-height:1.6;">No booking was found with Reference ID: <strong>${cleanCode}</strong>.</p>
            <a href="/find-booking" style="display:inline-block; margin-top:16px; padding:10px 20px; background:#c9a87c; color:#000; text-decoration:none; font-weight:bold; font-size:12px; letter-spacing:0.1em; text-transform:uppercase;">Search Again</a>
          </div>
        </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // If phone query parameter was provided, verify it matches
    if (phoneParam) {
      const cleanPhone = sanitizePhone(phoneParam);
      if (cleanPhone && cleanPhone !== sanitizePhone(booking.phone)) {
        return new Response(
          `<!DOCTYPE html>
          <html lang="en">
          <head><title>Access Denied - Glamour Emporium</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
          <body style="font-family: system-ui, sans-serif; background:#0c0b0a; color:#f5f2eb; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:20px; text-align:center;">
            <div style="max-width:440px; border:1px solid #333; padding:32px; background:#141312; border-radius:4px;">
              <h2 style="color:#df9b8a; margin-top:0; font-family:serif;">Verification Mismatch</h2>
              <p style="color:#aaa; font-size:14px; line-height:1.6;">The mobile number provided does not match this booking record.</p>
              <a href="/find-booking" style="display:inline-block; margin-top:16px; padding:10px 20px; background:#c9a87c; color:#000; text-decoration:none; font-weight:bold; font-size:12px; letter-spacing:0.1em; text-transform:uppercase;">Try Again</a>
            </div>
          </body>
          </html>`,
          { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
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
