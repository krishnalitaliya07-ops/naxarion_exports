const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let query = Review.find(req.queryFilter || {})
    .populate('user', 'name avatar')
    .populate('product', 'name images');

  // Apply sorting
  if (req.sortBy) {
    query = query.sort(req.sortBy);
  }

  // Apply pagination
  query = query.skip(req.startIndex).limit(req.limit);

  const reviews = await query;

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: req.pagination,
    data: reviews
  });
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  // Calculate average rating
  const stats = await Review.aggregate([
    { $match: { product: req.params.productId } },
    { $group: { 
      _id: null, 
      avgRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    stats: stats.length > 0 ? stats[0] : { avgRating: 0, totalReviews: 0 },
    data: reviews
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('product', 'name images');

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private/Buyer
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Check if product exists
  const product = await Product.findById(req.body.product);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.body.product}`, 404));
  }

  // Check if user has ordered this product
  const hasOrdered = await Order.findOne({
    buyer: req.user.id,
    'items.product': req.body.product,
    status: 'delivered'
  });

  if (!hasOrdered) {
    return next(new ErrorResponse('You can only review products you have purchased', 400));
  }

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user.id,
    product: req.body.product
  });

  if (existingReview) {
    return next(new ErrorResponse('You have already reviewed this product', 400));
  }

  const review = await Review.create(req.body);

  // Update product rating
  await updateProductRating(req.body.product);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this review', 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Update product rating
  await updateProductRating(review.product);

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 401));
  }

  const productId = review.product;
  await review.deleteOne();

  // Update product rating
  await updateProductRating(productId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// @desc    Toggle review helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
exports.toggleHelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  const userId = req.user.id;
  const index = review.helpful.indexOf(userId);

  if (index > -1) {
    // User already marked as helpful, remove
    review.helpful.splice(index, 1);
  } else {
    // Add user to helpful
    review.helpful.push(userId);
  }

  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Get my reviews
// @route   GET /api/reviews/my/reviews
// @access  Private
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate('product', 'name images')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// Helper function to update product rating
async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { 
      _id: null, 
      avgRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].totalReviews
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0
    });
  }
}
