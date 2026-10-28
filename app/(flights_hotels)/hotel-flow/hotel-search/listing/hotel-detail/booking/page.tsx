import { NoData } from "@/components/reusable/no_data";
import { BookingWrapper } from "@/components/sections/flights/booking_wrapper";
import { HotelBooking } from "@/components/sections/hotels/hotel_booking";

const HotelBookingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) => {
  const { bookingId } = await searchParams;
  if (!bookingId) return <NoData content="No rooms booked" goBack={true} />;

  return (
    <BookingWrapper
      type="hotel"
      hotelChild={<HotelBooking bookingId={bookingId} />}
    />
  );
};

export default HotelBookingPage