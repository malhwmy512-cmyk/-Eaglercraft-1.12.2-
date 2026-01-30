import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({ 
  rating, 
  max = 5, 
  onRate, 
  readonly = false,
  size = "md" 
}: RatingStarsProps) {
  const starSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => onRate?.(starValue)}
            className={`
              ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}
              focus:outline-none
            `}
          >
            <Star 
              className={`
                ${starSizes[size]} 
                ${isFilled ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(255,95,31,0.5)]" : "text-muted-foreground/30"}
                transition-colors duration-200
              `} 
            />
          </button>
        );
      })}
    </div>
  );
}
