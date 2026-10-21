import { useEffect, useRef, useState, useTransition } from "react";
import { HotelCard } from "@/types/hotel_type";
import Image from "next/image";
import { LocationIcon } from "@/components/icons/location";
import { StarRating } from "./star_rating";
import { CupIcon } from "@/components/icons/cup";
import { Button } from "@/components/reusable/button";
import { HeartIcon } from "@/components/icons/heart";
import { useRouter } from "next/navigation";
import { Dayjs } from "dayjs";

type HotelListProps = {
  hotel: HotelCard;
  adultCount: number;
  childCount: number;
  roomCount: number;
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
};

const AUTO_SWIPE_MS = 4000;
const SWIPE_THRESHOLD = 0.15; // fraction of the width needed to change slide

const getRatingLabel = (rating: number) => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Very Good";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Fair";
  return "Poor";
};

export const HotelList = ({ hotel, adultCount, childCount, roomCount, checkIn, checkOut }: HotelListProps) => {
  const router = useRouter()
  const thumbnails = hotel.hotel_thumb_nails ?? [];
  const total = thumbnails.length;

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, startTransition] = useTransition();

  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto swipe (pauses on hover / drag)
  useEffect(() => {
    if (total <= 1 || isHovered || isDragging) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, AUTO_SWIPE_MS);

    return () => clearInterval(timer);
  }, [total, isHovered, isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    let delta = e.clientX - startX.current;

    // add resistance at the first / last slide
    const atStart = index === 0 && delta > 0;
    const atEnd = index === total - 1 && delta < 0;
    if (atStart || atEnd) delta *= 0.3;

    setDragX(delta);
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    const width = containerRef.current?.offsetWidth ?? 0;

    if (dragX < -width * SWIPE_THRESHOLD && index < total - 1) {
      setIndex((prev) => prev + 1);
    } else if (dragX > width * SWIPE_THRESHOLD && index > 0) {
      setIndex((prev) => prev - 1);
    }

    setDragX(0);
    setIsDragging(false);
  };

  const hasReviews = hotel.review_count > 0;

  const handleLike =() => {
    setIsLiked((prev) => !prev);
  }

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

      router.push(`/hotel-flow/hotel-search/listing/hotel-detail?${query}`);
    })
  }

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-stretch gap-4 md:gap-0 font-montserrat">
      {/* Image carousel */}
      <div
        ref={containerRef}
        className="relative w-full md:w-[35%] h-56 md:h-auto md:min-h-[280px] md:my-0 overflow-hidden rounded-xl select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex h-full touch-pan-y cursor-grab active:cursor-grabbing ${
            isDragging ? "" : "transition-transform duration-500 ease-out"
          }`}
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          {thumbnails.map((src, i) => (
            <Image
              key={src + i}
              src={src}
              alt={`${hotel.hotel_name} - image ${i + 1}`}
              width={600}
              height={400}
              sizes="(min-width: 768px) 35vw, 100vw"
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              className="min-w-full h-full object-cover"
            />
          ))}
        </div>

        {/* image count badge */}
        {total > 0 && (
          <span className="absolute top-3 left-3 rounded-lg bg-white/30 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
            {total} {total === 1 ? "image" : "images"}
          </span>
        )}

        {/* dots */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {thumbnails.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hotel prices and content */}
      <div className="flex-1 flex flex-col justify-between md:p-6 p-3 gap-6">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-blackish-green leading-tight">
              {hotel.hotel_name}
            </h3>

            <div className="flex flex-col gap-y-3 text-xs">
              <p className="flex items-center gap-1.5 opacity-75">
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
            label={isPending ? "Loading" :"View Place"}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
};
