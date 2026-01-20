const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query = Product.find(req.queryFilter || {})
    .populate('category', 'name')
    .populate('supplier', 'companyName country');

  // Apply search
  if (req.searchQuery) {
    query = query.find({
      $or: [
        { name: { $regex: req.searchQuery, $options: 'i' } },
        { description: { $regex: req.searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(req.searchQuery, 'i')] } }
      ]
    });
  }

  // Apply sorting
  if (req.sortBy) {
    query = query.sort(req.sortBy);
  }

  // Apply field selection
  if (req.selectFields) {
    query = query.select(req.selectFields);
  }

  // Apply pagination
  query = query.skip(req.startIndex).limit(req.limit);

  const products = await query;

  res.status(200).json({
    success: true,
    count: products.length,
    pagination: req.pagination,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name icon')
    .populate('supplier', 'companyName country rating email phone')
    .populate({
      path: 'reviews',
      select: 'rating comment user createdAt',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Increment views
  product.views = (product.views || 0) + 1;
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Supplier
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add supplier to req.body
  if (req.user.role === 'supplier') {
    req.body.supplier = req.user.id;
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Supplier/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is product owner or admin
  if (product.supplier.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this product', 401));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Supplier/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is product owner or admin
  if (product.supplier.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this product', 401));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ category: req.params.categoryId })
    .populate('supplier', 'companyName country rating');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by supplier
// @route   GET /api/products/supplier/:supplierId
// @access  Public
exports.getProductsBySupplier = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ supplier: req.params.supplierId })
    .populate('category', 'name');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true })
    .limit(10)
    .populate('category', 'name')
    .populate('supplier', 'companyName country');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Toggle product featured status
// @route   PUT /api/products/:id/toggle-featured
// @access  Private/Admin
exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Supplier/Admin
exports.updateStock = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product.stock = req.body.stock;
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});
