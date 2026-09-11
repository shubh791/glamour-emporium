"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { findServiceDetails } from "@/data/bookingConfig";

const BookingContext = createContext({
  isOpen: false,
  bookingPayload: { category: "", service: "" },
  selectedCategory: "",
  selectedService: "",
  openBooking: () => {},
  closeBooking: () => {},
});

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingPayload, setBookingPayload] = useState({ category: "", service: "" });

  const openBooking = useCallback((serviceOrPayload = "", maybeCategory = "") => {
    if (!serviceOrPayload && !maybeCategory) {
      setBookingPayload({ category: "", service: "" });
    } else if (typeof serviceOrPayload === "object" && serviceOrPayload !== null) {
      const details = findServiceDetails(
        serviceOrPayload.category || "",
        serviceOrPayload.service || ""
      );
      setBookingPayload(details);
    } else if (maybeCategory && typeof maybeCategory === "string") {
      const details = findServiceDetails(maybeCategory, serviceOrPayload);
      setBookingPayload(details);
    } else if (typeof serviceOrPayload === "string") {
      const details = findServiceDetails(serviceOrPayload);
      setBookingPayload(details);
    } else {
      setBookingPayload({ category: "", service: "" });
    }
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        bookingPayload,
        selectedCategory: bookingPayload.category,
        selectedService: bookingPayload.service || bookingPayload.category,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
