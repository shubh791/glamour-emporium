import { Resend } from "resend";
import prisma from "@/lib/prisma";
import { formatDisplayDate, BOOKING_ADVANCE } from "@/data/bookingConfig";

/**
 * Returns active Resend configuration from environment variables dynamically
 */
export function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Glamour Emporium <bookings@glamouremporiumsaloon.com>";
  const ownerEmail =
    process.env.SALON_OWNER_EMAIL?.trim() || "salmasaifi0888@gmail.com";

  const isConfigured =
    Boolean(apiKey) &&
    !apiKey.includes("placeholder") &&
    !apiKey.includes("xxxx");

  return {
    apiKey,
    fromEmail,
    ownerEmail,
    isConfigured,
  };
}

/**
 * Instantiates or returns active Resend client
 */
export function getResendClient() {
  const { apiKey, isConfigured } = getEmailConfig();
  if (!isConfigured) return null;
  try {
    return new Resend(apiKey);
  } catch (err) {
    console.warn("[Email Service] Failed to initialize Resend client:", err.message);
    return null;
  }
}

/**
 * Sends an official booking confirmation email to the salon owner with robust deduplication.
 * @param {Object} booking - Booking object from database
 * @param {Object} [options] - Optional flags (e.g. force: true for one-time replay)
 * @returns {Promise<{success: boolean, skipped?: boolean, error?: string, messageId?: string, sentAt?: Date}>}
 */
