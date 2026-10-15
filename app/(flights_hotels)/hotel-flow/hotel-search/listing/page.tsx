import { searchAvailableHotels } from "@/helpers/query_hotels";
import { HotelListsProps, HotelSearchParams } from "@/types/hotel_type";

type HotelCard = Pick<
  HotelListsProps,
  | "hotel_id"
  | "hotel_name"
  | "hotel_thumb_nails"
  | "hotel_amenities"
  | "latitude"
  | "longitude"
  | "description"
  | "token"
  | "city"
  | "state"
  | "country"
  | "review_count"
  | "avg_rating"
  | "currency_symbol"
  | "currency_code"
  | "nights"
> & {
  fromPrice: number | null;
  roomCount: number;
};

function groupByHotel(rows: HotelListsProps[]): HotelCard[] {
  const map = new Map<string, HotelCard>();

  for (const row of rows) {
    let card = map.get(row.hotel_id);

    if (!card) {
      card = {
        hotel_id: row.hotel_id,
        hotel_name: row.hotel_name,
        hotel_thumb_nails: row.hotel_thumb_nails,
        hotel_amenities: row.hotel_amenities,
        latitude: row.latitude,
        longitude: row.longitude,
        description: row.description,
        token: row.token,
        city: row.city,
        state: row.state,
        country: row.country,
        review_count: row.review_count,
        avg_rating: row.avg_rating,
        currency_symbol: row.currency_symbol,
        currency_code: row.currency_code,
        nights: row.nights,
        fromPrice: null,
        roomCount: 0,
      };
      map.set(row.hotel_id, card);
    }

    card.roomCount += 1;

    if (row.stay_total !== null) {
      card.fromPrice =
        card.fromPrice === null
          ? row.stay_total
          : Math.min(card.fromPrice, row.stay_total);
    }
  }

  return [...map.values()];
}

const HotelListingPage = async ({ searchParams }: HotelSearchParams) => {
  const searchProps = await searchParams;
  const results = await searchAvailableHotels(searchProps);
  const hotels = groupByHotel(results);

  // console.log('hotels>>>>>>>>> ', hotels.splice(0,1))

  return <div>page</div>; // map over `hotels` and render a card for each
};

export default HotelListingPage;
