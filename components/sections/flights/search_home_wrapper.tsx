import { SearchFlights } from "@/components/reusable/search_flights";

export const SearchHomeWrapper = ({ from }: { from?: string | undefined }) => {
  return (
    <section className="w-full">
      <div className="pt-[90px] w-full lg:h-[537px] h-[462px] bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7)),url(/flights/flight-hero.jpg)] bg-no-repeat bg-top bg-cover font-montserrat">
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
            <SearchFlights from={from} />
          </div>
        </div>
      </div>
    </section>
  );
};