export async function sendOwnerBookingNotification(booking, options = {}) {
  const { force = false } = options;
  if (!booking || !booking.id) {
    return { success: false, error: "Invalid booking data" };
  }

  const { fromEmail, ownerEmail, isConfigured } = getEmailConfig();

  try {
    // 1. Check if already notified in database (unless force replay requested)
    if (!force) {
      const fresh = await prisma.booking.findUnique({
        where: { id: booking.id },
        select: { ownerNotifiedAt: true, bookingCode: true },
      });

      if (fresh?.ownerNotifiedAt) {
        console.log(
          `[Email Service] Notification for booking ${fresh.bookingCode} was already sent at ${fresh.ownerNotifiedAt.toISOString()}. Skipping duplicate.`
        );
        return { success: true, skipped: true };
      }
    }

    const resendClient = getResendClient();
    if (!resendClient || !isConfigured) {
      console.log("[Email Service] Resend API key not configured or in placeholder mode. Logged notification payload:", {
        bookingCode: booking.bookingCode,
        recipient: ownerEmail,
        customerName: booking.customerName,
        phone: booking.phone,
        date: booking.bookingDate,
        time: booking.bookingTime,
        advance: booking.amount,
      });
      return { success: true, skipped: true, note: "Resend not configured" };
    }

    const formattedDate = formatDisplayDate(booking.bookingDate) || booking.bookingDate;
    const serviceDisplay = booking.service
      ? (booking.serviceCategory && booking.service !== booking.serviceCategory
          ? `${booking.service} (${booking.serviceCategory})`
          : booking.service)
      : booking.serviceCategory || "Salon Service";

    const formattedCreatedAt = new Date(booking.createdAt || Date.now()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const emailSubject = `New Booking Confirmed — ${booking.bookingCode} — ${booking.customerName.trim()}`;

    const textContent =
`NEW PAID APPOINTMENT BOOKING

Booking Reference: ${booking.bookingCode}
Customer Name: ${booking.customerName.trim()}
Mobile Number: +91 ${booking.phone}
Service: ${serviceDisplay}
Appointment Date: ${formattedDate}
Time Slot: ${booking.bookingTime}
Advance Amount Paid: ₹${booking.amount != null ? booking.amount : BOOKING_ADVANCE} INR
Payment Status: SUCCESS (CONFIRMED)
Razorpay Order ID: ${booking.razorpayOrderId || "N/A"}
Razorpay Payment ID: ${booking.razorpayPaymentId || "N/A"}
Booking Time: ${formattedCreatedAt}
${booking.notes ? `Special Notes: ${booking.notes}\n` : ""}
Location: Jattal Road, Near Choudhary Hospital, Panipat, Haryana - 132103
Operating Brand: Glamour Emporium Unisex Salon (SS Enterprises)
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0b0a; color: #f5f2eb; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #141312; border: 1px solid #c9a87c; border-radius: 4px; overflow: hidden; }
    .header { background: #0c0b0a; border-bottom: 1px solid rgba(201, 168, 124, 0.3); padding: 20px 24px; text-align: center; }
    .title { color: #c9a87c; font-size: 18px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
    .subtitle { color: #888; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px; }
    .content { padding: 24px; }
    .badge { display: inline-block; background: #114b2d; color: #e5fbe8; padding: 4px 10px; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; }
    .code-box { background: #1c1a18; border: 1px dashed #c9a87c; padding: 12px 16px; margin: 16px 0; }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    .table td { padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); vertical-align: top; }
    .label { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; width: 40%; }
    .value { color: #f5f2eb; font-weight: 500; text-align: right; width: 60%; }
    .gold-value { color: #c9a87c; font-weight: bold; }
    .footer { padding: 16px 24px; background: #0c0b0a; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; font-size: 11px; color: #777; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">Glamour Emporium</div>
      <div class="subtitle">New Paid Appointment Confirmation</div>
    </div>
    <div class="content">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="badge">₹${booking.amount != null ? booking.amount : BOOKING_ADVANCE} ADVANCE PAID</span>
        <span style="font-family: monospace; font-size: 12px; color: #aaa;">${formattedCreatedAt}</span>
      </div>

      <div class="code-box">
        <div style="font-size: 11px; color: #c9a87c; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Booking Reference</div>
        <div style="font-family: monospace; font-size: 16px; font-weight: bold; color: #fff;">${booking.bookingCode}</div>
      </div>

      <table class="table">
        <tr>
          <td class="label">Customer Name</td>
          <td class="value">${booking.customerName.trim()}</td>
        </tr>
        <tr>
          <td class="label">Mobile Number</td>
          <td class="value"><a href="tel:+91${booking.phone}" style="color: #c9a87c; text-decoration: none;">+91 ${booking.phone}</a></td>
        </tr>
        <tr>
          <td class="label">Service</td>
          <td class="value">${serviceDisplay}</td>
        </tr>
        <tr>
          <td class="label">Date</td>
          <td class="value gold-value">${formattedDate}</td>
        </tr>
        <tr>
          <td class="label">Time Slot</td>
          <td class="value gold-value">${booking.bookingTime}</td>
        </tr>
        <tr>
          <td class="label">Advance Paid</td>
          <td class="value" style="color: #2d8f58; font-weight: bold;">₹${booking.amount != null ? booking.amount : BOOKING_ADVANCE}.00 (Bill Adjusted)</td>
        </tr>
        ${booking.notes ? `
        <tr>
          <td class="label">Special Notes</td>
          <td class="value" style="font-style: italic; color: #ddd;">"${booking.notes}"</td>
        </tr>` : ""}
        ${booking.razorpayPaymentId ? `
        <tr>
          <td class="label">Payment Reference</td>
          <td class="value" style="font-family: monospace; font-size: 11px;">${booking.razorpayPaymentId}</td>
        </tr>` : ""}
      </table>
    </div>
    <div class="footer">
      Glamour Emporium Unisex Salon • Jattal Road, Near Choudhary Hospital, Panipat, Haryana - 132103
    </div>
  </div>
</body>
</html>
`;

    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: [ownerEmail],
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    if (error || !data?.id) {
      const errMsg = error?.message || "Unknown error occurred while sending confirmation email.";
      console.error("[Email Service] Resend API error:", {
        message: errMsg,
        name: error?.name,
        statusCode: error?.statusCode,
        bookingCode: booking.bookingCode,
      });
      // Do not mark as notified so future retries or webhooks can deliver the email
      return { success: false, error: errMsg };
    }

    // 3. Mark ownerNotifiedAt in database ONLY after verified successful dispatch
    const sentAt = new Date();
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        ownerNotifiedAt: sentAt,
      },
    });

    console.log(`[Email Service] Confirmation email sent successfully for ${booking.bookingCode}. Resend Message ID: ${data.id}`);
    return { success: true, messageId: data.id, sentAt };
  } catch (err) {
    console.error("[Email Service] Unexpected error sending email:", err.message);
    // Crucial: Email failure must never break payment confirmation
    return { success: false, error: err.message };
  }
}
