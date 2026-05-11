"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

type ImageCarouselType = {
  randomImages: StaticImageData[];
};

export const ImageCarousel = ({ randomImages }: ImageCarouselType) => {
  const [autoSlide, setAutoSlide] = useState(1);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return; //  a flag here to stop auto-slide if user interacted
    
    const interval = setInterval(() => {
      setAutoSlide((prev) => (prev === randomImages.length ? 1 : prev + 1));
    }, 3000);
    return () => clearInterval(interval); //after unmounts
  }, [isPaused, randomImages]);

  const handleManualClick = (index: number) => {
    setAutoSlide(index); // change slide
    setIsPaused(true); // Pause auto-slide

    // Resume auto-slide after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <div className="w-full h-full relative">
      <input
        type="radio"
        name="carousel"
        id="slider_one"
        className="hidden"
        checked={autoSlide === 1}
        onChange={() => setAutoSlide(1)}
      />
      <input
        type="radio"
        name="carousel"
        id="slider_two"
        className="hidden"
        checked={autoSlide === 2}
        onChange={() => setAutoSlide(2)}
      />
      <input
        type="radio"
        name="carousel"
        id="slider_three"
        className="hidden"
        checked={autoSlide === 3}
        onChange={() => setAutoSlide(3)}
      />
      <div className="carousel_sliders absolute bottom-10 flex items-center gap-2 z-20 left-1/2 -translate-x-1/2 transition-all duration-300">
        <label
          htmlFor="slider_one"
          className={`w-2.5 h-2.5 rounded-full bg-neutrals-70 cursor-pointer hover:bg-mint_green-100 slider_one ${
            autoSlide === 1 ? "w-8 h-2.5 rounded-[5px] bg-mint_green-100" : ""
          }`}
          onClick={() => handleManualClick(1)}
        />
        <label
          htmlFor="slider_two"
          className={`w-2.5 h-2.5 rounded-full bg-neutrals-70 cursor-pointer hover:bg-mint_green-100 slider_two ${
            autoSlide === 2 ? "w-8 h-2.5 rounded-[5px] bg-mint_green-100" : ""
          }`}
          onClick={() => handleManualClick(2)}
        />
        <label
          htmlFor="slider_three"
          className={`w-2.5 h-2.5 rounded-full bg-neutrals-70 cursor-pointer hover:bg-mint_green-100 slider_three ${
            autoSlide === 3 ? "w-8 h-2.5 rounded-[5px] bg-mint_green-100" : ""
          }`}
          onClick={() => handleManualClick(3)}
        />
      </div>
      <div className="carousel_wrapper overflow-hidden w-full h-[calc(100%-25px)]">
        <div className="carousel w-full h-full flex transition-transform duration-500">
          {randomImages.map((item, index) => (
            <div key={index} className="w-full h-full shrink-0">
              <Image
                src={item}
                alt={`image ${index}`}
                className="w-full h-full object-cover rounded-[30px]"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
