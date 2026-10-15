
export type DestinationType = "city" | "state" | "country" | "hotel";

export type DestinationProp = {
  type: DestinationType;
  value: string;
  label: string;
  sublabel: string;
};

export type HotelSearchProps = {
  destination: string;
  destinationType?: string;
  destinationValue?: string;
  checkIn: string;
  checkOut: string;
  adults?: string;
  children?: string;
  rooms?: string;
};

export type HotelSearchParams = {
  searchParams: Promise<HotelSearchProps>;
};

export type HotelListsProps = {
  hotel_id: string;
  hotel_name: string;
  hotel_thumb_nails: string[];
  hotel_amenities: string[];
  latitude: number;
  longitude: number;
  description: string;
  token: string;
  city: string;
  state: string;
  country: string;
  room_id: string;
  room_type: string;
  bed_count: number;
  total_rooms: number;
  rooms_booked: number;
  room_left: number;
  room_amenities: string[];
  room_features: string[];
  room_size: number | null;
  room_description: string;
  review_count: number;
  avg_rating: number | null;
  room_total_amount: number | null;
  room_base_amount: number | null;
  room_tax_amount: number | null;
  room_discount_amount: number | null;
  adult_price: number | null;
  child_price: number | null;
  price_per_night: number | null;
  stay_total: number | null;
  nights: number;
  currency_symbol: string | null;
  currency_code: string | null;
};
