type PageCountProps = {
    currentCount: number,
    totalCount: number
};

export const PageCount = ({ currentCount, totalCount }: PageCountProps) => {
  return (
    <p className="font-montserrat font-semibold text-sm">Showing {currentCount} of <span className="text-salmon-100">{totalCount} flights</span></p>
  )
}
