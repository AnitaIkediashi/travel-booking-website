"use client";

import { Seat } from "@/types/flight_type";

type SeatButtonProps = {
  seat?: Seat;
  bookingId: string;
  isSelected: boolean;
  disabled: boolean;
  assignedPassengerLabel?: string;
  onSelect: (seat: Seat) => void;
};

export const SeatButton = ({
  seat,
  bookingId,
  isSelected,
  assignedPassengerLabel,
  disabled,
  onSelect,
}: SeatButtonProps) => {
  if (!seat) return <div className="w-8 h-8" />;

  const isOccupied = seat.is_booked;
  const isHeldByOthers = !!seat.booking_id && seat.booking_id !== bookingId && !isOccupied;
  const isUnavailable = isOccupied || isHeldByOthers;
  const isAssignedInBooking = !!assignedPassengerLabel;

  const stateClass = isUnavailable
    ? "bg-gray-300 text-gray-400 cursor-not-allowed border-gray-300"
    : isSelected
      ? "bg-blackish-green text-white border-blackish-green ring-2 ring-blackish-green ring-offset-1"
      : isAssignedInBooking
        ? "bg-blackish-green/20 text-blackish-green border-blackish-green/50"
        : seat.is_exit_row
          ? "bg-amber-50 border-amber-400 hover:border-amber-500"
          : "bg-white border-gray-300 hover:border-blackish-green";

  return (
    <button
      type="button"
      disabled={isUnavailable || disabled}
      onClick={() => onSelect(seat)}
      className={`w-8 h-8 rounded-t-md border text-[10px] font-semibold flex items-center justify-center transition-colors ${stateClass}`}
    >
      {isOccupied
        ? "✕"
        : assignedPassengerLabel
          ? assignedPassengerLabel
          : seat.extra_fee > 0
            ? "$"
            : ""}
    </button>
  );
};
