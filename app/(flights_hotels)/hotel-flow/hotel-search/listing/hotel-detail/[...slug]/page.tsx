import { NoData } from "@/components/reusable/no_data";
import { HotelDetailWrapper } from "@/components/sections/hotels/hotel_detail_wrapper";
import { getHotelDetail } from "@/helpers/query_hotels";
import { HotelSearchParams } from "@/types/hotel_type";


const HotelDetailPage = async ({ searchParams }: HotelSearchParams) => {
    const searchProps = await searchParams;
    const hotel = await getHotelDetail(searchProps);
    if(!hotel) {
      return (
        <NoData
          content="No hotel record found"
        />
      );
    }
  return <HotelDetailWrapper hotel={hotel} searchProps={searchProps} />;
};

export default HotelDetailPage