import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SkeletonLoaderProps = {
  count: number;
  isCircle?: boolean
  width?: string | number
  height?: string | number
};

export const SkeletonLoader = ({count, isCircle, width, height}: SkeletonLoaderProps) => {
  return <Skeleton count={count} circle={isCircle} width={width} height={height} />
};
