export const SeatLegend = () => (
  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
    <span className="flex items-center gap-1.5">
      <span className="w-3.5 h-3.5 rounded-t bg-white border border-gray-300" />{" "}
      Available
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3.5 h-3.5 rounded-t bg-blackish-green" /> Selected
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3.5 h-3.5 rounded-t bg-gray-300" /> Occupied
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3.5 h-3.5 rounded-t bg-amber-50 border border-amber-400" />{" "}
      Extra legroom
    </span>
    <span className="flex items-center gap-1.5">$ Extra fee</span>
  </div>
);
