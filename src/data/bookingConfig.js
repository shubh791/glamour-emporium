/**
 * Centralized Booking Configuration for Glamour Emporium Unisex Salon
 * 
 * Manages appointment advance amount, closed days, time slots, promotional offers,
 * notification recipients, contact email, and structured WhatsApp message builders.
 */

// ₹1 appointment advance (temporary live payment test) — fully adjusted against final salon bill
export const BOOKING_ADVANCE = 1;

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

// Verified Service Catalogue for Booking (Single Source of Truth)
export const BOOKING_CATALOGUE = [
  {
    id: "01",
    category: "Hair & Styling",
    descriptor: "WOMEN & MEN",
    shortDesc:
      "From everyday haircuts and styling to colour and hair care, choose a service that suits your look, occasion and preferences.",
    services: [
      { name: "Haircut", subtitle: "Personalized to face shape & natural texture" },
      { name: "Hair Styling & Blow Dry", subtitle: "Volume, movement and finish" },
      { name: "Hair Colour & Balayage", subtitle: "Dimensional tone & highlights" },
      { name: "Restorative Hair Care / Spa", subtitle: "Deep nourishment & strand repair" },
      { name: "Scalp Health Therapy", subtitle: "Cleansing & revitalization" },
    ],
  },
  {
    id: "02",
    category: "Men’s Grooming",
    aliases: ["Men's Grooming", "MEN'S GROOMING", "MENS GROOMING"],
    descriptor: "TAILORED GROOMING",
    shortDesc:
      "Haircuts, beard grooming and styling services designed for a clean, well-finished look.",
    services: [
      { name: "Tailored Scissor Cut", subtitle: "Precision cutting & silhouette shaping" },
      { name: "Fade & Taper Cut", subtitle: "Clean low fade & textured crown" },
      { name: "Beard Grooming & Detailing", subtitle: "Sharp perimeter lines & beard care" },
      { name: "Head Massage & Scalp Care", subtitle: "Relaxing cleanse & scalp health" },
      { name: "Occasion Styling", subtitle: "Refined finish for events and everyday" },
    ],
  },
  {
    id: "03",
    category: "Beauty & Care",
    descriptor: "SKIN & RITUALS",
    shortDesc:
      "Beauty and personal care services for everyday grooming, occasions and special moments.",
    services: [
      { name: "Facial & Skin Care", subtitle: "Hydrating, glow-enhancing skin care" },
      { name: "Hair Spa & Scalp Revival", subtitle: "Deep conditioning & follicle therapy" },
      { name: "Grooming & Clean Up", subtitle: "Gentle cleanse, exfoliation & renewal" },
      { name: "Detailing & Care Rituals", subtitle: "Refined grooming & finishing touches" },
      { name: "Style Consultation", subtitle: "One-on-one styling & care dialogue" },
    ],
  },
];

// Verified Service Categories for legacy compatibility
export const BOOKING_SERVICES = [
  "Hair & Styling",
  "Men’s Grooming",
  "Beauty & Care",
  "Hair Colour & Balayage",
  "Custom Consultation",
];

/**
 * Normalizes service / category names for robust case and character matching
 * @param {string} value 
 * @returns {string}
 */
