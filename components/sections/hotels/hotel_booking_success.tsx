import { CompanyAddress } from "@/components/reusable/company_address";
import { getDate } from "@/helpers/convertNumberToTime";
import { termsAndConditions } from "@/utils/terms_condition_content";
import { prisma } from "@/lib/prisma";
import type { Hotels } from "@/app/generated/prisma/client";
import { HotelTicket } from "./hotel_ticket";


export type HotelBookingSuccessProps = {
  paymentIntentId: string;
  booking: {
    id: string;
    currencySymbol: string;
    total: number;
    contactEmail: string | null;
    guestNames: string[];
    hotel: Hotels;
    rooms: {
      id: string;
      roomType: string;
      checkin: Date;
      checkout: Date;
    }[];
  };
};

export const HotelBookingSuccess = async ({
  paymentIntentId,
  booking,
}: HotelBookingSuccessProps) => {
  const { hotel, rooms, guestNames } = booking;

  if (rooms.length === 0) return;

  // Rules holds the hotel's check-in / check-out times
  const rule = await prisma.rules.findFirst({
    where: { hotel_id: hotel.id },
    select: { checkin_time: true, checkout_time: true },
  });

  const roomDetails = rooms.map((room) => {
    const nights = Math.max(
      1,
      Math.round(
        (new Date(room.checkout).getTime() - new Date(room.checkin).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    return {
      id: room.id,
      roomType: room.roomType,
      checkInDate: getDate(room.checkin),
      checkOutDate: getDate(room.checkout),
      checkInTime: rule?.checkin_time ?? "Available at check-in",
      checkOutTime: rule?.checkout_time ?? "Available at check-out",
      nights,
    };
  });

  const location = [hotel.city, hotel.state, hotel.country]
    .filter(Boolean)
    .join(", ");

  const ticketInfo = {
    hotelName: hotel.name,
    city: hotel.city,
    country: hotel.country,
    location,
    paymentIntentId,
    totalGuests: guestNames.length,
    totalRooms: rooms.length,
    totalPrice: booking.total,
    currencySymbol: booking.currencySymbol,
    guestNames,
    roomDetails,
  };

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <HotelTicket ticketInfo={ticketInfo} />
        <article>
          <h5 className="text-2xl font-semibold mb-[34px]">
            Terms and Conditions
          </h5>
          <div className="mb-[34px]">
            <p className="mb-4 text-xl font-medium">Payments</p>
            <ul className="list-disc flex flex-col gap-y-4 mx-4">
              {termsAndConditions.map((content, index) => (
                <li key={index} className="text-sm">
                  {content.list}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xl font-medium">Contact Us</p>
            <CompanyAddress />
          </div>
        </article>
      </div>
    </section>
  );
};
