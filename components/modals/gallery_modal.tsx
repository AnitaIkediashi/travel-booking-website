"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryReview } from "@/types/hotel_type";
import type { HotelGalleryProps } from "../sections/hotels/hotel_gallery";
import { ChevronIcon } from "../icons/chevron";
import { CloseIcon } from "../icons/close";
import { Button } from "../reusable/button";
import { Avatar } from "antd";

type GalleryModalProps = Omit<HotelGalleryProps, "reviews"> & {
  reviews: GalleryReview[];
  startIndex: number | null;
  onClose: () => void;
};

export const GalleryModal = ({
  images,
  hotelName,
  startIndex,
  rating,
  ratingLabel,
  reviewCount,
  amenities,
  reviews,
  onClose,
}: GalleryModalProps) => {
  // null = album grid, number = previewing that image
  const [active, setActive] = useState<number | null>(startIndex);
  const [visible, setVisible] = useState(false);
  const [bar, setBar] = useState({ left: 0, width: 100 });

  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const last = images.length - 1;

  const TOP_REVIEWS = 10;
  const topReviews = reviews.slice(0, TOP_REVIEWS);

  // fade the modal in after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // lock page scroll while the modal is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((i) => (i === null ? i : Math.min(last, Math.max(0, i + dir)))),
    [last],
  );

  // keyboard: Esc steps back (preview -> album -> close), arrows move
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (active !== null) setActive(null);
        else onClose();
      } else if (active !== null && e.key === "ArrowRight") go(1);
      else if (active !== null && e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go, onClose]);

  // size and position of the scroll bar under the thumbnail strip
  const updateBar = useCallback(() => {
    const el = stripRef.current;
    if (!el || el.scrollWidth === 0) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setBar({
      left: (scrollLeft / scrollWidth) * 100,
      width: Math.min(100, (clientWidth / scrollWidth) * 100),
    });
  }, []);

  const showBar = images.length >= 8;

  // keep the active thumbnail in view (child 0 is the "back to album" tile)
  useEffect(() => {
    if (active === null) return;
    const el = stripRef.current?.children[active + 1] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    updateBar();
  }, [active, updateBar]);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${hotelName} photos`}
      onClick={onClose}
      className={`fixed inset-0 z-50 flex justify-center bg-black/60 transition-opacity duration-300 motion-reduce:transition-none sm:p-6 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex h-full w-full max-w-350 flex-col overflow-hidden bg-white transition-transform duration-300 motion-reduce:transition-none sm:rounded-2xl ${
          visible ? "translate-y-0" : "translate-y-4"
        }`}
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
          {active !== null ? (
            <Button
              type="button"
              onClick={() => setActive(null)}
              label="Back to album"
              icon={<ChevronIcon dir="left" />}
              className="flex items-center gap-1 text-sm font-semibold"
            />
          ) : (
            <p className="truncate text-sm font-bold sm:text-base">
              {hotelName}
            </p>
          )}

          <Button
            ref={closeRef}
            label="Close"
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium"
            icon={<CloseIcon />}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[1fr_360px] lg:overflow-hidden">
          {/* images */}
          <div className="p-4 sm:p-6 lg:overflow-y-auto">
            {active === null ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Preview photo ${i + 1} of ${images.length}`}
                    className="group relative aspect-4/3 overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={src}
                      alt={`${hotelName} photo ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </button>
                ))}
              </div>
            ) : (
              /* preview */
              <div className="flex flex-col gap-3">
                <div
                  className="relative h-[50dvh] overflow-hidden rounded-xl bg-black lg:h-[calc(100dvh-17rem)]"
                  onTouchStart={(e) => {
                    touchX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={onTouchEnd}
                >
                  <div
                    className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                  >
                    {images.map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="relative h-full w-full shrink-0 overflow-hidden"
                      >
                        {Math.abs(i - active) <= 1 && (
                          <>
                            <Image
                              src={src}
                              alt=""
                              aria-hidden="true"
                              fill
                              sizes="25vw"
                              className="scale-110 object-cover opacity-70 blur-2xl"
                            />
                            <Image
                              src={src}
                              alt={`${hotelName} photo ${i + 1}`}
                              fill
                              sizes="(min-width: 1024px) 60vw, 100vw"
                              priority={i === active}
                              draggable={false}
                              className="object-contain"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={active === 0}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg bg-white text-gray-900 shadow-lg transition-opacity disabled:opacity-40 sm:h-12 sm:w-12"
                    icon={<ChevronIcon dir="left" />}
                  />
                  <Button
                    type="button"
                    onClick={() => go(1)}
                    disabled={active === last}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg bg-white text-gray-900 shadow-lg transition-opacity disabled:opacity-40 sm:h-12 sm:w-12"
                    icon={<ChevronIcon dir="right" />}
                  />

                  <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {active + 1}/{images.length}
                  </span>
                </div>

                {/* thumbnail strip */}
                <div className="flex flex-col gap-2">
                  <div
                    ref={stripRef}
                    onScroll={showBar ? updateBar : undefined}
                    className="mx-auto flex w-fit max-w-full gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {/* back to album tile */}
                    <button
                      type="button"
                      onClick={() => setActive(null)}
                      aria-label="Back to album"
                      className="flex h-14 w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg bg-gray-800 text-xs font-semibold text-white sm:h-16 sm:w-24"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {[3, 10, 17].flatMap((x) =>
                          [3, 10, 17].map((y) => (
                            <rect
                              key={`${x}-${y}`}
                              x={x}
                              y={y}
                              width="4"
                              height="4"
                              rx="1"
                            />
                          )),
                        )}
                      </svg>
                      {images.length}
                    </button>

                    {/* thumbnails */}
                    {images.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Go to photo ${i + 1}`}
                        aria-current={i === active}
                        className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-24 ${
                          i === active
                            ? "border-mint-green-100 opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {showBar && (
                    <div className="h-1 w-full rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gray-500"
                        style={{
                          marginLeft: `${bar.left}%`,
                          width: `${bar.width}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* reviews and features */}
          <aside className="border-t border-gray-200 p-4 sm:p-6 lg:overflow-y-auto lg:border-l lg:border-t-0">
            {reviewCount > 0 && rating != null && (
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-mint-green-100 text-lg font-bold">
                  {rating.toFixed(1)}
                </span>
                <div>
                  <p className="font-semibold">{ratingLabel}</p>
                  <p className="text-xs opacity-70">{reviewCount} reviews</p>
                </div>
              </div>
            )}

            <h3 className="mb-3 text-sm font-bold">Features</h3>
            {amenities.length > 0 ? (
              <ul className="mb-6 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                {amenities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : (
              <p className="mb-6 text-sm opacity-70">No features listed.</p>
            )}

            <h3 className="mb-3 text-sm font-bold">Reviews</h3>
            {topReviews.length > 0 ? (
              <>
                <ul className="flex flex-col">
                  {topReviews.map((r) => {
                    const firstInitial = r.author.charAt(0).toUpperCase();
                    const lastInitial = r.author.includes(" ")
                      ? r.author
                          ?.split(" ")
                          .slice(-1)[0]
                          .charAt(0)
                          .toUpperCase()
                      : "";
                    const initials = `${firstInitial}${lastInitial}`;
                    return (
                      <li
                        key={r.id}
                        className="border-t border-gray-200 py-4 first:border-t-0 first:pt-0"
                      >
                        <p className="mb-2 text-sm leading-relaxed">
                          “{r.comment}”
                        </p>

                        <div className="flex items-center ml-1 gap-1">
                          <p className="text-xs opacity-70">
                            {r.rating != null
                              ? `${r.rating.toFixed(1)} · `
                              : ""}
                            {r.category}
                          </p>
                          <p className="text-xs opacity-70">
                            {r.image === null ? (
                              <Avatar size={30} style={{ fontSize: "12px" }}>
                                {initials}
                              </Avatar>
                            ) : (
                              <Avatar src={r.image} size={30} />
                            )}{" "}
                            {r.author}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {reviewCount > TOP_REVIEWS && (
                  <p className="mt-3 text-xs opacity-70">
                    Showing {TOP_REVIEWS} of {reviewCount} reviews
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm opacity-70">No reviews to show yet.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
