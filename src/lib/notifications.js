import { formatDisplayDate, BOOKING_ADVANCE } from "@/data/bookingConfig";
import { sendOwnerBookingNotification } from "@/lib/email";

const SALON_PRIMARY_WHATSAPP = process.env.SALON_PRIMARY_WHATSAPP || "917495068282";

/**
 * Unified notification handler triggered when an appointment is CONFIRMED.
 * 1. Dispatches Resend email to salon owner with deduplication.
 * 2. Prepares WhatsApp Business API payloads for future direct messaging.
 * @param {Object} booking
 */
export async function notifyConfirmedBooking(booking) {
  if (!booking) return { success: false, error: "Missing booking object" };

  try {
    // 1. Send owner email via Resend
    try {
      await sendOwnerBookingNotification(booking);
    } catch (emailErr) {
      console.warn("[Notifications] Owner email dispatch warning:", emailErr.message);
    }

    // 2. WhatsApp notification payload preparation
    const formattedDate = formatDisplayDate(booking.bookingDate);
    const serviceDisplay = booking.service
      ? (booking.serviceCategory && booking.service !== booking.serviceCategory
          ? `${booking.service} (${booking.serviceCategory})`
          : booking.service)
      : booking.serviceCategory || "Salon Service";

    const customerMessage =
      `Hello ${booking.customerName.trim()} 👋\n\n` +
      `Your appointment at Glamour Emporium is confirmed.\n\n` +
      `Service: ${serviceDisplay}\n` +
      `Date: ${formattedDate || booking.bookingDate}\n` +
      `Time: ${booking.bookingTime}\n` +
      `Advance Paid: ₹${booking.amount || BOOKING_ADVANCE}\n\n` +
      `Please arrive 5–10 minutes before your scheduled appointment.\n\n` +
      `The ₹${booking.amount || BOOKING_ADVANCE} advance will be adjusted against your final salon bill.\n\n` +
      `Thank you for choosing Glamour Emporium.\n` +
      `Location: Jattal Road, Near Choudhary Hospital, Panipat, Haryana 132103`;

    const staffAlertMessage =
      `NEW PAID APPOINTMENT\n\n` +
      `Customer: ${booking.customerName.trim()}\n` +
      `Phone: ${booking.phone.trim()}\n` +
      `Service: ${serviceDisplay}\n` +
      `Date: ${formattedDate || booking.bookingDate}\n` +
      `Time: ${booking.bookingTime}\n` +
      `Advance: ₹${booking.amount || BOOKING_ADVANCE} PAID\n` +
      `Booking ID: ${booking.bookingCode}`;

    const notificationPayload = {
      timestamp: new Date().toISOString(),
      bookingCode: booking.bookingCode,
      recipients: {
        customer: {
          phone: booking.phone,
          message: customerMessage,
        },
        salon: {
          phone: SALON_PRIMARY_WHATSAPP,
          message: staffAlertMessage,
        },
      },
    };

    console.log("[Notifications] Confirmed appointment hook completed for:", booking.bookingCode);
    return { success: true, payload: notificationPayload };
  } catch (err) {
    console.error("[Notifications] Error in notifyConfirmedBooking:", err.message);
    return { success: false, error: err.message };
  }
}
