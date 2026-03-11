import { AddCard } from "./add_card"


export const CardDetails = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full h-20 flex items-center justify-between">
        {/* card info */}
        <div className="flex items-center gap-8">
          {/* card type, last 4 digits, expiry date */}
        </div>
        {/* radio button */}
      </div>
      <AddCard />
    </div>
  );
}
