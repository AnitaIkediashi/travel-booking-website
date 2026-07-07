import { CompanyAddress } from "@/components/reusable/company_address";
import { formatDateTime, getDate } from "@/helpers/convertNumberToTime";
import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";
import { termsAndConditions } from "@/utils/terms_condition_content";
import { FlightTicket } from "./flight_ticket";

export type FlightBookingSuccessProps = {
  offers: NewFlightOffer | null;
  totalTravelers: number;
  // cardName: string;
  paymentIntentId: string;
};

export const FlightBookingSuccess = async ({
  offers,
  // cardName,
  totalTravelers,
  paymentIntentId,
}: FlightBookingSuccessProps) => {
  if (!offers || Object.keys(offers).length === 0) return;

  const segments = offers.segments;

  const departAirportCode = segments[0].departure_airport_code;

  const arrivalAirportCode = segments[segments.length - 1].arrival_airport_code;

  const departCityAndCountry = await fetchCountryName(departAirportCode);

  const arrivalCityAndCountry = await fetchCountryName(arrivalAirportCode);

  const priceInfoObj = offers.price_breakdown;
  const totalPrice = priceInfoObj?.total?.amount;

  const cabin = offers.branded_fareinfo?.cabin_class;

  const departTime = formatDateTime(segments[0].departure_time);

  const arrivalTime = formatDateTime(
    segments[segments.length - 1].arrival_time,
  );

  const totalLegs =
    segments?.reduce((acc, segment) => acc + (segment.legs?.length ?? 0), 0) ??
    0;

  const stopCount = Math.max(0, totalLegs - 1);

  const stopLabel =
    stopCount === 0 ? "non stop" : stopCount === 1 ? "1 stop" : "2 stop";

  const flightNumber =
    segments[0]?.legs?.[0]?.flight_info?.flight_number ?? "N/A";

  const dateToDepart = getDate(segments[0].departure_time);

  const seatNo = "N/A";

  const carrier = segments[0]?.legs?.[0]?.carriers?.[0]?.name ?? "N/A";

  const gateType = "N/A";

  const tripType =
    offers.trip_type === "round-trip" ? "Round trip" : "One way";

  const ticketInfo = {
    departAirportCode,
    arrivalAirportCode,
    departCity: departCityAndCountry?.city,
    departCountry: departCityAndCountry?.country,
    arriveCity: arrivalCityAndCountry?.city,
    arriveCountry: arrivalCityAndCountry?.country,
    departTime,
    arrivalTime,
    stopLabel,
    flightNumber,
    dateToDepart,
    seatNo,
    carrier,
    gateType,
    tripType,
    paymentIntentId,
    // cardName,
    totalTravelers,
    cabin,
    totalPrice,
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
