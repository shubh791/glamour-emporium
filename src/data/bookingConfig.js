/**
 * Centralized Booking Configuration for Glamour Emporium Unisex Salon
 * 
 * Manages appointment advance amount, closed days, time slots, promotional offers,
 * notification recipients, contact email, and structured WhatsApp message builders.
 */

// ₹99 appointment advance — fully adjusted against final salon bill
export const BOOKING_ADVANCE = 99;

// Closed days: Glamour Emporium is closed every Tuesday (Day 2 in JavaScript Date.getDay())
export const SALON_CLOSED_DAYS = [2];
export const SALON_CLOSED_DAY_NAME = "Tuesday";

// Online booking benefit
export const ONLINE_BOOKING_OFFER = "Up to 20% off";

export const PROMO_STRIP_CONFIG = {
  tag: "BOOK ONLINE & SAVE",
  description: `Get ${ONLINE_BOOKING_OFFER} when you book your appointment through our website.`,
  shortDescription: `${ONLINE_BOOKING_OFFER} on website bookings`,
  ctaLabel: "BOOK A SLOT",
};

// Verified Service Categories for Booking
export const BOOKING_SERVICES = [
  "Hair & Styling",
  "Men’s Grooming",
  "Beauty & Care",
  "Hair Colour & Balayage",
  "Custom Consultation",
];

// Available Time Slots (Editable frontend config — ready for server availability sync)
export const BOOKING_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

// Mock unavailable slots for frontend demonstration
// TODO: Connect to backend database / booking management API for live real-time slot availability.
export const DEMO_UNAVAILABLE_SLOTS = ["12:00 PM", "04:00 PM"];

// Centralized notification recipients for owner & staff alerts
// TODO: Connect to official WhatsApp Business API / webhook notification endpoint on backend.
export const NOTIFICATION_RECIPIENTS = {
  primary: "+91 74950 68282",
  primaryRaw: "917495068282",
  secondary: "+91 81990 81540",
  secondaryRaw: "918199081540",
};

// Shared contact email placeholder — easy to replace when client provides domain mailbox
export const CONTACT_EMAIL = "hello@glamouremporium.in";

/**
 * Checks if a given YYYY-MM-DD date falls on Tuesday (Salon Closed)
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {boolean}
 */
export function isTuesday(dateString) {
  if (!dateString) return false;
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDay() === 2; // 2 = Tuesday
  } catch {
    return false;
  }
}

/**
 * Checks if a given YYYY-MM-DD date is in the past
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {boolean}
 */
export function isPastDate(dateString) {
  if (!dateString) return false;
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  } catch {
    return false;
  }
}

/**
 * Formats a YYYY-MM-DD date into a readable string (e.g., "14 September 2026")
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return "";
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Builds the official customer confirmation message for WhatsApp records
 * @param {Object} details
 * @returns {string}
 */
export function buildCustomerWhatsAppConfirmationMessage({
  name,
  phone,
  service,
  date,
  timeSlot,
}) {
  const formattedDate = formatDisplayDate(date);

  return (
    `Hello ${name.trim()} 👋\n\n` +
    `Your appointment at Glamour Emporium has been confirmed.\n\n` +
    `Service: ${service}\n` +
    `Date: ${formattedDate || date}\n` +
    `Time: ${timeSlot}\n` +
    `Booking Advance: ₹${BOOKING_ADVANCE} — Paid\n\n` +
    `Please arrive 5–10 minutes before your scheduled appointment.\n\n` +
    `The ₹${BOOKING_ADVANCE} booking advance will be adjusted against your final salon bill.\n\n` +
    `Thank you for choosing Glamour Emporium.\n` +
    `We look forward to seeing you.\n\n` +
    `Location:\n` +
    `Jattal Road, Near Choudhary Hospital, Panipat, Haryana 132103`
  );
}

/**
 * Builds the owner / staff notification message for backend WhatsApp integration
 * @param {Object} details
 * @returns {string}
 */
export function buildStaffBookingNotificationMessage({
  name,
  phone,
  service,
  date,
  timeSlot,
}) {
  const formattedDate = formatDisplayDate(date);

  return (
    `NEW APPOINTMENT BOOKING\n\n` +
    `Customer: ${name.trim()}\n` +
    `Phone: ${phone.trim()}\n\n` +
    `Service: ${service}\n` +
    `Date: ${formattedDate || date}\n` +
    `Time: ${timeSlot}\n\n` +
    `Booking Advance: ₹${BOOKING_ADVANCE} PAID\n\n` +
    `Please prepare for the appointment.`
  );
}

/**
 * Generates the full WhatsApp URL with encoded customer confirmation
 * @param {Object} bookingDetails 
 * @returns {string}
 */
export function buildCustomerConfirmationWhatsAppUrl(bookingDetails) {
  const message = buildCustomerWhatsAppConfirmationMessage(bookingDetails);
  return `https://wa.me/${NOTIFICATION_RECIPIENTS.primaryRaw}?text=${encodeURIComponent(message)}`;
}

/**
 * Payment Lifecycle States
 */
export const PAYMENT_STATUS = {
  IDLE: "IDLE",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

/**
 * Frontend Payment Gateway Simulation Adapter
 * 
 * Prepares the integration boundary for payment gateways (e.g. Razorpay / Cashfree).
 * 
 * ARCHITECTURE NOTE:
 * - Production integration will trigger server order creation (POST /api/bookings/create-payment)
 *   using the salon's verified merchant keys so settlements transfer directly to Glamour Emporium.
 * - This frontend mock demonstrates the full state transitions (IDLE -> PROCESSING -> SUCCESS).
 * 
 * @param {Object} bookingDetails
 * @returns {Promise<{success: boolean, transactionId?: string, timestamp?: string}>}
 */
export async function processBookingAdvancePayment(bookingDetails) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `GE_ADV_${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
      });
    }, 1100);
  });
}

