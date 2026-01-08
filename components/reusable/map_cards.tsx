import Image from "next/image";

type MapCardProps = {
  sideImg: string;
  arrowImg: string;
  circlePosition: string;
  userName: string;
  location: string;
  className: string;
  arrowPosition: string
  arrowWidth: number;
  arrowHeight: number
};

export const MapCards = ({
  sideImg,
  arrowImg,
  circlePosition,
  userName,
  location,
  className,
  arrowPosition,
  arrowWidth,
  arrowHeight

}: MapCardProps) => {
  return (
    <div className={`absolute font-montserrat ${className}`}>
      {/* side image and content */}
      <div className="w-[141px] h-12 pt-1 pr-2 pl-1 pb-1 bg-white rounded flex items-center justify-between gap-2">
        <Image src={sideImg} alt="travel places" width={40} height={40} />
        <div className="flex flex-col text-blackish-green">
          <h6 className="font-bold text-[10px]">{userName}</h6>
          <p className="text-[8px]">{location}</p>
        </div>
      </div>
      {/* small circle */}
      <div className={`${circlePosition} w-[9.9px] h-[9.58px] rounded-full bg-white`} />
      {/* arrow image */}
      <Image
        src={arrowImg}
        alt="curved arrow"
        width={arrowWidth}
        height={arrowHeight}
        className={arrowPosition}
      />
    </div>
  );
};
