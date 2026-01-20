const express = require('express');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  verifySupplier,
  getVerifiedSuppliers,
  getSupplierStats
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validation');
const { advancedFilter, sorting, paginate } = require('../middleware/pagination');
const Supplier = require('../models/Supplier');

const router = express.Router();

// Public routes
router.get('/verified', getVerifiedSuppliers);

// Admin routes
router.get('/stats', protect, authorize('admin'), getSupplierStats);

router
  .route('/')
  .get(advancedFilter, sorting, paginate(Supplier), getSuppliers)
  .post(protect, createSupplier);

router
  .route('/:id')
  .get(validateId, validate, getSupplier)
  .put(protect, validateId, validate, updateSupplier)
  .delete(protect, authorize('admin'), validateId, validate, deleteSupplier);

router.put('/:id/verify', protect, authorize('admin'), validateId, validate, verifySupplier);

module.exports = router;
