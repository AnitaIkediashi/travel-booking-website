
import image1 from "../../public/authentication/flight-1.jpg";
import image2 from "../../public/authentication/flight-2.jpg";
import image3 from "../../public/authentication/hotel-1.jpg";
import image4 from "../../public/authentication/hotel-2.jpg";
import image5 from "../../public/authentication/hotel-3.jpg";
import { ImageCarousel } from "./image_carousel";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const allImages = [image1, image2, image3, image4, image5];

const randomImages = shuffleArray(allImages).slice(0, 3);

export const ImageCarouselWrapper = () => {

  return (
    <div className="lg:w-[55%] hidden lg:block h-auto">
      <ImageCarousel randomImages={randomImages} />
    </div>
  );
};
