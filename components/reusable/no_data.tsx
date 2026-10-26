import Image from "next/image"
import { GoBackBtn } from "./go_back_btn";

type NoDataProps = {
    content: string;
    goBack?: boolean
}

export const NoData = ({content, goBack}: NoDataProps) => {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-3">
      <Image
        src="/illustrations/no-data-illustration.svg"
        alt=""
        width={400}
        height={400}
        className="w-full max-w-[400px] h-auto"
      />
      <p className="font-medium text-blackish-green">{content}</p>
      {goBack && <GoBackBtn />}
    </div>
  );
}
