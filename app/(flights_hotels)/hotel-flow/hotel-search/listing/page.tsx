import { searchAvailableHotels } from "@/helpers/query_hotels";
import { HotelListsProps, HotelSearchParams } from "@/types/hotel_type";

type HotelGroup = {
  hotel: HotelListsProps;
  rooms: HotelListsProps[];
  fromPrice: number | null;
};

function groupByHotel(rows: HotelListsProps[]): HotelGroup[] {
  const map = new Map<string, HotelGroup>();

  for (const row of rows) {
    const group = map.get(row.hotel_id) ?? {
      hotel: row,
      rooms: [],
      fromPrice: null,
    };
    group.rooms.push(row);

    if (row.stay_total !== null) {
      const total = Number(row.stay_total);
      group.fromPrice =
        group.fromPrice === null ? total : Math.min(group.fromPrice, total);
    }
    map.set(row.hotel_id, group);
  }

  return [...map.values()];
}

const HotelListingPage = async ({ searchParams }: HotelSearchParams) => {
  const searchProps = await searchParams;
  const results = await searchAvailableHotels(searchProps);
  const hotels = groupByHotel(results);
  
  // console.log('hotel array>>>>>> ', hotels.splice(0,1))
  return <div>page</div>;
};

export default HotelListingPage;
