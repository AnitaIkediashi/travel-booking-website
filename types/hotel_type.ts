export type DestinationProp = {
  id: string;
  name: string;
  country: string;
  city: string;
  state: string;
};

export type HotelSearchParams = {
  searchParams: Promise<HotelSearchProps>
};

export type HotelSearchProps = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
};
