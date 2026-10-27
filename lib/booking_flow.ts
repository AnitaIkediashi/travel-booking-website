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

