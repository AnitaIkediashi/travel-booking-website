"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryModal } from "@/components/modals/gallery_modal";
import { GalleryReview } from "@/types/hotel_type";
import { Button } from "@/components/reusable/button";

export type HotelGalleryProps = {
  images: string[];
  hotelName: string;
  rating: number | null;
  ratingLabel: string | null;
  reviewCount: number;
  amenities: string[];
  reviews?: GalleryReview[];
};

export const HotelGallery = ({
  images,
  hotelName,
  rating,
  ratingLabel,
  reviewCount,
  amenities,
  reviews = [],
}: HotelGalleryProps) => {
  const [open, setOpen] = useState(false);
  // null = album grid, number = previewing that image
  const [startIndex, setStartIndex] = useState<number | null>(null);

  const hero = images.slice(0, 5);

  const openModal = (index: number | null) => {
    setStartIndex(index);
    setOpen(true);
  };

  if (hero.length === 0) {
    return (
      <div className="grid h-60 place-items-center rounded-xl bg-gray-100 text-sm opacity-75">
        No photos available
      </div>
    );
  }

  // a single photo fills the whole grid; otherwise the first one is the big tile
  const firstSpan =
    hero.length === 1
      ? "md:col-span-4 md:row-span-2"
      : "md:col-span-2 md:row-span-2";

  return (
    <>
      <div className="relative">
        <div className="grid h-60 grid-cols-1 gap-2 overflow-hidden rounded-xl sm:h-85 md:grid-cols-4 md:grid-rows-2 lg:h-105">
          {hero.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => openModal(i)}
              aria-label={`Open photo ${i + 1} of ${images.length}`}
              className={`group relative overflow-hidden bg-gray-100 ${
                i === 0 ? firstSpan : "hidden md:block"
              }`}
            >
              <Image
                src={src}
                alt={`${hotelName} photo ${i + 1}`}
                fill
                priority={i === 0}
                sizes={
                  i === 0
                    ? "(min-width: 768px) 50vw, 100vw"
                    : "(min-width: 768px) 25vw, 0px"
                }
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </button>
          ))}
        </div>

        <Button
          type="button"
          label="View all photos"
          onClick={() => openModal(null)}
          className="absolute bottom-3 right-3 rounded-md bg-mint-green-100 px-4 py-2 text-xs font-medium shadow-md sm:text-sm"
        />
      </div>

      {open && (
        <GalleryModal
          images={images}
          hotelName={hotelName}
          startIndex={startIndex}
          rating={rating}
          ratingLabel={ratingLabel}
          reviewCount={reviewCount}
          amenities={amenities}
          reviews={reviews}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
