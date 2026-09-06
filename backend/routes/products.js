const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { body, validationResult } = require('express-validator');

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Rating summary breakdown via aggregation pipeline
    const ratingSummary = await Review.aggregate([
      { $match: { productId: product._id } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Format breakdown: e.g. { "5": 10, "4": 2, ... }
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingSummary.forEach(item => {
      breakdown[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        ...product,
        ratingBreakdown: breakdown
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:slug/reviews
router.get('/:slug/reviews', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let sortObj = { createdAt: -1 }; // default newest
    if (req.query.sort === 'highest') sortObj = { rating: -1, createdAt: -1 };
    else if (req.query.sort === 'helpful') sortObj = { helpfulVotes: -1, createdAt: -1 };

    const reviews = await Review.find({ productId: product._id })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({ productId: product._id });

    res.json({
      success: true,
      data: {
        reviews,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/products/:slug/reviews
router.post('/:slug/reviews', [
  body('reviewerName').notEmpty().withMessage('Name is required'),
  body('reviewerEmail').isEmail().withMessage('Valid email is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isString(),
  body('body').optional().isString(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ success: false, error: errors.array() });
    }

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { reviewerName, reviewerEmail, rating, title, body } = req.body;

    const review = new Review({
      productId: product._id,
      reviewerName,
      reviewerEmail,
      rating,
      title,
      body,
      verifiedPurchase: false // mock value for simplicity
    });

    try {
      await review.save(); // This will trigger the post-save hook
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      if (err.code === 11000) {
        res.status(409);
        throw new Error('You have already reviewed this product.');
      }
      throw err;
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
