"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type BookingWrapperProps = {
  flightChild: ReactNode;
  hotelChild: ReactNode;
};

export const BookingWrapper = ({
  flightChild,
  hotelChild,
}: BookingWrapperProps) => {
  const pathname = usePathname();

  const isFlight = pathname.includes("/flight-flow/");
  const isHotel = pathname.includes("/hotel-flow/");

  return (
    <>
      {isFlight ? flightChild : isHotel ? hotelChild : null}
    </>
  );
};
