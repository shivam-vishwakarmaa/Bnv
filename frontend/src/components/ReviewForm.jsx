import { useState } from 'react';
import axios from 'axios';
import RatingStars from './RatingStars';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ReviewForm = ({ productSlug, onReviewAdded }) => {
  const [formData, setFormData] = useState({
    reviewerName: '',
    reviewerEmail: '',
    rating: 0,
    title: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`${API_URL}/products/${productSlug}/reviews`, formData);
      setSuccess(true);
      setFormData({ reviewerName: '', reviewerEmail: '', rating: 0, title: '', body: '' });
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      if (err.response?.status === 409) {
        setError('You have already reviewed this product using this email address.');
      } else if (err.response?.data?.error) {
        // Handle express-validator errors array
        const errors = err.response.data.error;
        if (Array.isArray(errors)) {
          setError(errors[0].msg);
        } else {
          setError(errors);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-4">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">Your review has been submitted successfully.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-indigo-600 font-medium hover:underline"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating <span className="text-red-500">*</span></label>
          <RatingStars 
            rating={formData.rating} 
            size={28} 
            interactive={true} 
            onRate={(r) => setFormData({...formData, rating: r})} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
              value={formData.reviewerName}
              onChange={(e) => setFormData({...formData, reviewerName: e.target.value})}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
            <input 
              required
              type="email" 
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
              value={formData.reviewerEmail}
              onChange={(e) => setFormData({...formData, reviewerEmail: e.target.value})}
              placeholder="john@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">We will only use this to verify your review.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
          <input 
            type="text" 
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Summarize your experience"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Details</label>
          <textarea 
            rows={4}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 resize-y"
            value={formData.body}
            onChange={(e) => setFormData({...formData, body: e.target.value})}
            placeholder="What did you like or dislike? What should others know?"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
