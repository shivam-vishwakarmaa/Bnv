const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  body: { type: String },
  verifiedPurchase: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 }
}, { timestamps: true });

// Enforce one review per (productId, reviewerEmail) pair
reviewSchema.index({ productId: 1, reviewerEmail: 1 }, { unique: true });

// Post-save hook to recalculate product's average rating and review count
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  
  const stats = await this.constructor.aggregate([
    { $match: { productId: this.productId } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
      reviewCount: stats[0].numReviews
    });
  } else {
    await Product.findByIdAndUpdate(this.productId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
});

// Also trigger on remove (if reviews are ever deleted)
reviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  
  const stats = await this.constructor.aggregate([
    { $match: { productId: this.productId } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].numReviews
    });
  } else {
    await Product.findByIdAndUpdate(this.productId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
