const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createReview,
  getWorkerReviews,
  getMyReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Create review (protected)
router.post('/', protect, createReview);

// Get worker reviews (public)
router.get('/worker/:workerId', getWorkerReviews);

// Get my reviews
router.get('/my-reviews', protect, getMyReviews);

// Update review
router.put('/:id', protect, updateReview);

// Delete review
router.delete('/:id', protect, deleteReview);

module.exports = router;
