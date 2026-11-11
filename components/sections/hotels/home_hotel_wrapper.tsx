import { SearchStays } from "@/components/reusable/search_stays";

export const HomeHotelWrapper = ({
  destination,
}: {
  destination?: string | undefined;
}) => {
  return (
    <section className="w-full">
      <div className="pt-[90px] w-full lg:h-[537px] h-[462px] bg-[image:linear-gradient(90deg,rgba(0,35,77,0.63)_11.46%,rgba(0,35,77,0)_77.37%),url('/hotels/hotel_hero.jpg')] bg-no-repeat bg-center bg-cover font-montserrat">
        <div className="relative z-10 mt-10 lg:mt-20 w-full lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0 text-white">
          <div className="max-w-[440px] md:max-w-[480px]">
            <h2 className="font-bold text-3xl md:text-[40px] lg:text-[45px] leading-tight text-balance drop-shadow-md">
              Make your travel wishlist, we’ll do the rest
            </h2>
            <p className="mt-3 text-lg lg:text-xl font-medium">
              Special offers to suit your plan
            </p>
          </div>
        </div>
        <div className="relative top-20">
          <div className="lg:w-[77%] md:w-[80%] w-full mx-auto rounded-2xl bg-white shadow-light px-6 pt-4 pb-8 font-montserrat">
            <h4 className="capitalize md:text-xl text-lg font-semibold md:mb-8 mb-6">
              Where are you flying?
            </h4>
            <SearchStays destination={destination} />
          </div>
        </div>
      </div>
    </section>
  );
};
