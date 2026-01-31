const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  toggleCategoryActive,
  getAllCategoriesAdmin
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/stats', getCategoryStats);

// Protected routes (Admin only)
router.get('/admin/all', protect, authorize('admin'), getAllCategoriesAdmin);

// Public routes (continued) - must come AFTER /admin/all
router.get('/:id', validateId, validate, getCategory);
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), validateId, validate, updateCategory);
router.delete('/:id', protect, authorize('admin'), validateId, validate, deleteCategory);
router.patch('/:id/toggle-active', protect, authorize('admin'), toggleCategoryActive);

module.exports = router;
