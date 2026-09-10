"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { BOOKING_SERVICES } from "@/data/bookingConfig";

const BookingContext = createContext({
  isOpen: false,
  selectedService: "",
  openBooking: () => {},
  closeBooking: () => {},
});

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openBooking = useCallback((serviceName = "") => {
    if (serviceName && typeof serviceName === "string") {
      const match = BOOKING_SERVICES.find(
        (s) => s.toLowerCase() === serviceName.toLowerCase()
      );
      setSelectedService(match || serviceName);
    } else {
      setSelectedService("");
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
        selectedService,
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
