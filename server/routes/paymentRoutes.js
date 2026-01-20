const express = require('express');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePaymentStatus,
  processRefund,
  getMyPayments,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validation');
const { advancedFilter, sorting, paginate } = require('../middleware/pagination');
const Payment = require('../models/Payment');

const router = express.Router();

router.use(protect);

// User routes
router.get('/my/payments', getMyPayments);
router.post('/', createPayment);

// Admin routes
router.get('/stats', authorize('admin'), getPaymentStats);

router
  .route('/')
  .get(advancedFilter, sorting, paginate(Payment), getPayments);

router
  .route('/:id')
  .get(validateId, validate, getPayment);

router.put('/:id/status', authorize('admin'), validateId, validate, updatePaymentStatus);
router.put('/:id/refund', authorize('admin'), validateId, validate, processRefund);

module.exports = router;
