import { HotelDetail, HotelSearchProps } from "@/types/hotel_type";
import { useMemo } from "react";
import { StarRating } from "./star_rating";
import { getRatingLabel } from "@/utils/getRating";
import { LocationIcon } from "@/components/icons/location";

type HotelDetailWrapperProps = {
  hotel: HotelDetail;
  searchProps: HotelSearchProps;
};

type PricedRoom = HotelDetail["rooms"][number] & { price_per_night: number };

export const HotelDetailWrapper = ({hotel, searchProps}: HotelDetailWrapperProps) => {

  const cheapest = useMemo(() => {
    const rooms = hotel.rooms ?? [];
    const priced = rooms.filter(
      (r): r is PricedRoom => r.price_per_night != null,
    );
    const bookable = priced.filter((r) => r.room_left > 0);
    const pool = bookable.length ? bookable : priced;

    return pool.length
      ? pool.reduce((min, r) =>
          r.price_per_night < min.price_per_night ? r : min,
        )
      : null;
  }, [hotel.rooms]);

  const hasReviews = hotel.hotel.review_count > 0;

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-4 items-center">
              <p className="font-bold md:text-2xl text-lg">
                {hotel.hotel.hotel_name}
              </p>
              <div>
                {hotel.hotel.avg_rating != null ? (
                  <StarRating rating={hotel.hotel.avg_rating} />
                ) : (
                  <span>No reviews yet</span>
                )}
              </div>
            </div>
            <p className="flex items-center gap-0.5 opacity-75 text-xs">
              <LocationIcon />
              {hotel.hotel.city}, {hotel.hotel.state}, {hotel.hotel.country}
            </p>
            {hasReviews && (
              <div className="flex items-center gap-2 text-xs">
                <span className="border border-mint-green-100 rounded px-2 py-1 font-medium">
                  {hotel.hotel.avg_rating?.toFixed(1)}
                </span>
                <span>
                  <strong>{getRatingLabel(hotel.hotel.avg_rating)}</strong>{" "}
                  {hotel.hotel.review_count} reviews
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <p className="md:text-[32px] text-2xl font-bold text-salmon-100">
              {cheapest?.currency_symbol}
              {cheapest?.price_per_night.toFixed(0)}
              <span className="text-sm">/night</span>
            </p>
            <form action=""></form>
          </div>
        </div>
        {/* images and the modal */}
      </div>
    </section>
  );
}
