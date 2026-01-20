const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/stats', getCategoryStats);
router.get('/:id', validateId, validate, getCategory);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), validateId, validate, updateCategory);
router.delete('/:id', protect, authorize('admin'), validateId, validate, deleteCategory);

module.exports = router;
