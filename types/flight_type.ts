
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

export type searchParams = {
  searchParams: SearchParamsProps;
};

export type SearchParamsProps = {
  from?: string;
  to?: string;
  trip?: string;
  depart?: string;
  return?: string;
  adults?: number;
  children?: number;
  cabin?: string;
};

export type FlightDataProps = {
  id?: string;
  duration_min?: number;
  duration_max?: number;
  cabin_class?: string;
  flight_offers?: FlightOffersProps[]
};

type FlightOffersProps = {
  id?: string;
  flight_offer_id?: string;
  price_id?: number;
  token?: string;
  trip_type?: string;
  flight_key?: string;
  segments?: SegmentProp[];
};

type SegmentProp = {
  id?: number;
  segment_id?: string;
  departure_airport_code?: string;
  arrival_airport_code?: string;
  departure_time?: string;
  arrival_time?: string;
  total_time?: number;
};
