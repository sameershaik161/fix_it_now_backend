const Review = require('../models/Review');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');

// Create a review for a worker
exports.createReview = async (req, res) => {
  const { workerId, rating, comment, requestId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const worker = await User.findById(workerId);
  if (!worker || worker.role !== 'worker') {
    return res.status(404).json({ message: 'Worker not found' });
  }

  // Check if request exists and is completed
  if (requestId) {
    const request = await ServiceRequest.findById(requestId);
    if (!request || request.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed requests' });
    }
    if (String(request.requester) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only requester can review' });
    }
  }

  // Check if user already reviewed this worker
  const existingReview = await Review.findOne({ author: req.user._id, worker: workerId });
  if (existingReview && requestId) {
    return res.status(400).json({ message: 'You have already reviewed this worker' });
  }

  const review = await Review.create({
    author: req.user._id,
    worker: workerId,
    rating,
    comment,
  });

  // Update worker's rating
  const allReviews = await Review.find({ worker: workerId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  worker.rating = parseFloat(avgRating.toFixed(1));
  worker.ratingsCount = allReviews.length;
  await worker.save();

  await review.populate('author', 'name profileImage');
  res.status(201).json(review);
};

// Get reviews for a worker
exports.getWorkerReviews = async (req, res) => {
  const { workerId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const reviews = await Review.find({ worker: workerId })
    .populate('author', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ worker: workerId });

  res.json({ reviews, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

// Get all reviews (for a user to see their given reviews)
exports.getMyReviews = async (req, res) => {
  const reviews = await Review.find({ author: req.user._id })
    .populate('worker', 'name profileImage skills')
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// Update a review
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (String(review.author) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (rating) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();

  // Recalculate worker rating
  const allReviews = await Review.find({ worker: review.worker });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await User.findByIdAndUpdate(review.worker, {
    rating: parseFloat(avgRating.toFixed(1)),
    ratingsCount: allReviews.length
  });

  await review.populate('author', 'name profileImage');
  res.json(review);
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (String(review.author) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const workerId = review.worker;
  await review.deleteOne();

  // Recalculate worker rating
  const allReviews = await Review.find({ worker: workerId });
  if (allReviews.length > 0) {
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(workerId, {
      rating: parseFloat(avgRating.toFixed(1)),
      ratingsCount: allReviews.length
    });
  } else {
    await User.findByIdAndUpdate(workerId, { rating: 0, ratingsCount: 0 });
  }

  res.json({ message: 'Review deleted' });
};
