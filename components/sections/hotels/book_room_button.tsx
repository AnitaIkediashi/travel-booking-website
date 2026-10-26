"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/reusable/button";
import { createHotelBooking } from "@/lib/actions/hotel_booking";

type Props = {
  roomId: string;
  soldOut: boolean;
  disabled: boolean;
  checkIn: string;
  checkOut: string;
  adults: number;
  childCount: number;
  rooms: number;
};

export const BookRoomButton = ({ soldOut, disabled,childCount, ...booking }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleBook = () => {
    setError(null);
    startTransition(async () => {
      const res = await createHotelBooking({
        ...booking,
        children: childCount, // the action still expects "children"
      });
      // on success the action redirects, so we only get here on error
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        disabled={disabled || isPending}
        label={soldOut ? "Sold out" : isPending ? "Reserving..." : "Book now"}
        onClick={handleBook}
        className="rounded-md bg-mint-green-100 px-6 py-2.5 md:text-sm text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
      />
      {error && <p className="text-xs text-salmon-100">{error}</p>}
    </div>
  );
};
