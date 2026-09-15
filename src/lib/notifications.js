import { formatDisplayDate, BOOKING_ADVANCE } from "@/data/bookingConfig";

const SALON_PRIMARY_WHATSAPP = process.env.SALON_PRIMARY_WHATSAPP || "917495068282";
const SALON_SECONDARY_WHATSAPP = process.env.SALON_SECONDARY_WHATSAPP || "918199081540";

/**
 * Notification handler triggered when an appointment is CONFIRMED.
 * Prepares and structures messages for future WhatsApp Business API integration.
 * @param {Object} booking
 */
export async function notifyConfirmedBooking(booking) {
  try {
    const formattedDate = formatDisplayDate(booking.bookingDate);
    const serviceDisplay = booking.service
      ? (booking.serviceCategory && booking.service !== booking.serviceCategory
          ? `${booking.service} (${booking.serviceCategory})`
          : booking.service)
      : booking.serviceCategory || "Salon Service";

    // 1. Customer Confirmation Message Payload
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

    // 2. Salon Staff Alert Message Payload
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
        primarySalon: {
          phone: SALON_PRIMARY_WHATSAPP,
          message: staffAlertMessage,
        },
        secondarySalon: {
          phone: SALON_SECONDARY_WHATSAPP,
          message: staffAlertMessage,
        },
      },
    };

    console.log("[NOTIFICATION HOOK] Appointment Confirmed Payload Prepared:", JSON.stringify(notificationPayload, null, 2));

    // When a WhatsApp Provider API is configured in future, dispatch request here.
    return { success: true, payload: notificationPayload };
  } catch (err) {
    console.error("[NOTIFICATION HOOK] Error preparing notification payload:", err);
    return { success: false, error: err.message };
  }
}
