import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import ReviewHistogram from '../components/ReviewHistogram';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Store the refetch function from ReviewList
  const [refreshReviews, setRefreshReviews] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/products/${slug}`);
      setProduct(res.data.data);
      setError(null);
    } catch (err) {
      setError('Product not found or an error occurred.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleReviewAdded = () => {
    // Refetch product to update average rating and histogram
    fetchProduct();
    // Also tell ReviewList to refresh
    if (refreshReviews) {
      refreshReviews();
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse max-w-6xl mx-auto mt-4">
        <div className="h-8 bg-gray-200 w-32 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[4/3] bg-gray-200 rounded-2xl"></div>
          <div>
            <div className="h-10 bg-gray-200 w-3/4 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 w-1/4 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 w-full rounded mb-2"></div>
            <div className="h-4 bg-gray-200 w-full rounded mb-2"></div>
            <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product Not Found'}</h2>
        <Link to="/" className="text-indigo-600 hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        <span>Back to products</span>
      </Link>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full max-w-md h-auto object-cover rounded-xl shadow-sm mix-blend-multiply"
            />
          </div>

          {/* Product Info */}
          <div className="p-8 lg:p-12">
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
              {product.category}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <RatingStars rating={product.averageRating} count={product.reviewCount} size={20} />
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-gray-500">{product.weight}</span>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-8">
              ₹{(product.price / 100).toFixed(2)}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              Experience the finest quality with our {product.name}. Carefully sourced and crafted 
              to ensure maximum freshness and taste. Perfect for your daily needs and backed by our 
              quality guarantee.
            </p>

            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 rounded-xl transition-colors text-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="mt-16 border-t pt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Histogram & Form */}
          <div className="lg:col-span-4 space-y-8">
            <ReviewHistogram 
              averageRating={product.averageRating} 
              totalReviews={product.reviewCount} 
              ratingBreakdown={product.ratingBreakdown} 
            />
            <ReviewForm 
              productSlug={product.slug} 
              onReviewAdded={handleReviewAdded} 
            />
          </div>

          {/* Right Column: Review List */}
          <div className="lg:col-span-8">
            <ReviewList 
              productSlug={product.slug} 
              onReviewAdded={(refetchFn) => setRefreshReviews(() => refetchFn)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
