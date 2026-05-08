
import image1 from "../../public/authentication/flight-1.jpg";
import image2 from "../../public/authentication/flight-2.jpg";
import image3 from "../../public/authentication/hotel-1.jpg";
import image4 from "../../public/authentication/hotel-2.jpg";
import image5 from "../../public/authentication/hotel-3.jpg";
import Image from "next/image";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const allImages = [image1, image2, image3, image4, image5];

const randomImages = shuffleArray(allImages).slice(0, 3);


export const ImageCarousel = () => {

  return (
    <div className="lg:w-[55%] hidden lg:block h-full">
      <input type="radio" name="carousel" id="slider_one" />
      <input type="radio" name="carousel" id="slider_two" />
      <input type="radio" name="carousel" id="slider_three" />
      <div className="carousel_sliders">
        <label htmlFor="slider_one"></label>
      </div>
      <div className="carousel_wrapper overflow-hidden w-full h-[calc(100%-25px)]">
        <div className="carousel w-full h-full flex transition-transform duration-500">
          {randomImages.map((item, index) => (
            <Image
              key={index}
              src={item}
              alt={`image ${index}`}
              className="w-full h-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
