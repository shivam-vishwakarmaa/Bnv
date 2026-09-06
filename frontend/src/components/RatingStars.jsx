import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 0, count, size = 16, interactive = false, onRate = () => {} }) => {
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => {
        const isInteractiveClass = interactive ? 'cursor-pointer hover:scale-110 transition-transform' : '';
        const onClick = () => interactive && onRate(star);
        
        if (star <= roundedRating) {
          return <Star key={star} size={size} className={isInteractiveClass} fill="currentColor" strokeWidth={2} onClick={onClick} />;
        } else if (star - 0.5 === roundedRating) {
          return <StarHalf key={star} size={size} className={isInteractiveClass} fill="currentColor" strokeWidth={2} onClick={onClick} />;
        } else {
          return <Star key={star} size={size} className={`${isInteractiveClass} text-gray-300`} fill="none" strokeWidth={2} onClick={onClick} />;
        }
      })}
      {count !== undefined && (
        <span className="text-gray-500 text-sm ml-1">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
