import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.slug}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
        <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
        <div className="text-sm text-gray-500 mb-2">{product.weight}</div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="font-bold text-lg text-gray-900">₹{(product.price / 100).toFixed(2)}</div>
          <RatingStars rating={product.averageRating} count={product.reviewCount} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
