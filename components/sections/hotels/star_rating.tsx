import { StarRateIcon } from "@/components/icons/star_rate";

type StarRatingProps = {
  rating: number;
  max?: number;
};

export const StarRating = ({ rating, max = 5 }: StarRatingProps) => {
  // 2.7 -> 3, 4.2 -> 4, clamped to 0..max
  const stars = Math.min(max, Math.max(0, Math.round(rating)));

  if (stars === 0) return null;

  return (
    <div
      className="flex items-center gap-1 text-xs"
      aria-label={`${stars} star hotel`}
    >
      <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => (
          <StarRateIcon key={i} filled={i < stars} />
        ))}
      </div>
      <span className="font-medium">{stars} Star Hotel</span>
    </div>
  );
};