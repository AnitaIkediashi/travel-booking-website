import { Button } from "@/components/reusable/button";
import { ReviewCard } from "./review-card";

const reviewContents = [
  {
    title: "A real sense of community, nurtured",
    desc: "Really appreciate the help and support from the staff during these tough times. Shout out to Katie for helping me always, even when I was out of the country. And always available when needed.",
    user: "Olga",
    company: "Weave Studios - Kai Tak",
    image: "/landing_page/review-card1.svg",
  },
  {
    title: "The facilities are superb. Clean, slick, bright.",
    desc: "A real sense of community, nurtured”Really appreciate the help and support from the staff during these tough times. Shout out to Katie for helping me always, even when I was out of the country. And always available when needed.",
    user: "Thomas",
    company: "Weave Studios - Olympic",
    image: "/landing_page/review-card2.svg",
  },
  {
    title: "A real sense of community, nurtured",
    desc: "Really appreciate the help and support from the staff during these tough times. Shout out to Katie for helping me always, even when I was out of the country. And always available when needed.",
    user: "Eliot",
    company: "Weave Studios - Kai Tak",
    image: "/landing_page/review-card3.svg",
  },
];

export const Reviews = () => {
  return (
    <section className="pb-[90px] lg:w-[77%] md:w-[80%] w-[95%] mx-auto font-montserrat">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex flex-col gap-y-4">
          <h2 className="font-semibold md:text-[32px] text-xl text-black">
            Reviews
          </h2>
          <p className="text-blackish-green">
            What people says about Golobe facilities
          </p>
        </div>
        <Button
          label="See All"
          className="md:w-20 w-full h-10 flex items-center justify-center border border-mint-green-100 rounded text-blackish-green font-medium text-sm hover:bg-mint-green-100"
        />
      </div>
      <div className="w-full overflow-x-hidden">
        <div className="flex max-w-full overflow-scroll hide_scroll">
            {
                reviewContents.map((item, index) => (
                    <ReviewCard item={item} key={index} />
                ))
            }
        </div>
      </div>
    </section>
  );
}
