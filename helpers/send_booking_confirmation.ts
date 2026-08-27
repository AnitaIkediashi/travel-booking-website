import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { FlightBookingConfirmation } from "@/components/emails/flight_booking_confirmation";
import { resend } from "@/lib/resend";

export const sendFlightBookingConfirmationEmail = async (bookingId: string) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        passengers: true,
        flightOffer: {
          include: {
            segments: {
              orderBy: { departure_time: "asc" },
              include: {
                marketingCarrier: true,
                flight_info: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      console.error("Booking not found:", bookingId);
      return;
    }

    if (!booking.contact_email) {
      console.error("Booking has no contact_email, skipping email:", bookingId);
      return;
    }

    const outboundSegment = booking.flightOffer.segments.find(
      (s) => s.slice_index === 0,
    );
    const inboundSegment = booking.flightOffer.segments.find(
      (s) => s.slice_index === 1,
    );

    if (!outboundSegment) {
      console.error(
        "Booking has no outbound segment, skipping email:",
        bookingId,
      );
      return;
    }

    const toLegInfo = (segment: NonNullable<typeof outboundSegment>) => ({
      from: segment.departure_airport_code,
      to: segment.arrival_airport_code,
      departTime: segment.departure_time,
      arrivalTime: segment.arrival_time,
      flightNumber: segment.flight_info?.flight_number ?? "",
      airlineName: segment.marketingCarrier.name,
      cabinClass: segment.cabin_class,
    });

    const passengerNames = booking.passengers
      .sort((a, b) => a.passenger_index - b.passenger_index)
      .map((p) => `${p.first_name} ${p.last_name}`);

    const emailHtml = await render(
      FlightBookingConfirmation({
        bookingId: booking.id,
        passengerNames,
        outbound: toLegInfo(outboundSegment),
        inbound: inboundSegment ? toLegInfo(inboundSegment) : undefined,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: "delivered@golobe-booking-website.indevs.in",
      to: booking.contact_email,
      subject: "Your flight booking on Golobe website is confirmed",
      html: emailHtml,
    });

    if (error) {
      console.error("Resend returned an error:", error);
      return;
    }

    console.log("Booking confirmation email sent:", data?.id);
  } catch (err) {
    console.error("Unexpected error sending booking confirmation email:", err);
  }
};