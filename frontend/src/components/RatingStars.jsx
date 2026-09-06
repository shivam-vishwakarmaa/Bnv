import { Star } from 'lucide-react';

const RatingStars = ({ rating, count, size = 16, interactive = false, onRate = () => {} }) => {
  const roundedRating = Math.round(rating * 2) / 2; // nearest 0.5
  
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          fill={star <= roundedRating ? "currentColor" : "none"}
          strokeWidth={2}
          onClick={() => interactive && onRate(star)}
        />
      ))}
      {count !== undefined && (
        <span className="text-gray-500 text-sm ml-1">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
