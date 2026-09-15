import prisma from "@/lib/prisma";
import { isTuesday, isPastDate, BOOKING_SLOTS, BOOKING_ADVANCE } from "@/data/bookingConfig";

export const HOLD_DURATION_MINUTES = 10;

/**
 * Generates a human-friendly unique booking code (e.g. GE-7K2M9P)
 * @returns {string}
 */
export function generateBookingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excludes ambiguous 0, O, 1, I
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GE-${code}`;
}

/**
 * Sanitizes phone number to standard 10-digit format
 * @param {string} rawPhone
 * @returns {string}
 */
export function sanitizePhone(rawPhone = "") {
  let cleaned = String(rawPhone).replace(/\D/g, "");
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Validates phone format (must be 10 digits Indian mobile)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone = "") {
  const cleaned = sanitizePhone(phone);
  return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Expires stale temporary slot holds
 */
export async function expireStaleHolds() {
  try {
    const now = new Date();
    await prisma.booking.updateMany({
      where: {
        bookingStatus: "PENDING_PAYMENT",
        slotHoldExpiresAt: {
          lte: now,
        },
      },
      data: {
        bookingStatus: "EXPIRED",
      },
    });
  } catch (err) {
    console.error("Error expiring stale holds:", err);
  }
}

/**
 * Gets real-time availability for all slots on a given date
 * @param {string} dateString - YYYY-MM-DD
 * @returns {Promise<{isClosed: boolean, closedReason?: string, slots: Array<{slot: string, available: boolean, status: string}>}>}
 */
export async function getSlotAvailabilityForDate(dateString) {
  if (!dateString) {
    return { isClosed: true, closedReason: "Date is required", slots: [] };
  }

  if (isTuesday(dateString)) {
    return {
      isClosed: true,
      closedReason: "Glamour Emporium is closed every Tuesday. Please choose another date.",
      slots: BOOKING_SLOTS.map((slot) => ({
        slot,
        available: false,
        status: "CLOSED",
      })),
    };
  }

  if (isPastDate(dateString)) {
    return {
      isClosed: true,
      closedReason: "Please select today or a future date.",
      slots: BOOKING_SLOTS.map((slot) => ({
        slot,
        available: false,
        status: "PAST_DATE",
      })),
    };
  }

  // Clean up stale holds first
  await expireStaleHolds();

  const now = new Date();

  // Fetch active bookings for the specified date
  const activeBookings = await prisma.booking.findMany({
    where: {
      bookingDate: dateString,
      OR: [
        { bookingStatus: "CONFIRMED" },
        {
          bookingStatus: "PENDING_PAYMENT",
          slotHoldExpiresAt: {
            gt: now,
          },
        },
      ],
    },
    select: {
      bookingTime: true,
      bookingStatus: true,
      slotHoldExpiresAt: true,
    },
  });

  const bookedSlotMap = new Map();
  for (const b of activeBookings) {
    if (b.bookingStatus === "CONFIRMED") {
      bookedSlotMap.set(b.bookingTime, "BOOKED");
    } else if (b.bookingStatus === "PENDING_PAYMENT" && b.slotHoldExpiresAt > now) {
      bookedSlotMap.set(b.bookingTime, "HELD");
    }
  }

  const slots = BOOKING_SLOTS.map((slot) => {
    const slotStatus = bookedSlotMap.get(slot);
    const available = !slotStatus;
    return {
      slot,
      available,
      status: slotStatus || "AVAILABLE",
    };
  });

  return {
    isClosed: false,
    slots,
  };
}

/**
 * Checks if a specific date + time slot is available for booking
 * @param {string} dateString
 * @param {string} timeSlot
 * @returns {Promise<boolean>}
 */
export async function isSlotAvailable(dateString, timeSlot) {
  if (isTuesday(dateString) || isPastDate(dateString)) {
    return false;
  }

  const now = new Date();

  const conflict = await prisma.booking.findFirst({
    where: {
      bookingDate: dateString,
      bookingTime: timeSlot,
      OR: [
        { bookingStatus: "CONFIRMED" },
        {
          bookingStatus: "PENDING_PAYMENT",
          slotHoldExpiresAt: {
            gt: now,
          },
        },
      ],
    },
  });

  return !conflict;
}
