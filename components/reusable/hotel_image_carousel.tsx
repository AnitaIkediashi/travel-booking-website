"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const AUTO_SWIPE_MS = 4000;
const SWIPE_THRESHOLD = 0.15; // fraction of the width needed to change slide

export function HotelImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const total = images.length;

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full md:w-[35%] h-56 md:h-auto md:min-h-[280px] overflow-hidden rounded-xl select-none bg-neutral-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 flex touch-pan-y cursor-grab active:cursor-grabbing ${
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
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={`${alt} - image ${i + 1}`}
            width={600}
            height={400}
            sizes="(min-width: 768px) 35vw, 100vw"
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-full shrink-0 object-cover"
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
          {images.map((_, i) => (
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
  );
}
