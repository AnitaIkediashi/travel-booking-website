"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/reusable/button";
import { SeatMap } from "./seat_map";
import { SeatLegend } from "./seat_legend";
import { Seat } from "@/types/flight_type";
import {
  confirmAllSeatsAssigned,
  getSeatsAndPassengers,
  holdSeat,
} from "@/lib/actions/seat_selection";

/**
 * note: useCallback is a React Hook that caches (memoizes) a function definition between component re-renders
 */

type Passenger = {
  id: string;
  first_name: string;
  last_name: string;
  passenger_index: number;
  seat_id: number | null;
};

type SeatProps = {
  nextStep: (seatFeesTotal: number) => void;
  bookingId: string;
  flightOfferId: string;
  totalTravelers: number;
};

export const SelectSeatsWrapper = ({
  nextStep,
  bookingId,
  flightOfferId,
  totalTravelers,
}: SeatProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ignoreRef = useRef(false);

  const loadData = useCallback(async () => {
    try {
      const { seats: fetchedSeats, passengers: fetchedPassengers } =
        await getSeatsAndPassengers(bookingId, flightOfferId);

      if (ignoreRef.current) return;

      setSeats(fetchedSeats);
      setPassengers(fetchedPassengers);

      const firstUnseated = fetchedPassengers.findIndex((p) => !p.seat_id);
      setActivePassengerIndex(firstUnseated === -1 ? 0 : firstUnseated);
    } catch (err) {
      console.error("Failed to load seat map:", err);
    } finally {
      if (!ignoreRef.current) setIsLoaded(true);
    }
  }, [bookingId, flightOfferId]);

  useEffect(() => {
    ignoreRef.current = false;
    loadData();

    return () => {
      ignoreRef.current = true;
    };
  }, [loadData]);

  const activePassenger = passengers[activePassengerIndex];

  const totalSeatFees = passengers.reduce((sum, p) => {
    if (!p.seat_id) return sum;
    const seat = seats.find((s) => s.id === p.seat_id);
    return sum + (seat?.extra_fee ?? 0);
  }, 0);

  const handleSeatSelect = async (seat: Seat) => {
    if (!activePassenger || isAssigning) return;

    setIsAssigning(true);
    setError(null);
    try {
      const result = await holdSeat(bookingId, seat.id, activePassenger.id);
      if (!result.success) {
        setError(result.error);
        await loadData(); // refresh in case someone else grabbed it meanwhile
        return;
      }

      await loadData();

      setPassengers((prev) => {
        const nextUnseated = prev.findIndex(
          (p) => p.id !== activePassenger.id && !p.seat_id,
        );
        if (nextUnseated !== -1) setActivePassengerIndex(nextUnseated);
        return prev;
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleContinue = async () => {
     const allAssigned = await confirmAllSeatsAssigned(
       bookingId,
       totalTravelers,
     );
     if (!allAssigned) {
       setError("Please assign a seat to every passenger before continuing.");
       return;
     }
    nextStep(totalSeatFees);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Loading seat map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* passenger tabs */}
      <div className="flex gap-2 flex-wrap">
        {passengers.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePassengerIndex(i)}
            className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors
              ${
                i === activePassengerIndex
                  ? "bg-blackish-green text-white border-blackish-green"
                  : p.seat_id
                    ? "bg-gray-100 text-gray-500 border-gray-200"
                    : "bg-white text-blackish-green border-blackish-green/30"
              }`}
          >
            {p.first_name || `Passenger ${p.passenger_index + 1}`}
            {p.seat_id ? " ✓" : ""}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="border rounded-lg p-6 overflow-x-auto">
        <SeatMap
          seats={seats}
          bookingId={bookingId}
          selectedSeatId={activePassenger?.seat_id}
          disabled={isAssigning}
          onSelectSeat={handleSeatSelect}
          passengers={passengers}
        />
      </div>

      <SeatLegend />

      {totalSeatFees > 0 && (
        <p className="text-sm font-medium text-blackish-green">
          Seat selection fees:{" "}
          <span className="font-semibold">${totalSeatFees}</span>
        </p>
      )}

      <Button
        type="button"
        onClick={handleContinue}
        className="w-full bg-blackish-green text-white rounded py-2 text-sm font-semibold hover:opacity-90"
        label="Continue to checkout"
      />
    </div>
  );
};
