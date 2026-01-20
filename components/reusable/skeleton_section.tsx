import { SkeletonLoader } from "./skeleton_loader";

export const SkeletonSection = () => {
  return (
    <section className="w-full grid lg:grid-cols-[343px_1fr] grid-cols-1 lg:gap-10">
      <div className="w-full hidden lg:block">
        <div className="pb-8 border-b border-b-blackish-green">
          <p className="mb-8">
            <SkeletonLoader count={1} width={60} height={30} />
          </p>
          <SkeletonLoader count={2} height={30} />
        </div>
        <div className="pb-8 border-b border-b-blackish-green">
          <p className="mb-8">
            <SkeletonLoader count={1} width={60} height={30} />
          </p>
          <SkeletonLoader count={2} height={30} />
        </div>
        <div className="pb-8 border-b border-b-blackish-green">
          <p className="mb-8">
            <SkeletonLoader count={1} width={60} height={30} />
          </p>
          <SkeletonLoader count={2} height={30} />
        </div>
        <div className="pb-8">
          <p className="mb-8">
            <SkeletonLoader count={1} width={60} height={30} />
          </p>
          <SkeletonLoader count={4} width={60} height={30} />
        </div>
      </div>
      <div className="w-full">
        <div className="mb-8 flex w-full bg-white shadow-light h-20 items-center justify-center">
          <div className="h-[45px] w-full flex gap-5">
            <div className="flex flex-col flex-1 min-w-20">
              <p>
                <SkeletonLoader count={1} width={60} height={30} />
              </p>
              <SkeletonLoader count={1} height={30} />
            </div>
            <div className="flex flex-col flex-1 min-w-20">
              <p>
                <SkeletonLoader count={1} width={60} height={30} />
              </p>
              <SkeletonLoader count={1} height={30} />
            </div>
            <div className="flex flex-col flex-1 min-w-20">
              <p>
                <SkeletonLoader count={1} width={60} height={30} />
              </p>
              <SkeletonLoader count={1} height={30} />
            </div>
            <div className="flex flex-col flex-1 min-w-20">
              <p>
                <SkeletonLoader count={1} width={60} height={30} />
              </p>
              <SkeletonLoader count={1} height={30} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 w-full">
          <div className="bg-white shadow-light rounded-xl px-4 py-6 flex flex-col gap-2">
            <SkeletonLoader count={4} height={30} />
          </div>
          <div className="bg-white shadow-light rounded-xl px-4 py-6 flex flex-col gap-2">
            <SkeletonLoader count={4} height={30} />
          </div>
          <div className="bg-white shadow-light rounded-xl px-4 py-6 flex flex-col gap-2">
            <SkeletonLoader count={4} height={30} />
          </div>
        </div>
      </div>
    </section>
  )
}
