import { ReactNode } from "react";

type BookingWrapperProps = {
  type: string
  flightChild?: ReactNode;
  hotelChild?: ReactNode;
};

export const BookingWrapper = ({
  flightChild,
  hotelChild,
  type
}: BookingWrapperProps) => {
 
  return (
    <>
      {type === "flight" ? flightChild : hotelChild }
    </>
  );
};
