export const convertMinutesToTime = (totalMinutes: number): string => {
  // 1. Calculate hours and minutes
  const hours24 = Math.floor(totalMinutes / 60) % 24;

  const mins = totalMinutes % 60;

  // 2. Determine AM or PM
  const period = hours24 >= 12 ? "PM" : "AM";

  // 3. Convert to 12-hour format
  // (0 becomes 12, 13 becomes 1, etc.)
  const hours12 = hours24 % 12 || 12;

  const paddedHours =
    hours12 < 10 ? hours12.toString().padStart(2, "0") : hours12;

  // 4. Format minutes to always have two digits (e.g., :05 instead of :5)
  const paddedMins = mins.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMins} ${period}`;
};

export const formatDuration = (min: number) => {
  if (!min || min === Infinity) return "N/A";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${m}m`;
};
