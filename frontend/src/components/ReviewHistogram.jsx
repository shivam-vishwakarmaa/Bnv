import { Star } from 'lucide-react';

const ReviewHistogram = ({ ratingBreakdown, totalReviews, averageRating }) => {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
        <div>
          <div className="flex text-yellow-400 mb-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} size={20} fill={star <= Math.round(averageRating) ? "currentColor" : "none"} />
            ))}
          </div>
          <div className="text-sm text-gray-500">Based on {totalReviews} reviews</div>
        </div>
      </div>

      <div className="space-y-3">
        {stars.map(star => {
          const count = ratingBreakdown?.[star] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 w-12 text-gray-600">
                <span>{star}</span>
                <Star size={14} className="text-yellow-400" fill="currentColor" />
              </div>
              <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-8 text-right text-gray-500">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewHistogram;
