const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST /api/reviews/:id/helpful
router.post('/:id/helpful', async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    review.helpfulVotes += 1;
    await review.save();

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
