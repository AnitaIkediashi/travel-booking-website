export type AirportProps = {
  airport_name: string;
  airport_code: string;
  imageUrl: string;
  city: string;
  country: string;
};

export type CarrierDataProps = {
  carrier_id: number;
  name: string;
  logo: string;
  code: string;
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
  searchParams: FlightSearchParamsProps;
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
};

export type FlightDataProps = {
  id: string;
  duration_min?: number;
  duration_max?: number;
  cabin_class?: string;
  min_price?: MinPrice | null;
  short_layover_connection?: ShortLayoverConnection | null;
  baggage?: Baggage[];
  departure_intervals?: DepartureInterval[];
  stops?: Stop[];
  airlines?: Airline[];
  duration?: Duration[];
  flight_times?: FlightTime[];
  flight_offers?: FlightOffer[] | undefined;
};

type DepartureInterval = {
  id?: number
  interval_id?: string
  start?: string
  end?: string
}

type ShortLayoverConnection = {
  id?: number;
  layover_id?: string;
  count?: number | null;
};

type MinPrice = {
  id?: number;
  min_price_data_id?: string;
  min_price_airline_id?: string | null;
  min_price_stop_id?: number | null;
  currency_code?: string | null;
  amount?: number;
};

export type Stop = {
  id?: number;
  stop_id?: string;
  no_of_stops?: number;
  count?: number | null;
};

type Airline = {
  id?: string;
  airline_id?: string;
  name?: string;
  logo?: string;
  iata_code?: string;
};

type Duration = {
  id?: number;
  duration_id?: string;
  min?: number;
  max?: number;
};

type Baggage = {
  id?: number;
  baggage_id?: string;
  type?: string;
  included?: boolean;
  weight?: number | null;
  param_name?: string | null;
}; 

type FlightTime = {
  id?: string;
  flight_times_id?: string;
  arrival?: Arrival[];
  depart?: Depart[];
};

type Arrival = {
  id?: number;
  arrival_id?: string;
  start?: string;
  end?: string;
};

type Depart = {
  id?: number;
  depart_id?: string;
  start?: string;
  end?: string;
};

export type FlightOffer = {
  id?: string;
  flight_offer_id?: string;
  price_id?: number | null;
  token?: string;
  trip_type?: string;
  flight_key?: string;
  segments?: SegmentProp[];
  price_breakdown?: PriceBreakdown | null;
  traveler_price?: TravelerPrice[];
  seat_availability?: SeatAvailability | null;
  branded_fareinfo?: BrandedFareInfo | null;
};

type SegmentProp = {
  id?: number;
  segment_id?: string;
  departure_airport_code?: string;
  arrival_airport_code?: string;
  departure_time?: Date;
  arrival_time?: Date;
  total_time?: number;
  legs?: Leg[];
};

type Leg = {
  id?: number;
  leg_id?: number;
  departure_airport_code?: string;
  arrival_airport_code?: string;
  departure_time?: Date;
  arrival_time?: Date;
  cabin_class?: string | null;
  total_time?: number;
  carriers?: Carrier[];
  flight_info?: FlightInfo | null;
};

type Carrier = {
  id?: number;
  carrier_id?: number;
  name?: string;
  logo?: string;
  code?: string;
};

type FlightInfo = {
  id?: number;
  flight_info_id?: number;
  flight_number?: string;
  carrier_info?: CarrierInfo | null;
};

type CarrierInfo = {
  id?: number;
  carrier_info_id?: number;
  operating_carrier?: string;
};

type PriceBreakdown = {
  id?: number;
  total?: TotalPrice | null;
  base_fare?: BaseFare | null;
  tax?: Tax | null;
  discount?: Discount | null;
};

type TotalPrice = {
  id?: number;
  total_price_id?: number;
  currency_code?: string;
  amount?: number;
};

type BaseFare = {
  id?: number;
  base_price_id?: number;
  currency_code?: string;
  amount?: number;
};

type Tax = {
  id?: number;
  tax_id?: number;
  currency_code?: string;
  amount?: number;
};

type Discount = {
  id?: number;
  discount_id?: number;
  currency_code?: string;
  amount?: number;
};

type TravelerPrice = {
  id?: number;
  traveler_price_id?: string;
  price_id?: number | null;
  traveler_reference?: string;
  traveler_type?: string;
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
