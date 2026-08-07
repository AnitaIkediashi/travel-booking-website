import { CompanyAddress } from "@/components/reusable/company_address";
import { formatDateTime, getDate } from "@/helpers/convertNumberToTime";
import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";
import { termsAndConditions } from "@/utils/terms_condition_content";
import { FlightTicket } from "./flight_ticket";
import { getPassengerSeats } from "@/helpers/getPassengersSeatNo";

export type FlightBookingSuccessProps = {
  offers: NewFlightOffer | null;
  totalTravelers: number;
  passengerNames: string[];
  paymentIntentId: string;
  liveSeatFeesTotal: number | undefined;
  bookingId: string | undefined;
};

export const FlightBookingSuccess = async ({
  offers,
  passengerNames,
  totalTravelers,
  paymentIntentId,
  liveSeatFeesTotal,
  bookingId,
}: FlightBookingSuccessProps) => {
  if (!offers || Object.keys(offers).length === 0) return;

  const passengerSeats = await getPassengerSeats(bookingId);

  const segments = offers.segments;

  const segmentDetails = segments.map((segment) => {
    const firstLeg = segment.legs?.[0];

    const gateType = firstLeg?.departure_gate
      ? `${firstLeg.departure_gate.gate_number} (${firstLeg.departure_gate.terminal})`
      : "Available at check-in";

    const legGates = (segment.legs ?? []).map((leg) => ({
      from: leg.departure_airport_code,
      to: leg.arrival_airport_code,
      departureGate: leg.departure_gate
        ? `${leg.departure_gate.gate_number} (${leg.departure_gate.terminal})`
        : "Available at check-in",
      arrivalGate: leg.arrival_gate
        ? `${leg.arrival_gate.gate_number} (${leg.arrival_gate.terminal})`
        : "Available at check-in",
    }));

    const stopCount = Math.max(0, (segment.legs?.length ?? 1) - 1);
    const stopLabel =
      stopCount === 0 ? "non stop" : stopCount === 1 ? "1 stop" : "2 stop";

    return {
      sliceIndex: segment.slice_index, // 0 = outbound, 1 = inbound
      departAirportCode: segment.departure_airport_code,
      arrivalAirportCode: segment.arrival_airport_code,
      departTime: formatDateTime(segment.departure_time),
      arrivalTime: formatDateTime(segment.arrival_time),
      dateToDepart: getDate(segment.departure_time),
      dateToArrive: getDate(segment.arrival_time),
      flightNumber: segment.flight_info?.flight_number ?? "N/A",
      carrier: segment.marketingCarrier?.name ?? "N/A",
      stopLabel,
      gateType,
      legGates,
    };
  });

  const departAirportCode = segments[0].departure_airport_code;

  const arrivalAirportCode = segments[0].arrival_airport_code;

  const departCityAndCountry = await fetchCountryName(departAirportCode);

  const arrivalCityAndCountry = await fetchCountryName(arrivalAirportCode);

  const priceInfoObj = offers.price_breakdown;
  const totalPrice = priceInfoObj?.total_amount;

  const newTotalPrice = (totalPrice ?? 0) + (liveSeatFeesTotal ?? 0);

  const cabin = offers.branded_fareinfo?.cabin_class;

  const tripType =
    offers.trip_type === "ROUND_TRIP" ? "Round trip" : "One way";

  const ticketInfo = {
    departAirportCode,
    arrivalAirportCode,
    departCity: departCityAndCountry?.city,
    departCountry: departCityAndCountry?.country,
    arriveCity: arrivalCityAndCountry?.city,
    arriveCountry: arrivalCityAndCountry?.country,
    tripType,
    paymentIntentId,
    totalTravelers,
    cabin,
    totalPrice: newTotalPrice,
    passengerNames,
    passengerSeats,
    segmentDetails,
  };

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <FlightTicket
          ticketInfo={ticketInfo}
        />
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
