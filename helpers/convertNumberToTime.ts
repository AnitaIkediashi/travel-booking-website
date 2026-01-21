export const convertMinutesToTime = (totalMinutes: number): string => {
  // 1. Calculate hours and minutes
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;

  // 2. Determine AM or PM
  const period = hours24 >= 12 ? "PM" : "AM";

  // 3. Convert to 12-hour format
  // (0 becomes 12, 13 becomes 1, etc.)
  const hours12 = hours24 % 12 || 12;

  // 4. Format minutes to always have two digits (e.g., :05 instead of :5)
  const paddedMins = mins.toString().padStart(2, "0");

  return `${hours12}:${paddedMins} ${period}`;
};
