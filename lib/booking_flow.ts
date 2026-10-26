import { confirmBookingAndNotify } from "./actions/flight-booking-actions";
import { confirmHotelBookingAndNotify } from "./actions/hotel_booking";


export const confirmBookingByFlow = (
  flowType: string,
  bookingId: string,
  paymentIntentId: string,
) =>
  flowType === "hotel"
    ? confirmHotelBookingAndNotify(bookingId, paymentIntentId)
    : confirmBookingAndNotify(bookingId, paymentIntentId);

export const getSuccessPath = (flowType: string) =>
  flowType === "hotel"
    ? "/hotel-flow/hotel-search/booking-success"
    : "/flight-flow/flight-search/booking-success";

type PayloadBase = {
  flowType: string;
  passengerNames: string[];
  totalTravelers: number;
  paymentIntentId: string;
  liveSeatFeesTotal: number;
  bookingId: string | undefined;
};

export const buildBookingPayload = (
  base: PayloadBase,
  searchParams: URLSearchParams | { toString(): string },
) => {
  const p = new URLSearchParams(searchParams.toString());
  const num = (key: string) => +(p.get(key) ?? 0);

  if (base.flowType === "hotel") {
    return {
      ...base,
      token: p.get("token"),
      hotelId: p.get("hotelId"),
      destination: p.get("destination"),
      checkIn: p.get("checkIn"),
      checkOut: p.get("checkOut"),
      adults: num("adults"),
      children: num("children"),
      rooms: num("rooms"),
    };
  }

  return {
    ...base,
    from: p.get("from"),
    to: p.get("to"),
    trip: p.get("trip"),
    depart: p.get("depart"),
    return: p.get("return"),
    adults: num("adults"),
    child: num("child"),
    infant: num("infant"),
    cabin: p.get("cabin"),
    token: p.get("token"),
  };
};
