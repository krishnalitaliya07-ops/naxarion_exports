const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  // Get products count in this category
  const productsCount = await Product.countDocuments({ category: req.params.id });

  res.status(200).json({
    success: true,
    data: {
      ...category.toObject(),
      productsCount
    }
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  // Check if category has products
  const productsCount = await Product.countDocuments({ category: req.params.id });
  if (productsCount > 0) {
    return next(new ErrorResponse(`Cannot delete category with ${productsCount} products`, 400));
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Private/Admin
exports.getCategoryStats = asyncHandler(async (req, res, next) => {
  const stats = await Category.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products'
      }
    },
    {
      $project: {
        name: 1,
        productsCount: { $size: '$products' },
        icon: 1,
        color: 1
      }
    },
    {
      $sort: { productsCount: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats
  });
});

// @desc    Toggle category active status
// @route   PATCH /api/categories/:id/toggle-active
// @access  Private/Admin
exports.toggleCategoryActive = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
    data: category
  });
});

// @desc    Get all categories with pagination (Admin)
// @route   GET /api/admin/categories/all
// @access  Private/Admin
exports.getAllCategoriesAdmin = asyncHandler(async (req, res, next) => {
  const { search, isActive, page = 1, limit = 20 } = req.query;
  
  const filters = {};
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (isActive !== undefined && isActive !== '') {
    filters.isActive = isActive === 'true';
  }

  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Category.countDocuments(filters)
  ]);

  res.status(200).json({
    success: true,
    data: categories,
    count: categories.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  });
});
