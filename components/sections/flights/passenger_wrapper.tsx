'use client'

import { getPassengersForBooking, savePassenger } from "@/lib/actions/flight-booking-actions";
import { useEffect, useState } from "react";
import { PassengerForm } from "./passenger_form";

type PassengerProps = {
  nextStep: () => void;
  totalTravelers: number;
  bookingId: string | undefined;
};

export type IdType = "PASSPORT" | "NATIONAL_ID";
type Gender = "MALE" | "FEMALE";

export type Passenger = {
  id?: string;
  firstName: string;
  lastName: string;
  gender: Gender | "";
  idType: IdType | "";
  idNumber: string;
  nationality: string;
  dateOfBirth: string;
};

const emptyPassenger: Passenger = {
  firstName: "",
  lastName: "",
  gender: "",
  idType: "",
  idNumber: "",
  nationality: "",
  dateOfBirth: "",
};

export const PassengerWrapper = ({ nextStep, totalTravelers, bookingId }: PassengerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: totalTravelers }, () => ({ ...emptyPassenger })),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // restore previously saved passengers on page refresh
  useEffect(() => {
    (async () => {
      const saved = await getPassengersForBooking(bookingId);
      if (saved.length > 0) {
        setPassengers((prev) =>
          prev.map((p, i) => {
            const match = saved[i];
            if (!match) return p;
            return {
              id: match.id,
              firstName: match.first_name,
              lastName: match.last_name,
              gender: match.gender as Gender,
              idType: match.id_type as IdType,
              idNumber: match.id_number,
              nationality: match.nationality,
              dateOfBirth: new Date(match.date_of_birth)
                .toISOString()
                .split("T")[0],
            };
          }),
        );
        setCurrentIndex(Math.min(saved.length, totalTravelers - 1));
      }
      setIsLoaded(true);
    })();
  }, [bookingId, totalTravelers]); // 👈 only re-runs if bookingId or totalTravelers changes

  const updatePassenger = (updated: Passenger) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === currentIndex ? updated : p)),
    );
  };

  const handlePassengerSubmit = async () => {
    setIsSaving(true);
    try {
      const current = passengers[currentIndex];
      const result = await savePassenger(
        bookingId,
        {
          firstName: current.firstName,
          lastName: current.lastName,
          gender: current.gender as "MALE" | "FEMALE",
          idType: current.idType as "PASSPORT" | "NATIONAL_ID",
          idNumber: current.idNumber,
          nationality: current.nationality,
          dateOfBirth: current.dateOfBirth,
        },
        currentIndex,
        current.id,
      );

      if (!result.success) {
        // server-side validation failed (shouldn't happen if client zod runs first,
        // but good to handle in case someone bypasses the form)
        console.error("Server validation failed:", result.errors);
        return;
      }

      // result.id is now guaranteed to be a string ✅
      setPassengers((prev) =>
        prev.map((p, i) => (i === currentIndex ? { ...p, id: result.id } : p)),
      );

      if (currentIndex < totalTravelers - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        nextStep();
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Loading passenger details...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* sub-progress indicator */}
      {totalTravelers > 1 && (
        <div className="w-full max-w-lg flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Passenger {currentIndex + 1} of {totalTravelers}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalTravelers }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex
                    ? "w-6 bg-blackish-green"
                    : i < currentIndex
                      ? "w-3 bg-blackish-green/50"
                      : "w-3 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <PassengerForm
        key={currentIndex}
        passenger={passengers[currentIndex]}
        passengerNumber={currentIndex + 1}
        isLastPassenger={currentIndex === totalTravelers - 1}
        isSaving={isSaving}
        onChange={updatePassenger}
        onSubmit={handlePassengerSubmit}
        onBack={
          currentIndex > 0 ? () => setCurrentIndex((p) => p - 1) : undefined
        }
      />
    </div>
  );
};
