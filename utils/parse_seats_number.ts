export type ParsedSeat = { row: number; column: string };

export const parseSeatNumber = (seatNumber: string): ParsedSeat | null => {
  const match = seatNumber.match(/^(\d+)([A-Z])$/);
  if (!match) return null;
  return { row: parseInt(match[1], 10), column: match[2] };
};

// standard single-aisle 3-3 layout; adjust if your seat data uses a different config
export const COLUMN_LAYOUT: (string | null)[] = [
  "A",
  "B",
  "C",
  null,
  "D",
  "E",
  "F",
];
