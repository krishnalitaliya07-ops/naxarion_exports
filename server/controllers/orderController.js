const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  let query = Order.find(req.queryFilter || {})
    .populate('buyer', 'name email')
    .populate('items.product', 'name images');

  // If user is buyer, show only their orders
  if (req.user.role === 'buyer') {
    query = query.find({ buyer: req.user.id });
  }

  // Apply sorting
  if (req.sortBy) {
    query = query.sort(req.sortBy);
  }

  // Apply pagination
  query = query.skip(req.startIndex).limit(req.limit);

  const orders = await query;

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: req.pagination,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email phone')
    .populate('items.product', 'name images sku')
    .populate('items.supplier', 'companyName email');

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order owner or admin
  if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this order', 401));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private/Buyer
exports.createOrder = asyncHandler(async (req, res, next) => {
  req.body.buyer = req.user.id;

  // Validate products and calculate totals
  let subtotal = 0;
  for (let item of req.body.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${item.product}`, 404));
    }
    
    // Check MOQ
    if (item.quantity < product.moq) {
      return next(new ErrorResponse(`Minimum order quantity for ${product.name} is ${product.moq}`, 400));
    }

    item.supplier = product.supplier;
    subtotal += item.price * item.quantity;
  }

  req.body.pricing = {
    subtotal,
    shipping: req.body.pricing?.shipping || 0,
    tax: req.body.pricing?.tax || 0,
    total: subtotal + (req.body.pricing?.shipping || 0) + (req.body.pricing?.tax || 0)
  };

  const order = await Order.create(req.body);

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  order.status = req.body.status;
  
  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this order', 401));
  }

  // Can only cancel if order is pending or confirmed
  if (!['pending', 'confirmed'].includes(order.status)) {
    return next(new ErrorResponse('Cannot cancel order at this stage', 400));
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get my orders
// @route   GET /api/orders/my/orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ buyer: req.user.id })
    .populate('items.product', 'name images')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
exports.getOrderStats = asyncHandler(async (req, res, next) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
  const shippedOrders = await Order.countDocuments({ status: 'shipped' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

  // Calculate total revenue
  const revenueData = await Order.aggregate([
    { $match: { status: { $in: ['delivered', 'shipped'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  res.status(200).json({
    success: true,
    data: {
      total: totalOrders,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
      totalRevenue
    }
  });
});