export function normalizeServiceName(value = "") {
  return String(value)
    .replace(/[’‘']/g, "'")
    .trim()
    .toLowerCase();
}

/**
 * Finds the category object by category title, alias or matching sub-service name
 * @param {string} categoryOrServiceName 
 * @returns {Object|null}
 */
export function findCategory(categoryOrServiceName = "") {
  if (!categoryOrServiceName) return null;
  const target = normalizeServiceName(categoryOrServiceName);
  return (
    BOOKING_CATALOGUE.find((cat) => {
      if (normalizeServiceName(cat.category) === target) return true;
      if (cat.aliases && cat.aliases.some((a) => normalizeServiceName(a) === target)) return true;
      return cat.services.some((s) => normalizeServiceName(s.name) === target);
    }) || null
  );
}

/**
 * Extracts canonical category and service from provided input
 * @param {string} categoryOrService 
 * @param {string} [optionalService] 
 * @returns {{category: string, service: string}}
 */
export function findServiceDetails(categoryOrService = "", optionalService = "") {
  if (!categoryOrService && !optionalService) {
    return { category: "", service: "" };
  }

  // If both category and service are explicitly provided
  if (categoryOrService && optionalService) {
    const cat = findCategory(categoryOrService) || findCategory(optionalService);
    const catName = cat ? cat.category : categoryOrService;
    const matchedService = cat?.services.find(
      (s) => normalizeServiceName(s.name) === normalizeServiceName(optionalService)
    );
    return {
      category: catName,
      service: matchedService ? matchedService.name : optionalService,
    };
  }

  const query = categoryOrService || optionalService;
  const cat = findCategory(query);

  if (!cat) {
    return { category: "", service: query };
  }

  const isCategoryMatch =
    normalizeServiceName(cat.category) === normalizeServiceName(query) ||
    (cat.aliases && cat.aliases.some((a) => normalizeServiceName(a) === normalizeServiceName(query)));

  if (isCategoryMatch) {
    return {
      category: cat.category,
      service: "",
    };
  }

  const matchedService = cat.services.find(
    (s) => normalizeServiceName(s.name) === normalizeServiceName(query)
  );

  return {
    category: cat.category,
    service: matchedService ? matchedService.name : query,
  };
}

/**
 * Gets sub-services array for a given category
 * @param {string} categoryName 
 * @returns {Array}
 */
export function getServicesForCategory(categoryName = "") {
  if (!categoryName) return [];
  const cat = findCategory(categoryName);
  return cat ? cat.services : [];
}

// Slot capacity: 3 appointments per time slot
export const SLOT_CAPACITY = 3;

// Available Time Slots: 9:30 AM to 10:00 PM at 30-minute intervals (26 slots)
export const BOOKING_SLOTS = [
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
];

// Mock unavailable slots for frontend demonstration
// TODO: Connect to backend database / booking management API for live real-time slot availability.
export const DEMO_UNAVAILABLE_SLOTS = ["12:00 PM", "04:00 PM"];

// Centralized notification recipient for salon owner & staff alerts
export const NOTIFICATION_RECIPIENTS = {
  primary: "+91 74950 68282",
  primaryRaw: "917495068282",
};

// Shared contact email placeholder — easy to replace when client provides domain mailbox
export const CONTACT_EMAIL = "hello@glamouremporium.in";

/**
 * Returns today's date formatted as YYYY-MM-DD in Asia/Kolkata timezone
 * @returns {string}
 */
export function getTodayKolkataString() {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

/**
 * Returns the current time components in Asia/Kolkata timezone
 * @returns {{todayStr: string, hours: number, minutes: number, totalMinutes: number}}
 */
export function getNowInKolkata() {
  const now = new Date();
  let hours = 0;
  let minutes = 0;

  try {
    const kolkataTimeStr = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const parts = kolkataTimeStr.split(":");
    hours = parseInt(parts[0], 10) || 0;
    minutes = parseInt(parts[1], 10) || 0;
  } catch {
    hours = now.getHours();
    minutes = now.getMinutes();
  }

  const todayStr = getTodayKolkataString();
  return {
    todayStr,
    hours,
    minutes,
    totalMinutes: hours * 60 + minutes,
  };
}

/**
 * Parses a slot time string (e.g. "10:00 AM", "02:00 PM") into total minutes from midnight
 * @param {string} slotStr 
 * @returns {number|null}
 */
export function parseSlotTimeToMinutes(slotStr = "") {
  if (!slotStr) return null;
  const match = String(slotStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Determines whether a time slot is in the future and respects the 15-minute booking buffer
 * @param {string} dateString - YYYY-MM-DD
 * @param {string} slotString - e.g. "02:00 PM"
 * @param {number} [bufferMinutes=15] - Minimum lead time in minutes required
 * @returns {boolean}
 */
export function isSlotAvailableTimeWise(dateString, slotString, bufferMinutes = 15) {
  if (!dateString || !slotString) return false;
  if (isTuesday(dateString)) return false;

  const { todayStr, totalMinutes } = getNowInKolkata();

  // If date is before today in Asia/Kolkata
  if (dateString < todayStr) {
    return false;
  }

  // If date is in the future, all standard slots are available time-wise
  if (dateString > todayStr) {
    return true;
  }

  // If date is today: slot start time must be at least bufferMinutes in the future
  const slotMinutes = parseSlotTimeToMinutes(slotString);
  if (slotMinutes === null) return false;

  return slotMinutes >= totalMinutes + bufferMinutes;
}

/**
 * Normalizes Indian phone number by removing non-digits, leading +91/91/0, and limiting to 10 digits
 * @param {string} rawPhone 
 * @returns {string}
 */
export function sanitizePhone(rawPhone = "") {
  let cleaned = String(rawPhone || "").replace(/\D/g, "");
  if (cleaned.startsWith("91") && cleaned.length > 10) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length > 10) {
    cleaned = cleaned.slice(1);
  }
  return cleaned.slice(0, 10);
}

/**
 * Validates whether the given string is a valid 10-digit Indian mobile number
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidPhone(phone = "") {
  const cleaned = sanitizePhone(phone);
  return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
}

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
 * Checks if a given YYYY-MM-DD date is in the past in Asia/Kolkata
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {boolean}
 */
export function isPastDate(dateString) {
  if (!dateString) return false;
  try {
    const todayKolkata = getTodayKolkataString();
    return dateString < todayKolkata;
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
      timeZone: "Asia/Kolkata",
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
  category,
  date,
  timeSlot,
}) {
  const formattedDate = formatDisplayDate(date);
  const serviceDisplayName = service
    ? (category && service !== category && !service.toLowerCase().includes(category.toLowerCase())
        ? `${service} (${category})`
        : service)
    : (category || "Salon Service");

  return (
    `Hello ${name.trim()} 👋\n\n` +
    `Your appointment at Glamour Emporium has been confirmed.\n\n` +
    `Service: ${serviceDisplayName}\n` +
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
  category,
  date,
  timeSlot,
}) {
  const formattedDate = formatDisplayDate(date);
  const serviceDisplayName = service
    ? (category && service !== category && !service.toLowerCase().includes(category.toLowerCase())
        ? `${service} (${category})`
        : service)
    : (category || "Salon Service");

  return (
    `NEW APPOINTMENT BOOKING\n\n` +
    `Customer: ${name.trim()}\n` +
    `Phone: ${phone.trim()}\n\n` +
    `Service: ${serviceDisplayName}\n` +
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
 * Prepares the integration boundary for Razorpay Standard Checkout payment gateway.
 * 
 * ARCHITECTURE NOTE:
 * - Production integration triggers server order creation (POST /api/bookings/create)
 *   using the salon's verified Razorpay merchant keys so settlements transfer directly to Glamour Emporium.
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

