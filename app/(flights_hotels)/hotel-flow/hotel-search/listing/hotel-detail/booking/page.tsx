import { BookingWrapper } from "@/components/sections/flights/booking_wrapper";
import { HotelBooking } from "@/components/sections/hotels/hotel_booking";

const HotelBookingPage = async () => {
  return <BookingWrapper type="hotel" hotelChild={<HotelBooking />} />
};

export default HotelBookingPage