"use client";

import {
  ContactInfoInput,
  getContactInfoForBooking,
  getPassengersForBooking,
  saveContactInfo,
  savePassenger,
} from "@/lib/actions/flight-booking-actions";
import { useEffect, useState } from "react";
import { PassengerForm } from "./passenger_form";
import { contactInfoSchema } from "@/lib/zod_schema";
import { z } from "zod";
import { ContactInfoSection } from "./contact_info_section";

type PassengerProps = {
  nextStep: () => void;
  totalTravelers: number;
  bookingId: string | undefined;
};

// export type IdType = "PASSPORT" | "NATIONAL_ID";
type Gender = "MALE" | "FEMALE";

export type Passenger = {
  id?: string;
  firstName: string;
  lastName: string;
  gender: Gender | "";
  nationality: string;
  dateOfBirth: string;
};

const emptyPassenger: Passenger = {
  firstName: "",
  lastName: "",
  gender: "",
  nationality: "",
  dateOfBirth: "",
};

const emptyContactInfo: ContactInfoInput = { email: "", phoneNo: "" };

export const PassengerWrapper = ({
  nextStep,
  totalTravelers,
  bookingId,
}: PassengerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: totalTravelers }, () => ({ ...emptyPassenger })),
  );
  const [contactInfo, setContactInfo] =
    useState<ContactInfoInput>(emptyContactInfo);
  const [contactErrors, setContactErrors] = useState<
    Partial<Record<keyof ContactInfoInput, string>>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // restore previously saved passengers on page refresh
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const [savedPassengers, savedContact] = await Promise.all([
          getPassengersForBooking(bookingId),
          getContactInfoForBooking(bookingId),
        ]);
        if (ignore) return;

        if (savedPassengers.length > 0) {
          setPassengers((prev) =>
            prev.map((p, i) => {
              const match = savedPassengers[i];
              if (!match) return p;
              return {
                id: match.id,
                firstName: match.first_name,
                lastName: match.last_name,
                gender: match.gender as Gender,
                nationality: match.nationality,
                dateOfBirth: new Date(match.date_of_birth)
                  .toISOString()
                  .split("T")[0],
              };
            }),
          );
          setCurrentIndex(Math.min(savedPassengers.length, totalTravelers - 1));
        }

        if (savedContact?.contact_email || savedContact?.contact_phone) {
          setContactInfo({
            email: savedContact.contact_email ?? "",
            phoneNo: savedContact.contact_phone ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load passenger/contact info:", err);
      } finally {
        if (!ignore) setIsLoaded(true);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [bookingId, totalTravelers]);

  const updatePassenger = (updated: Passenger) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === currentIndex ? updated : p)),
    );
  };

  const validateContactInfo = () => {
    const result = contactInfoSchema.safeParse(contactInfo);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setContactErrors({
        email: fieldErrors.email?.[0],
        phoneNo: fieldErrors.phoneNo?.[0],
      });
      return false;
    }
    setContactErrors({});
    return true;
  };

  const handlePassengerSubmit = async () => {
      if (currentIndex === 0 && !validateContactInfo()) {
        return; // block progression until contact info is valid
      }
  
      setIsSaving(true);
      try {
        if (currentIndex === 0) {
          const contactResult = await saveContactInfo(bookingId, contactInfo);
          if (!contactResult.success) {
            console.error("Contact info save failed:", contactResult.errors);
            return;
          }
        }
  
        const current = passengers[currentIndex];
        const result = await savePassenger(
          bookingId,
          {
            firstName: current.firstName,
            lastName: current.lastName,
            gender: current.gender as "MALE" | "FEMALE",
            nationality: current.nationality,
            dateOfBirth: current.dateOfBirth,
          },
          currentIndex,
          current.id,
        );
  
        if (!result.success) {
          console.error("Server validation failed:", result.errors);
          return;
        }
        setPassengers((prev) => prev.map((p, i) => (i === currentIndex ? { ...p, id: result.id } : p)));
  
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

      <div className="w-full">
        {currentIndex === 0 && (
          <ContactInfoSection
            contactInfo={contactInfo}
            errors={contactErrors}
            onChange={setContactInfo}
          />
        )}
        <PassengerForm
          key={currentIndex}
          passenger={passengers[currentIndex]}
          passengerNumber={currentIndex + 1}
          isLastPassenger={currentIndex === totalTravelers - 1}
          isMainPassenger={currentIndex === 0}
          isSaving={isSaving}
          onChange={updatePassenger}
          onSubmit={handlePassengerSubmit}
          onBack={
            currentIndex > 0 ? () => setCurrentIndex((p) => p - 1) : undefined
          }
        />
      </div>
    </div>
  );
};
