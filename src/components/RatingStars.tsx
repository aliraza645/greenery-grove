import { Star } from "lucide-react";

export function RatingStars({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={`size-4 ${i < Math.round(value) ? "fill-clay text-clay" : "text-ink/20"}`}
          />
        ))}
      </div>
      <span className="text-ink/60">{value.toFixed(1)}{reviews != null && ` · ${reviews} reviews`}</span>
    </div>
  );
}
