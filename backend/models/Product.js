const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true }, // integer paise
  weight: { type: String }, // weight/variant label
  imageUrl: { type: String },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
