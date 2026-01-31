const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/error');

// Commission rate (15%)
const COMMISSION_RATE = 0.15;

// @desc    Get all payments with advanced filtering
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res, next) => {
  const { 
    status, 
    paymentMethod, 
    search, 
    startDate, 
    endDate,
    dateRange,
    page = 1,
    limit = 20,
    sort = '-createdAt'
  } = req.query;

  let query = {};

  // If user is buyer, show only their payments
  if (req.user.role === 'buyer') {
    query.user = req.user.id;
  }

  // Status filter
  if (status && status !== 'all') {
    query.status = status;
  }

  // Payment method filter
  if (paymentMethod && paymentMethod !== 'all') {
    query.paymentMethod = paymentMethod;
  }

  // Date range filter
  if (dateRange) {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        query.createdAt = { 
          $gte: new Date(now.setHours(0, 0, 0, 0)) 
        };
        break;
      case 'last7days':
        query.createdAt = { 
          $gte: new Date(now.setDate(now.getDate() - 7)) 
        };
        break;
      case 'last30days':
        query.createdAt = { 
          $gte: new Date(now.setDate(now.getDate() - 30)) 
        };
        break;
      case 'thisMonth':
        query.createdAt = { 
          $gte: new Date(now.getFullYear(), now.getMonth(), 1) 
        };
        break;
      case 'thisYear':
        query.createdAt = { 
          $gte: new Date(now.getFullYear(), 0, 1) 
        };
        break;
    }
  } else if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Search filter
  if (search) {
    query.$or = [
      { transactionId: { $regex: search, $options: 'i' } },
      { 'paymentDetails.cardholderName': { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Payment.countDocuments(query);
  const pages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const payments = await Payment.find(query)
    .populate('order', 'orderId orderNumber pricing')
    .populate('user', 'name email companyName')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Add commission info to each payment
  const paymentsWithCommission = payments.map(payment => {
    const paymentObj = payment.toObject();
    paymentObj.commission = payment.amount * COMMISSION_RATE;
    return paymentObj;
  });

  res.status(200).json({
    success: true,
    count: payments.length,
    total,
    pages,
    currentPage: parseInt(page),
    data: paymentsWithCommission
  });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('order')
    .populate('user', 'name email companyName phone');

  if (!payment) {
    return next(new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this payment', 401));
  }

  const paymentObj = payment.toObject();
  paymentObj.commission = payment.amount * COMMISSION_RATE;

  res.status(200).json({
    success: true,
    data: paymentObj
  });
});

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Verify order exists
  if (req.body.order) {
    const order = await Order.findById(req.body.order);
    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.body.order}`, 404));
    }

    // Check if user owns the order (unless admin)
    if (req.user.role !== 'admin' && order.buyer.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to make payment for this order', 401));
    }
  }

  // Add initial timeline entry
  req.body.timeline = [{
    status: 'Payment Initiated',
    message: 'Payment process started',
    timestamp: new Date()
  }];

  const payment = await Payment.create(req.body);

  // Update order payment status if order exists
  if (req.body.order) {
    const order = await Order.findById(req.body.order);
    if (order) {
      order.paymentStatus = 'Processing';
      await order.save();
    }
  }

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

  const oldStatus = payment.status;
  payment.status = req.body.status;
  
  // Add timeline entry
  payment.timeline.push({
    status: req.body.status,
    message: `Status changed from ${oldStatus} to ${req.body.status}`,
    timestamp: new Date()
  });

  if (req.body.status === 'Completed') {
    payment.paidAt = new Date();
    
    // Update order payment status
    if (payment.order) {
      const order = await Order.findById(payment.order);
      if (order) {
        order.paymentStatus = 'Paid';
        await order.save();
      }
    }
  }

  if (req.body.status === 'Failed' && req.body.failureReason) {
    payment.failureReason = req.body.failureReason;
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

  if (payment.status !== 'Completed') {
    return next(new ErrorResponse('Can only refund completed payments', 400));
  }

  payment.status = 'Refunded';
  payment.refundInfo = {
    amount: req.body.amount || payment.amount,
    reason: req.body.reason || 'Customer request',
    refundedAt: new Date(),
    refundTransactionId: `REF-${Date.now()}`
  };

  payment.timeline.push({
    status: 'Refunded',
    message: `Refund of $${payment.refundInfo.amount} processed. Reason: ${payment.refundInfo.reason}`,
    timestamp: new Date()
  });

  await payment.save();

  // Update order status if exists
  if (payment.order) {
    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'Refunded';
      await order.save();
    }
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Process payout to supplier
// @route   POST /api/payments/:id/payout
// @access  Private/Admin
exports.processPayout = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404));
  }

  if (payment.status !== 'Pending') {
    return next(new ErrorResponse('Can only process payouts for pending payments', 400));
  }

  payment.status = 'Completed';
  payment.paidAt = new Date();

  payment.timeline.push({
    status: 'Payout Processed',
    message: 'Payout to supplier has been processed',
    timestamp: new Date()
  });

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
    .populate('order', 'orderId orderNumber')
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
  const completedPayments = await Payment.countDocuments({ status: 'Completed' });
  const pendingPayments = await Payment.countDocuments({ status: 'Pending' });
  const processingPayments = await Payment.countDocuments({ status: 'Processing' });
  const failedPayments = await Payment.countDocuments({ status: 'Failed' });
  const refundedPayments = await Payment.countDocuments({ status: 'Refunded' });

  // Calculate total revenue
  const revenueData = await Payment.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
  const totalCommission = totalRevenue * COMMISSION_RATE;

  // Pending payouts (pending payments amount)
  const pendingPayoutsData = await Payment.aggregate([
    { $match: { status: 'Pending' } },
    { $group: { _id: null, pendingAmount: { $sum: '$amount' } } }
  ]);
  const pendingPayouts = pendingPayoutsData.length > 0 ? pendingPayoutsData[0].pendingAmount : 0;

  // Get payment method breakdown with amounts
  const paymentMethods = await Payment.aggregate([
    { $match: { status: 'Completed' } },
    { 
      $group: { 
        _id: '$paymentMethod', 
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      } 
    },
    { $sort: { totalAmount: -1 } }
  ]);

  // Calculate percentages for payment methods
  const paymentMethodsWithPercentage = paymentMethods.map(method => ({
    method: method._id,
    count: method.count,
    totalAmount: method.totalAmount,
    percentage: totalRevenue > 0 
      ? Math.round((method.totalAmount / totalRevenue) * 100) 
      : 0
  }));

  // Get this month's stats
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const thisMonthData = await Payment.aggregate([
    { $match: { status: 'Completed', createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, revenue: { $sum: '$amount' } } }
  ]);
  const thisMonthRevenue = thisMonthData.length > 0 ? thisMonthData[0].revenue : 0;
  const thisMonthCommission = thisMonthRevenue * COMMISSION_RATE;

  // Get last month's stats for comparison
  const startOfLastMonth = new Date(startOfMonth);
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

  const lastMonthData = await Payment.aggregate([
    { $match: { status: 'Completed', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } },
    { $group: { _id: null, revenue: { $sum: '$amount' } } }
  ]);
  const lastMonthRevenue = lastMonthData.length > 0 ? lastMonthData[0].revenue : 0;

  const revenueGrowth = lastMonthRevenue > 0
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : 0;

  // Calculate completion rate
  const completionRate = totalPayments > 0
    ? Math.round((completedPayments / totalPayments) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      total: totalPayments,
      completed: completedPayments,
      pending: pendingPayments,
      processing: processingPayments,
      failed: failedPayments,
      refunded: refundedPayments,
      totalRevenue,
      totalCommission,
      pendingPayouts,
      pendingCommission: pendingPayouts * COMMISSION_RATE,
      thisMonthRevenue,
      thisMonthCommission,
      revenueGrowth,
      completionRate,
      paymentMethods: paymentMethodsWithPercentage
    }
  });
});

// @desc    Get commission breakdown
// @route   GET /api/payments/commission-breakdown
// @access  Private/Admin
exports.getCommissionBreakdown = asyncHandler(async (req, res, next) => {
  // Total commission earned (from completed payments)
  const completedData = await Payment.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalCommissionEarned = (completedData.length > 0 ? completedData[0].total : 0) * COMMISSION_RATE;

  // Pending commission (from pending/processing payments)
  const pendingData = await Payment.aggregate([
    { $match: { status: { $in: ['Pending', 'Processing'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const pendingCommission = (pendingData.length > 0 ? pendingData[0].total : 0) * COMMISSION_RATE;

  // Paid out this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const paidOutData = await Payment.aggregate([
    { $match: { status: 'Completed', paidAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const paidOutThisMonth = (paidOutData.length > 0 ? paidOutData[0].total : 0) * (1 - COMMISSION_RATE);

  // Get last month's commission for comparison
  const startOfLastMonth = new Date(startOfMonth);
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

  const lastMonthData = await Payment.aggregate([
    { $match: { status: 'Completed', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const lastMonthCommission = (lastMonthData.length > 0 ? lastMonthData[0].total : 0) * COMMISSION_RATE;

  const thisMonthData = await Payment.aggregate([
    { $match: { status: 'Completed', createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const thisMonthCommission = (thisMonthData.length > 0 ? thisMonthData[0].total : 0) * COMMISSION_RATE;

  const commissionGrowth = lastMonthCommission > 0
    ? Math.round(((thisMonthCommission - lastMonthCommission) / lastMonthCommission) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalCommissionEarned,
      pendingCommission,
      paidOutThisMonth,
      averageCommissionRate: COMMISSION_RATE * 100,
      commissionGrowth,
      thisMonthCommission,
      lastMonthCommission
    }
  });
});

// @desc    Get payment methods distribution
// @route   GET /api/payments/methods-distribution
// @access  Private/Admin
exports.getPaymentMethodsDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Payment.aggregate([
    { $match: { status: 'Completed' } },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);

  // Calculate total for percentages
  const totalAmount = distribution.reduce((sum, item) => sum + item.totalAmount, 0);

  const formattedDistribution = distribution.map(item => ({
    method: item._id,
    count: item.count,
    totalAmount: item.totalAmount,
    percentage: totalAmount > 0 
      ? Math.round((item.totalAmount / totalAmount) * 100) 
      : 0
  }));

  res.status(200).json({
    success: true,
    data: formattedDistribution
  });
});

// @desc    Export payments report
// @route   GET /api/payments/export
// @access  Private/Admin
exports.exportPaymentsReport = asyncHandler(async (req, res, next) => {
  const { status, paymentMethod, startDate, endDate } = req.query;

  let query = {};
  if (status && status !== 'all') query.status = status;
  if (paymentMethod && paymentMethod !== 'all') query.paymentMethod = paymentMethod;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const payments = await Payment.find(query)
    .populate('order', 'orderId')
    .populate('user', 'name')
    .sort('-createdAt')
    .lean();

  // Generate CSV content
  const headers = 'Transaction ID,Date,User,Order ID,Amount,Commission,Payment Method,Status\n';
  const rows = payments.map(p => 
    `"${p.transactionId}","${new Date(p.createdAt).toLocaleDateString()}","${p.user?.name || 'N/A'}","${p.order?.orderId || 'N/A'}","$${p.amount?.toFixed(2) || '0.00'}","$${(p.amount * COMMISSION_RATE).toFixed(2)}","${p.paymentMethod}","${p.status}"`
  ).join('\n');

  const csvContent = headers + rows;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=payments-report-${new Date().toISOString().split('T')[0]}.csv`);
  res.status(200).send(csvContent);
});
