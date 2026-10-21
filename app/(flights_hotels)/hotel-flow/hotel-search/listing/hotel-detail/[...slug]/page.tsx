import { HotelSearchParams } from "@/types/hotel_type";

const HotelDetailPage = async ({ searchParams }: HotelSearchParams) => {
    const searchProps = await searchParams;
  return <div>HotelDetailPage</div>;
};

export default HotelDetailPage