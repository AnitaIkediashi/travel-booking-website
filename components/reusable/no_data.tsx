import Image from "next/image"

type NoDataProps = {
    content: string
}

export const NoData = ({content}: NoDataProps) => {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-3">
            <Image
              src="/illustrations/no-data-illustration.svg"
              alt="no data"
              width={400}
              height={400}
              className="w-[400px] h-[400px]"
            />
            <p className="font-medium text-blackish-green">
              ${content}
            </p>
          </div>
  )
}
