import { GoogleIcon } from "@/components/icons/google";
import { StarIcon } from "@/components/icons/star";
import { ReviewContentProps } from "@/types/flight_type";
import Image from "next/image";

type ReviewCardProps = {
    item: ReviewContentProps
}

export const ReviewCard = ({item}: ReviewCardProps) => {
  const truncateDesc = item.desc.length > 102 ? `${item.desc.slice(0, 102)}...` : item.desc
  return (
    <article className="relative shrink-0 mr-6 h-[608px] min-w-[350px] md:min-w-[450px] flex-1 font-montserrat">
      {/* outer box */}
      <div className="rounded-[20px] bg-mint-green-100 absolute top-[22px] right-0 -z-10 h-[calc(100%-22px)] w-[calc(100%-26px)]" />
      {/* inner box */}
      <div className="bg-white shadow-medium rounded-[20px] p-6 h-[calc(100%-24px)] w-[calc(100%-26px)]">
        <div className="flex flex-col gap-y-10 w-full h-full justify-between">
          <div className="flex flex-col gap-y-4 justify-between">
            <div className="flex flex-col gap-y-4">
              <div>
                <q className="text-2xl font-bold text-blackish-green">{item.title}</q>
              </div>
              <div className="flex flex-col justify-between gap-y-3">
                <p className="text-blackish-green/50 text-sm font-medium">{truncateDesc}</p>
                <div className="hover:underline cursor-pointer capitalize text-blackish-green text-sm font-bold self-end">view more</div>
              </div>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex gap-x-3 items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-1">
                  <h6 className="text-sm font-bold text-blackish-green">
                    {item.user}
                  </h6>
                  <small className="text-xs text-blackish-green/50 font-medium">
                    {item.company}
                  </small>
                </div>
                <div className="flex gap-x-2 items-center">
                  <GoogleIcon />
                  <small className="text-xs text-blackish-green/40 font-bold capitalize">
                    google
                  </small>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={item.image}
            alt="review card"
            width={377}
            height={200}
            className="w-full h-[200px] rounded-lg"
          />
        </div>
      </div>
    </article>
  );
}
