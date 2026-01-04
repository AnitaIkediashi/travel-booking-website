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