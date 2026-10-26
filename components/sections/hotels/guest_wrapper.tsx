"use client";


import type { ContactInfoInput } from "@/lib/actions/flight-booking-actions";
import { useEffect, useState } from "react";
import { contactInfoSchema } from "@/lib/zod_schema";
import { z } from "zod";
import { Passenger } from "../flights/passenger_wrapper";
import { ContactInfoSection } from "../flights/contact_info_section";
import { PassengerForm } from "../flights/passenger_form";
import { getContactInfoForHotelBooking, getGuestsForBooking, saveGuest, saveHotelContactInfo } from "@/lib/actions/hotel_booking";


type GuestWrapperProps = {
  nextStep: () => void;
  totalGuests: number;
  bookingId: string | undefined;
};

type Gender = "MALE" | "FEMALE";

const emptyGuest: Passenger = {
  firstName: "",
  lastName: "",
  gender: "",
  nationality: "",
  dateOfBirth: "",
};

const emptyContactInfo: ContactInfoInput = { email: "", phoneNo: "" };

export const GuestWrapper = ({
  nextStep,
  totalGuests,
  bookingId,
}: GuestWrapperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guests, setGuests] = useState<Passenger[]>(
    Array.from({ length: totalGuests }, () => ({ ...emptyGuest })),
  );
  const [contactInfo, setContactInfo] =
    useState<ContactInfoInput>(emptyContactInfo);
  const [contactErrors, setContactErrors] = useState<
    Partial<Record<keyof ContactInfoInput, string>>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const [savedGuests, savedContact] = await Promise.all([
          getGuestsForBooking(bookingId),
          getContactInfoForHotelBooking(bookingId),
        ]);
        if (ignore) return;

        if (savedGuests.length > 0) {
          setGuests((prev) =>
            prev.map((g, i) => {
              const match = savedGuests.find((s) => s.guest_index === i);
              if (!match) return g;
              return {
                id: match.id,
                firstName: match.first_name,
                lastName: match.last_name,
                gender: match.gender as Gender,
                nationality: match.nationality,
                dateOfBirth: match.date_of_birth,
              };
            }),
          );
          setCurrentIndex(Math.min(savedGuests.length, totalGuests - 1));
        }

        if (savedContact?.contact_email || savedContact?.contact_phoneNo) {
          
          setContactInfo({
            email: savedContact.contact_email ?? "",
            phoneNo: savedContact.contact_phoneNo ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load guest/contact info:", err);
      } finally {
        if (!ignore) setIsLoaded(true);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [bookingId, totalGuests]);

  const updateGuest = (updated: Passenger) => {
    setGuests((prev) => prev.map((g, i) => (i === currentIndex ? updated : g)));
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

  const handleGuestSubmit = async () => {
    if (currentIndex === 0 && !validateContactInfo()) return;

    setIsSaving(true);
    try {
      if (currentIndex === 0) {
        const contactResult = await saveHotelContactInfo(
          bookingId,
          contactInfo,
        );
        if (!contactResult.success) {
          console.error("Contact info save failed:", contactResult.errors);
          return;
        }
      }

      const current = guests[currentIndex];
      const result = await saveGuest(
        bookingId,
        {
          firstName: current.firstName,
          lastName: current.lastName,
          gender: current.gender as Gender,
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
      setGuests((prev) =>
        prev.map((g, i) => (i === currentIndex ? { ...g, id: result.id } : g)),
      );

      if (currentIndex < totalGuests - 1) {
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
        <p className="text-sm text-gray-500">Loading guest details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {totalGuests > 1 && (
        <div className="w-full max-w-lg flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Guest {currentIndex + 1} of {totalGuests}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalGuests }).map((_, i) => (
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
          passenger={guests[currentIndex]}
          passengerNumber={currentIndex + 1}
          isLastPassenger={currentIndex === totalGuests - 1}
          isMainPassenger={currentIndex === 0}
          isSaving={isSaving}
          onChange={updateGuest}
          onSubmit={handleGuestSubmit}
          onBack={
            currentIndex > 0 ? () => setCurrentIndex((p) => p - 1) : undefined
          }
          personLabel="Guest"
          lastButtonLabel="Continue to payment"
        />
      </div>
    </div>
  );
};
