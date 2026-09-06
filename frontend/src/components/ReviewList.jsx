import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, CheckCircle2 } from 'lucide-react';
import RatingStars from './RatingStars';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ReviewList = forwardRef(({ productSlug }, ref) => {
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products/${productSlug}/reviews?sort=${sort}&page=${page}&limit=5`);
      setReviews(res.data.data.reviews);
      setTotalPages(res.data.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productSlug, sort, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useImperativeHandle(ref, () => ({
    fetchReviews
  }));

  const handleHelpful = async (id) => {
    try {
      await axios.post(`${API_URL}/reviews/${id}/helpful`);
      // Optimistic update
      setReviews(reviews.map(r => r._id === id ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r));
    } catch (err) {
      console.error("Could not record vote", err);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
        <select 
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 w-1/4 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 w-1/5 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 w-full rounded mb-2"></div>
                <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-gray-500 mb-2">No reviews yet.</p>
          <p className="text-sm font-medium text-gray-900">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map(review => (
            <div key={review._id} className="border-b pb-8 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{review.reviewerName}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                {review.verifiedPurchase && (
                  <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} />
                    Verified Purchase
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <RatingStars rating={review.rating} />
                  <span className="font-bold text-gray-900">{review.title}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{review.body}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span>Was this helpful?</span>
                <button 
                  onClick={() => handleHelpful(review._id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
                >
                  <ThumbsUp size={14} />
                  <span>Yes ({review.helpfulVotes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

export default ReviewList;
