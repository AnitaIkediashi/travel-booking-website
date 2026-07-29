"use client";

import { COLUMN_LAYOUT, parseSeatNumber } from "@/utils/parse_seats_number";
import { SeatButton } from "./seat_button";
import { Seat } from "@/types/flight_type";

type SeatMapProps = {
  seats: Seat[];
  bookingId: string;
  passengers: { id: string; first_name: string; seat_id: number | null }[];
  selectedSeatId?: number | null;
  disabled: boolean;
  onSelectSeat: (seat: Seat) => void;
};

export const SeatMap = ({
  seats,
  bookingId,
  selectedSeatId,
  disabled,
  onSelectSeat,
  passengers,
}: SeatMapProps) => {
  const seatIdToInitial: Record<number, string> = {};
  for (const p of passengers) {
    if (p.seat_id)
      seatIdToInitial[p.seat_id] = p.first_name?.[0]?.toUpperCase() ?? "•";
  }
  // group seats by row and column
  const seatsByRow: Record<number, Record<string, Seat>> = {};
  for (const seat of seats) {
    const parsed = parseSeatNumber(seat.seat_number);
    if (!parsed) continue;
    seatsByRow[parsed.row] ??= {};
    seatsByRow[parsed.row][parsed.column] = seat;
  }

  const rowNumbers = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b); // ascending: row 1 (front) first

  if (rowNumbers.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No seats available for this flight.
      </p>
    );
  }

  // group consecutive rows by cabin class for section dividers
  let lastCabinClass: string | null = null;

  return (
    <div className="flex flex-col gap-1 items-center">
      {/* column header */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-6" />
        {COLUMN_LAYOUT.map((col, i) =>
          col === null ? (
            <div key={`header-aisle-${i}`} className="w-4" />
          ) : (
            <span
              key={col}
              className="w-8 text-center text-[10px] text-gray-400 font-medium"
            >
              {col}
            </span>
          ),
        )}
      </div>

      {rowNumbers.map((rowNum) => {
        const rowSeats = seatsByRow[rowNum];
        const cabinClass = Object.values(rowSeats)[0]?.cabin_class;
        const isNewSection = cabinClass !== lastCabinClass;
        lastCabinClass = cabinClass;

        return (
          <div key={rowNum} className="flex flex-col items-center w-full">
            {isNewSection && (
              <div className="w-full flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                  {cabinClass}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <span className="w-6 text-xs text-gray-400 text-right">
                {rowNum}
              </span>
              {COLUMN_LAYOUT.map((col, i) =>
                col === null ? (
                  <div key={`aisle-${rowNum}-${i}`} className="w-4" />
                ) : (
                  <SeatButton
                    key={col}
                    seat={rowSeats[col]}
                    bookingId={bookingId}
                    isSelected={rowSeats[col]?.id === selectedSeatId}
                    disabled={disabled}
                    onSelect={onSelectSeat}
                    assignedPassengerLabel={
                      rowSeats[col]
                        ? seatIdToInitial[rowSeats[col].id]
                        : undefined
                    }
                  />
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
