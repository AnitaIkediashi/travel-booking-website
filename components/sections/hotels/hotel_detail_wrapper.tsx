import { HotelDetail, HotelSearchProps } from "@/types/hotel_type";
import { useMemo } from "react";
import { StarRating } from "./star_rating";
import { getRatingLabel } from "@/utils/getRating";
import { LocationIcon } from "@/components/icons/location";
import { HotelGallery } from "./hotel_gallery";
import { SparkleIcon } from "@/components/icons/sparkle";
import Image from "next/image";
import { Button } from "@/components/reusable/button";
import Link from "next/link";
import { HotelAmenities } from "./hotel_amenities";
import { Avatar } from "antd";

type HotelDetailWrapperProps = {
  hotel: HotelDetail;
  searchProps: HotelSearchProps;
};

type PricedRoom = HotelDetail["rooms"][number] & { price_per_night: number };

export const HotelDetailWrapper = ({
  hotel,
  searchProps,
}: HotelDetailWrapperProps) => {
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
  const highlights = (hotel.hotel.hotel_amenities ?? []).slice(
    0,
    hasReviews ? 4 : 5,
  );
  const { latitude, longitude } = hotel.hotel;
  const hasCoords = latitude != null && longitude != null;

  return (
    <>
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
          <HotelGallery
            images={hotel.hotel.hotel_thumb_nails ?? []}
            hotelName={hotel.hotel.hotel_name}
            rating={hotel.hotel.avg_rating}
            ratingLabel={getRatingLabel(hotel.hotel.avg_rating)}
            reviewCount={hotel.hotel.review_count}
            amenities={hotel.hotel.hotel_amenities ?? []}
            reviews={hotel.reviews}
          />
          <div className="mt-10 md:mt-16 border-t border-t-blackish-green/25">
            <div className="pt-10 md:pt-16 pb-8">
              <h3 className="capitalize text-lg md:text-xl font-bold mb-4">
                overview
              </h3>
              <p className="font-medium opacity-75">
                {hotel.hotel.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {hasReviews && hotel.hotel.avg_rating != null && (
                <div className="flex min-h-28 w-full shrink-0 flex-col justify-between rounded-lg border border-mint-green-100 bg-mint-green-100 p-4 sm:w-40 md:min-h-32 md:w-44">
                  <p className="text-3xl font-medium">
                    {hotel.hotel.avg_rating.toFixed(1)}
                  </p>
                  <div>
                    <p className="text-sm font-bold">
                      {getRatingLabel(hotel.hotel.avg_rating)}
                    </p>
                    <p className="text-xs">
                      {hotel.hotel.review_count} reviews
                    </p>
                  </div>
                </div>
              )}

              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex min-h-28 w-[calc(50%-0.375rem)] shrink-0 flex-col justify-between rounded-lg border border-mint-green-100 p-4 sm:w-40 md:min-h-32 md:w-44"
                >
                  <SparkleIcon />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
            <div className="w-full my-10 md:my-16 border-t border-t-blackish-green/25" />
            {/* room list */}
            <div>
              <h3 className="capitalize text-lg md:text-xl font-bold md:mb-8 mb-5">
                available rooms
              </h3>
              {/* list of the rooms */}
              <ul className="flex flex-col">
                {(hotel.rooms ?? []).map((room, i) => {
                  const thumbs = hotel.hotel.hotel_thumb_nails ?? [];
                  const thumb = thumbs.length
                    ? thumbs[i % thumbs.length]
                    : null;
                  const soldOut = room.room_left < 1;
                  const noPrice = room.price_per_night == null;

                  return (
                    <li
                      key={room.room_id}
                      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-b-blackish-green/25 py-4 last:border-b-0"
                    >
                      <div className="flex basis-full items-center gap-3 sm:min-w-0 sm:flex-1 sm:basis-0">
                        <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded">
                          {thumb && (
                            <Image
                              src={thumb}
                              alt={`${room.room_type} room`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>

                        <p className="font-medium">
                          {room.room_type} - {room.bed_count}{" "}
                          {room.bed_count === 1 ? "bed" : "beds"} ·{" "}
                          {!soldOut && room.room_left <= 3 && (
                            <span className="font-medium text-salmon-100">
                              {" "}
                              · Only {room.room_left} left
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:gap-8">
                        <p className="text-xl font-semibold md:text-2xl">
                          {noPrice ? (
                            "N/A"
                          ) : (
                            <>
                              {room.currency_symbol}
                              {room.price_per_night?.toFixed(0)}
                            </>
                          )}
                          <span className="text-sm">/night</span>
                        </p>

                        <Button
                          type="button"
                          disabled={soldOut || noPrice}
                          label={soldOut ? "Sold out" : "Book now"}
                          // onClick={() => {
                          //   // handleBook(room.room_id)
                          // }}
                          className="rounded-md bg-mint-green-100 px-6 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="w-full my-10 md:my-16 border-t border-t-blackish-green/25" />
            {/* map */}
            <div>
              <div className="mb-5 flex items-center justify-between gap-4 md:mb-8">
                <h3 className="text-lg font-bold md:text-xl">Location/Map</h3>

                {hasCoords && (
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded bg-mint-green-100 px-4 py-[15.5px] text-xs font-semibold sm:text-sm"
                  >
                    View on google maps
                  </Link>
                )}
              </div>

              {/* embed map */}
              {hasCoords ? (
                <div className="h-64 w-full overflow-hidden rounded-xl bg-gray-100 sm:h-80 lg:h-[450px]">
                  <iframe
                    title={`Map showing ${hotel.hotel.hotel_name}`}
                    src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="grid h-64 place-items-center rounded-xl bg-gray-100 text-sm opacity-75">
                  Map unavailable
                </div>
              )}
              <p className="mt-2 flex items-center gap-0.5 text-xs opacity-75">
                <LocationIcon />
                {hotel.hotel.city}, {hotel.hotel.state}, {hotel.hotel.country}
              </p>
            </div>
            <div className="w-full my-10 md:my-16 border-t border-t-blackish-green/25" />
            <div>
              <h3 className="capitalize text-lg md:text-xl font-bold mb-5 md:mb-8">
                amenities
              </h3>
              <HotelAmenities amenities={hotel.hotel.hotel_amenities ?? []} />
            </div>
            <div className="w-full my-10 md:my-16 border-t border-t-blackish-green/25" />
            {/* reviews */}
            <div>
              <div className="flex items-center justify-between mb-5 md:mb-8">
                <h3 className="capitalize text-lg md:text-xl font-bold">
                  reviews
                </h3>
                <Button
                  className="rounded bg-mint-green-100 px-4 py-[15.5px] text-xs font-semibold sm:text-sm shrink-0"
                  label="Give your review"
                />
              </div>
              <div className="mb-3 md:mb-6 flex gap-x-2 md:gap-x-4">
                {hasReviews && (
                  <>
                    <h1 className="text-3xl md:text-[50px] font-bold">
                      {hotel.hotel.avg_rating?.toFixed(1)}
                    </h1>
                    <div className="flex flex-col gap-2">
                      <p className="text-lg md:text-xl font-semibold">
                        {getRatingLabel(hotel.hotel.avg_rating)}
                      </p>
                      <p className="text-xs md:text-sm">
                        {hotel.hotel.review_count} verified reviews
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div>
                {hasReviews && hotel.reviews && hotel.reviews.length > 0 ? (
                  <div className="divide-y divide-blackish-green/25">
                    {hotel.reviews.map((review) => {
                      const firstInitial = review.author.charAt(0).toUpperCase();
                  const lastInitial = review.author.includes(" ")
                    ? review.author?.split(" ").slice(-1)[0].charAt(0).toUpperCase()
                    : "";
                    const initials = `${firstInitial}${lastInitial}`;
                      return (
                        <div
                          key={review.id}
                          className="py-4 md:py-6 flex items-start justify-between gap-4"
                        >
                          {review.image === null ? (
                            <Avatar size={45} style={{ fontSize: "14px" }}>
                              {initials}
                            </Avatar>
                          ) : (
                            <Avatar src={review.image} size={45} />
                          )}
                          <div>

                          </div>
                        </div>
                      );
                    }
                  )
                  }
                  </div>
                ) : (
                  <p className="text-sm opacity-75">
                    No reviews available yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
