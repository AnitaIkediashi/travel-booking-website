import { useTransition } from "react";
import { HotelCard } from "@/types/hotel_type";
import { LocationIcon } from "@/components/icons/location";
import { StarRating } from "./star_rating";
import { CupIcon } from "@/components/icons/cup";
import { Button } from "@/components/reusable/button";
import { HeartIcon } from "@/components/icons/heart";
import { useRouter } from "next/navigation";
import { Dayjs } from "dayjs";
import { getRatingLabel } from "@/utils/getRating";
import { HOTEL_DETAIL_PATH } from "@/utils/page_routes";
import { useFavourites } from "@/lib/favourite-context";
import { HotelImageCarousel } from "@/components/reusable/hotel_image_carousel";

type HotelListProps = {
  hotel: HotelCard;
  adultCount: number;
  childCount: number;
  roomCount: number;
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
};


export const HotelList = ({ hotel, adultCount, childCount, roomCount, checkIn, checkOut }: HotelListProps) => {
  const router = useRouter()
  const { isSaved, toggle } = useFavourites();
  const isLiked = isSaved(hotel.hotel_id);
  
  const [isPending, startTransition] = useTransition();

  const hasReviews = hotel.review_count > 0;

  const handleLike = () => {
    void toggle(hotel.hotel_id);
  };

  const handleHotelSearch = () => {
    startTransition(() => {
      const query = new URLSearchParams({
        hotelId: hotel.hotel_id,
        destination: hotel.hotel_name,
        checkIn: String(checkIn?.format("YYYY-MM-DD")),
        checkOut: String(checkOut?.format("YYYY-MM-DD")),
        adults: String(adultCount),
        children: String(childCount),
        rooms: String(roomCount),
        token: hotel.token,
      });

      router.push(
        `${HOTEL_DETAIL_PATH}/${hotel.hotel_id}-${hotel.token}?${query}`,
      );
    })
  }

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-stretch gap-4 md:gap-0 font-montserrat">
      {/* Image carousel */}
      <HotelImageCarousel images={hotel.hotel_thumb_nails} alt={hotel.hotel_name} />

      {/* Hotel prices and content */}
      <div className="flex-1 flex flex-col justify-between md:p-6 p-3 gap-6">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-blackish-green leading-tight">
              {hotel.hotel_name}
            </h3>

            <div className="flex flex-col gap-y-3 text-xs">
              <p className="flex items-center gap-0.5 opacity-75">
                <LocationIcon />
                {hotel.city}, {hotel.state}, {hotel.country}
              </p>

              <div className="flex items-center justify-between gap-3">
                <StarRating rating={hotel.avg_rating} />
                <div className="flex items-center">
                  <CupIcon />
                  <span className="ml-1 font-semibold">
                    {hotel.hotel_amenities.slice(0, 5).length}+
                  </span>{" "}
                  <span className="font-medium">Amenities</span>
                </div>
              </div>

              {hasReviews && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="border border-mint-green-100 rounded px-2 py-1 font-medium">
                    {hotel.avg_rating.toFixed(1)}
                  </span>
                  <span>
                    <strong>{getRatingLabel(hotel.avg_rating)}</strong>{" "}
                    {hotel.review_count} reviews
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            {hotel.fromPrice !== null ? (
              <>
                <p className="text-xs font-medium opacity-75">starting from</p>
                <p className="text-xl md:text-2xl font-bold text-salmon-100">
                  {hotel.currency_symbol}
                  {hotel.fromPrice.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                  <span className="text-sm">/night</span>
                </p>
                <p className="text-xs font-medium opacity-75">excl. tax</p>
              </>
            ) : (
              <p className="text-xs font-medium opacity-75">
                No availability for these dates
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-blackish-green/25 pt-4 flex items-center gap-4">
          <Button
            type="button"
            aria-label={
              isLiked ? "Remove from favourites" : "Add to favourites"
            }
            aria-pressed={isLiked}
            onClick={handleLike}
            className="h-12 w-12 shrink-0 rounded border border-mint-green-100 flex items-center justify-center"
            icon={<HeartIcon isLiked={isLiked} />}
          />

          <Button
            type="button"
            onClick={handleHotelSearch}
            className="flex-1 h-12 rounded bg-mint-green-100 text-blackish-green text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            label={isPending ? "Loading" : "View Place"}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
};
