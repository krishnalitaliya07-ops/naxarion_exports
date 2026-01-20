const express = require('express');
const {
  getReviews,
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  toggleHelpful,
  getMyReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const { validate, reviewValidation, validateId } = require('../middleware/validation');
const { advancedFilter, sorting, paginate } = require('../middleware/pagination');
const Review = require('../models/Review');

const router = express.Router();

// Public routes
router.get('/', advancedFilter, sorting, paginate(Review), getReviews);
router.get('/product/:productId', validateId, validate, getProductReviews);
router.get('/:id', validateId, validate, getReview);

// Protected routes
router.use(protect);

router.get('/my/reviews', getMyReviews);
router.post('/', reviewValidation, validate, createReview);
router.put('/:id', validateId, validate, updateReview);
router.delete('/:id', validateId, validate, deleteReview);
router.put('/:id/helpful', validateId, validate, toggleHelpful);

module.exports = router;
