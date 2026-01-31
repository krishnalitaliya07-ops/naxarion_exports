const express = require('express');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePaymentStatus,
  processRefund,
  processPayout,
  getMyPayments,
  getPaymentStats,
  getCommissionBreakdown,
  getPaymentMethodsDistribution,
  exportPaymentsReport
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

// User routes
router.get('/my/payments', getMyPayments);
router.post('/', createPayment);

// Admin routes - specific routes before parameterized routes
router.get('/stats', authorize('admin'), getPaymentStats);
router.get('/commission-breakdown', authorize('admin'), getCommissionBreakdown);
router.get('/methods-distribution', authorize('admin'), getPaymentMethodsDistribution);
router.get('/export', authorize('admin'), exportPaymentsReport);

router
  .route('/')
  .get(getPayments);

router
  .route('/:id')
  .get(validateId, validate, getPayment);

router.put('/:id/status', authorize('admin'), validateId, validate, updatePaymentStatus);
router.put('/:id/refund', authorize('admin'), validateId, validate, processRefund);
router.post('/:id/payout', authorize('admin'), validateId, validate, processPayout);

module.exports = router;
