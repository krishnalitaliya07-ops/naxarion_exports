const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res, next) => {
  let query = Payment.find(req.queryFilter || {})
    .populate('order')
    .populate('user', 'name email');

  // If user is buyer, show only their payments
  if (req.user.role === 'buyer') {
    query = query.find({ user: req.user.id });
  }

  // Apply sorting
  if (req.sortBy) {
    query = query.sort(req.sortBy);
  }

  // Apply pagination
  query = query.skip(req.startIndex).limit(req.limit);

  const payments = await query;

  res.status(200).json({
    success: true,
    count: payments.length,
    pagination: req.pagination,
    data: payments
  });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('order')
    .populate('user', 'name email');

  if (!payment) {
    return next(new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this payment', 401));
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Verify order exists
  const order = await Order.findById(req.body.order);
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.body.order}`, 404));
  }

  // Check if user owns the order
  if (order.buyer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to make payment for this order', 401));
  }

  const payment = await Payment.create(req.body);

  // Update order payment status
  order.paymentStatus = 'paid';
  await order.save();

  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404));
  }

  payment.status = req.body.status;
  
  if (req.body.status === 'completed') {
    payment.paidAt = Date.now();
  }

  await payment.save();

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Process refund
// @route   PUT /api/payments/:id/refund
// @access  Private/Admin
exports.processRefund = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404));
  }

  if (payment.status !== 'completed') {
    return next(new ErrorResponse('Can only refund completed payments', 400));
  }

  payment.status = 'refunded';
  payment.refund = {
    amount: req.body.amount || payment.amount,
    reason: req.body.reason,
    processedAt: Date.now()
  };

  await payment.save();

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Get my payments
// @route   GET /api/payments/my/payments
// @access  Private
exports.getMyPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user.id })
    .populate('order')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private/Admin
exports.getPaymentStats = asyncHandler(async (req, res, next) => {
  const totalPayments = await Payment.countDocuments();
  const completedPayments = await Payment.countDocuments({ status: 'completed' });
  const pendingPayments = await Payment.countDocuments({ status: 'pending' });
  const failedPayments = await Payment.countDocuments({ status: 'failed' });
  const refundedPayments = await Payment.countDocuments({ status: 'refunded' });

  // Calculate total revenue
  const revenueData = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  // Get payment method breakdown
  const paymentMethods = await Payment.aggregate([
    { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: totalPayments,
      completed: completedPayments,
      pending: pendingPayments,
      failed: failedPayments,
      refunded: refundedPayments,
      totalRevenue,
      paymentMethods
    }
  });
});
