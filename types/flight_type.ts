export type TripType = "ONE_WAY" | "ROUND_TRIP";

export type AirportProps = {
  airport_name: string;
  airport_code: string;
  imageUrl: string;
  city: string;
  country: string;
};

export type LocationProps = {
  airport_code?: string;
  image_url: string | null;
  city: string;
  country: string;
};

export type ReviewContentProps = {
  title: string;
  desc: string;
  user: string;
  company: string;
  image: string;
};

export type FlightSearchParams = {
  searchParams: Promise<FlightSearchParamsProps>;
};

export type FlightSearchParamsProps = {
  from?: string;
  to?: string;
  trip?: string;
  depart?: string;
  return?: string;
  adults?: number;
  child?: number;
  infant?: number;
  cabin?: string;
  token?: string;
  bookingId?: string;
};

export type FlightDataProps = {
  id: string;
  createdAt?: Date;
  flight_offers?: FlightOffer[];
};

export type FlightOffer = {
  id?: string;
  flight_offer_id?: string;
  price_id?: number | null;
  total_duration?: number;
  trip_type?: TripType | null;
  token?: string;
  flight_key?: string;
  segments?: SegmentProp[];
  price_breakdown?: PriceBreakdown | null;
  traveler_price?: TravelerPrice[];
  branded_fareinfo?: BrandedFareInfo | null;
};

type SegmentProp = {
  id?: string;
  segment_id?: string;
  departure_airport_code?: string;
  arrival_airport_code?: string;
  departure_time?: Date;
  arrival_time?: Date;
  duration?: number;
  cabin_class?: string;
  slice_index?: number; // 0 = Outbound, 1 = Inbound
  legs?: Leg[];
  seat_availability?: SeatAvailability | null;
  flight_info?: FlightInfo | null;
  marketingCarrier?: Carrier;
  operatingCarrier?: Carrier | null;
};

export type Leg = {
  id?: number;
  leg_id?: string;
  departure_airport_code?: string;
  arrival_airport_code?: string;
  departure_time?: Date;
  arrival_time?: Date;
  duration?: number;
  departure_gate?: Gate | null;
  arrival_gate?: Gate | null;
};

type Gate = {
  gate_number?: string;
  terminal?: string;
};

export type Carrier = {
  id?: number;
  carrier_id?: string;
  name?: string;
  logo?: string;
  code?: string;
};

export type FlightInfo = {
  id?: number;
  flight_info_id?: string;
  flight_number?: string;
};

type PriceBreakdown = {
  id?: number;
  currency_code?: string | undefined;
  total_amount?: number;
  base_amount?: number;
  tax_amount?: number;
  discount_amount?: number | null;
};

type TravelerPrice = {
  id?: number;
  passenger_type?: string;
  quantity?: number;
  base_fare?: number;
  tax_amount?: number;
  total_per_pax?: number;
};

type SeatAvailability = {
  id?: number;
  seat_availability_id?: string;
  seats_left?: number;
};

type BrandedFareInfo = {
  id?: number;
  branded_fareinfo_id?: string;
  cabin_class?: string;
  features?: Feature[];
};

type Feature = {
  id?: number;
  feature_id?: number;
  feature_name?: string;
  category?: string;
  availability?: string;
};

export type NewFlightOffer = {
  id: string;
  flight_offer_id: string;
  token: string;
  total_duration: number;
  trip_type?: TripType | null;
  flight_key: string;
  segments: SegmentProp[];
  branded_fareinfo: BrandedFareInfo | null;
  traveler_price: TravelerPrice[];
  price_breakdown: PriceBreakdown | null;
};
