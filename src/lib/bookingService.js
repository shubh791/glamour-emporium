import prisma from "@/lib/prisma";
import {
  isTuesday,
  isPastDate,
  BOOKING_SLOTS,
  BOOKING_ADVANCE,
  SLOT_CAPACITY,
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
 * Gets real-time availability for all slots on a given date (Capacity-aware: exactly 3 spots per slot)
 * @param {string} dateString - YYYY-MM-DD
 * @returns {Promise<{isClosed: boolean, closedReason?: string, slots: Array<{slot: string, capacity: number, bookedCount: number, remainingSeats: number, spotsLeft: number, available: boolean, status: string}>}>}
 */
export async function getSlotAvailabilityForDate(dateString) {
  if (!dateString) {
    return { isClosed: true, closedReason: "Date is required", slots: [] };
  }

  if (isTuesday(dateString)) {
    return {
      isClosed: true,
      closedReason: "Salon is closed every Tuesday. Please select another date.",
      slots: BOOKING_SLOTS.map((slot) => ({
        slot,
        capacity: SLOT_CAPACITY,
        bookedCount: 0,
        remainingSeats: 0,
        spotsLeft: 0,
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
        capacity: SLOT_CAPACITY,
        bookedCount: 0,
        remainingSeats: 0,
        spotsLeft: 0,
        available: false,
        status: "PAST_DATE",
      })),
    };
  }

  const todayKolkata = getTodayKolkataString();
  const isSelectedDateToday = dateString === todayKolkata;

  // Fetch confirmed bookings for the specified date (only genuine CONFIRMED occupy capacity)
  let confirmedBookings = [];
  try {
    confirmedBookings = await prisma.booking.findMany({
      where: {
        bookingDate: dateString,
        bookingStatus: "CONFIRMED",
      },
      select: {
        bookingTime: true,
      },
    });
  } catch (dbErr) {
    console.warn("[BookingService] DB availability query notice:", dbErr.message);
  }

  // Count confirmed bookings per slot
  const bookingCountMap = {};
  for (const b of confirmedBookings) {
    if (b.bookingTime) {
      bookingCountMap[b.bookingTime] = (bookingCountMap[b.bookingTime] || 0) + 1;
    }
  }

  const slots = BOOKING_SLOTS.map((slot) => {
    const bookedCount = bookingCountMap[slot] || 0;
    const remainingSeats = Math.max(0, SLOT_CAPACITY - bookedCount);

    // 1. Check if the slot start time has already passed or is within 15-min buffer for today
    if (isSelectedDateToday && !isSlotAvailableTimeWise(dateString, slot, 15)) {
      return {
        slot,
        capacity: SLOT_CAPACITY,
        bookedCount,
        remainingSeats: 0,
        spotsLeft: 0,
        available: false,
        status: "PAST_SLOT",
      };
    }

    // 2. Check if the slot is fully booked (capacity of 3 reached)
    if (remainingSeats <= 0) {
      return {
        slot,
        capacity: SLOT_CAPACITY,
        bookedCount,
        remainingSeats: 0,
        spotsLeft: 0,
        available: false,
        status: "FULLY_BOOKED",
      };
    }

    // 3. Slot is available
    return {
      slot,
      capacity: SLOT_CAPACITY,
      bookedCount,
      remainingSeats,
      spotsLeft: remainingSeats,
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
 * Checks if a specific date + time slot is available for booking (Capacity < 3)
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
    const confirmedCount = await prisma.booking.count({
      where: {
        bookingDate: dateString,
        bookingTime: timeSlot,
        bookingStatus: "CONFIRMED",
      },
    });

    return confirmedCount < SLOT_CAPACITY;
  } catch (err) {
    console.error("[BookingService] isSlotAvailable error:", err);
    return false;
  }
}

/**
 * Atomically confirms a booking under concurrency protection.
 * Uses PostgreSQL transaction-scoped advisory locking to serialize concurrent attempts for the same (date + slot).
 *
 * @param {Object} params
 * @param {string} [params.bookingCode]
 * @param {string} params.razorpayOrderId
 * @param {string} params.razorpayPaymentId
 * @param {string} [params.razorpaySignature]
 * @param {string} params.customerName
 * @param {string} params.phone
 * @param {string} params.serviceCategory
 * @param {string} [params.service]
 * @param {string} params.bookingDate
 * @param {string} params.bookingTime
 * @param {string} [params.notes]
 * @param {number} [params.amount=99]
 * @returns {Promise<{success: boolean, isConfirmed: boolean, booking?: Object, error?: string, code?: string, alreadyConfirmed?: boolean}>}
 */
export async function confirmBookingWithCapacityCheck({
  bookingCode,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  customerName,
  phone,
  serviceCategory,
  service,
  bookingDate,
  bookingTime,
  notes,
  amount = BOOKING_ADVANCE,
}) {
  const targetDate = bookingDate || getTodayKolkataString();
  const targetTime = bookingTime || "10:00 AM";
  const lockKey = `ge_slot_${targetDate}_${targetTime}`;

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Acquire transaction-scoped PostgreSQL advisory lock for this slot
        // Serializes concurrent booking attempts for this specific date+slot
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

        // 2. Check for existing booking (Idempotency check)
        let existing = await tx.booking.findFirst({
          where: {
            OR: [
              razorpayOrderId ? { razorpayOrderId } : undefined,
              razorpayPaymentId ? { razorpayPaymentId } : undefined,
              bookingCode ? { bookingCode } : undefined,
            ].filter(Boolean),
          },
        });

        if (existing) {
          if (existing.bookingStatus === "CONFIRMED" && existing.paymentStatus === "SUCCESS") {
            return {
              success: true,
              isConfirmed: true,
              booking: existing,
              alreadyConfirmed: true,
            };
          }

          // If updating an existing booking that was not yet confirmed:
          // Count other confirmed bookings for this slot
          const confirmedCount = await tx.booking.count({
            where: {
              bookingDate: targetDate,
              bookingTime: targetTime,
              bookingStatus: "CONFIRMED",
              id: { not: existing.id },
            },
          });

          if (confirmedCount >= SLOT_CAPACITY) {
            return {
              success: false,
              isConfirmed: false,
              error: "This time slot just became full. Please select another time.",
              code: "SLOT_FULL",
            };
          }

          const updated = await tx.booking.update({
            where: { id: existing.id },
            data: {
              customerName: customerName ? customerName.trim() : existing.customerName,
              phone: phone || existing.phone,
              serviceCategory: serviceCategory || existing.serviceCategory,
              service: service !== undefined ? service : existing.service,
              bookingDate: targetDate,
              bookingTime: targetTime,
              notes: notes !== undefined ? notes : existing.notes,
              paymentStatus: "SUCCESS",
              bookingStatus: "CONFIRMED",
              razorpayOrderId: razorpayOrderId || existing.razorpayOrderId,
              razorpayPaymentId: razorpayPaymentId || existing.razorpayPaymentId,
              razorpaySignature: razorpaySignature || existing.razorpaySignature,
            },
          });

          return {
            success: true,
            isConfirmed: true,
            booking: updated,
          };
        }

        // 3. New booking creation: check capacity inside the atomic lock
        const confirmedCount = await tx.booking.count({
          where: {
            bookingDate: targetDate,
            bookingTime: targetTime,
            bookingStatus: "CONFIRMED",
          },
        });

        if (confirmedCount >= SLOT_CAPACITY) {
          return {
            success: false,
            isConfirmed: false,
            error: "This time slot just became full. Please select another time.",
            code: "SLOT_FULL",
          };
        }

        const finalBookingCode = bookingCode || generateBookingCode();

        const created = await tx.booking.create({
          data: {
            bookingCode: finalBookingCode,
            customerName: (customerName || "Salon Customer").trim(),
            phone: phone || "0000000000",
            serviceCategory: serviceCategory || "Hair & Styling",
            service: service || null,
            bookingDate: targetDate,
            bookingTime: targetTime,
            notes: notes ? String(notes).trim() : null,
            amount,
            currency: "INR",
            paymentStatus: "SUCCESS",
            bookingStatus: "CONFIRMED",
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature: razorpaySignature || null,
          },
        });

        return {
          success: true,
          isConfirmed: true,
          booking: created,
        };
      },
      {
        timeout: 10000,
      }
    );

    return result;
  } catch (err) {
    console.error("[BookingService] confirmBookingWithCapacityCheck error:", err);
    return {
      success: false,
      isConfirmed: false,
      error: "Unable to complete booking confirmation. Please try again.",
      code: "DB_ERROR",
      details: err.message,
    };
  }
}
