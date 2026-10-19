type PageCountProps = {
  currentCount: number;
  totalCount: number;
  type: string
};

export const PageCount = ({ currentCount, totalCount, type }: PageCountProps) => {
  return (
    <p className="font-montserrat font-semibold text-sm">
      Showing {currentCount} of{" "}
      <span className="text-salmon-100">{totalCount} {type}</span>
    </p>
  );
};
