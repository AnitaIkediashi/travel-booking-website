
type FlightDataProps = {
  isPending: boolean;
};

export const FlightDataFilters = ({isPending}: FlightDataProps) => {
  return (
    <>
      {
        isPending ? 'loading...' : <section>hello world</section>
      }
    </>
  )
}
