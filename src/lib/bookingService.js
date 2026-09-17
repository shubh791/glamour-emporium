import prisma from "@/lib/prisma";
import {
  isTuesday,
  isPastDate,
  BOOKING_SLOTS,
  BOOKING_ADVANCE,
  getTodayKolkataString,
  isSlotAvailableTimeWise,
  sanitizePhone,
  isValidPhone,
} from "@/data/bookingConfig";

export { sanitizePhone, isValidPhone };

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

  const todayKolkata = getTodayKolkataString();
  const isSelectedDateToday = dateString === todayKolkata;

  // Fetch confirmed bookings for the specified date
  let confirmedBookings = [];
  try {
    confirmedBookings = await prisma.booking.findMany({
      where: {
        bookingDate: dateString,
        bookingStatus: "CONFIRMED",
      },
      select: {
        bookingTime: true,
        bookingStatus: true,
      },
    });
  } catch (dbErr) {
    console.warn("[BookingService] DB availability query notice:", dbErr.message);
  }

  const bookedSlotSet = new Set(confirmedBookings.map((b) => b.bookingTime));

  const slots = BOOKING_SLOTS.map((slot) => {
    // 1. Check if the slot start time has already passed or is within 15-min buffer for today
    if (isSelectedDateToday && !isSlotAvailableTimeWise(dateString, slot, 15)) {
      return {
        slot,
        available: false,
        status: "PAST_SLOT",
      };
    }

    // 2. Check if the slot is already booked in database
    if (bookedSlotSet.has(slot)) {
      return {
        slot,
        available: false,
        status: "BOOKED",
      };
    }

    // 3. Slot is available
    return {
      slot,
      available: true,
      status: "AVAILABLE",
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

  // Check 15-minute buffer if date is today
  if (!isSlotAvailableTimeWise(dateString, timeSlot, 15)) {
    return false;
  }

  try {
    const conflict = await prisma.booking.findFirst({
      where: {
        bookingDate: dateString,
        bookingTime: timeSlot,
        bookingStatus: "CONFIRMED",
      },
    });

    return !conflict;
  } catch (err) {
    console.error("[BookingService] isSlotAvailable error:", err);
    return true; // allow proceeding to payment if read fails transiently
  }
}
