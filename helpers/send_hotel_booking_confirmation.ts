import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { HotelBookingConfirmation } from "@/components/emails/hotel_booking_confirmation";

export const sendHotelBookingConfirmationEmail = async (bookingId: string) => {
  try {
    const booking = await prisma.hotelBooking.findUnique({
      where: { id: bookingId },
      include: {
        guests: { orderBy: { guest_index: "asc" } },
        booking_rooms: {
          orderBy: { checkin_time: "asc" },
          include: { room: { include: { hotel: true } } },
        },
      },
    });

    if (!booking) {
      console.error("Hotel booking not found:", bookingId);
      return;
    }

    if (!booking.contact_email) {
      console.error(
        "Hotel booking has no contact_email, skipping email:",
        bookingId,
      );
      return;
    }

    if (booking.booking_rooms.length === 0) {
      console.error("Hotel booking has no rooms, skipping email:", bookingId);
      return;
    }

    const hotel = booking.booking_rooms[0].room.hotel;

    // Rules holds the hotel's check-in / check-out times
    const rule = await prisma.rules.findFirst({
      where: { hotel_id: hotel.id },
      select: { checkin_time: true, checkout_time: true },
    });

    const guestNames = booking.guests.map(
      (g) => `${g.first_name} ${g.last_name}`,
    );

    const rooms = booking.booking_rooms.map((br) => ({
      roomType: br.room.room_type,
      checkIn: br.checkin_time,
      checkOut: br.checkout_time,
    }));

    const emailHtml = await render(
      HotelBookingConfirmation({
        bookingId: booking.id,
        hotelName: hotel.name,
        location: [hotel.city, hotel.state, hotel.country]
          .filter(Boolean)
          .join(", "),
        checkInTime: rule?.checkin_time,
        checkOutTime: rule?.checkout_time,
        guestNames,
        rooms,
        currencySymbol: booking.currency_symbol,
        total: Number(booking.room_fee_total ?? 0),
      }),
    );

    const { data, error } = await resend.emails.send({
      from: "delivered@golobe-booking-website.indevs.in",
      to: booking.contact_email,
      subject: `Your stay at ${hotel.name} on Golobe website is confirmed`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend returned an error:", error);
      return;
    }

    console.log("Hotel booking confirmation email sent:", data?.id);
  } catch (err) {
    console.error(
      "Unexpected error sending hotel booking confirmation email:",
      err,
    );
  }
};
