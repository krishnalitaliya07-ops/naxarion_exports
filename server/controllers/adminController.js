const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const Shipment = require('../models/Shipment');
const Contact = require('../models/Contact');
const Supplier = require('../models/Supplier');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get admin dashboard overview stats
// @route   GET /api/admin/dashboard/overview
// @access  Private/Admin
exports.getAdminDashboardOverview = asyncHandler(async (req, res, next) => {
  console.log('\n📊 ===== ADMIN DASHBOARD OVERVIEW =====');

  // Get counts
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalQuotes,
    totalShipments,
    totalContacts,
    activeUsers,
    pendingOrders,
    completedOrders
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Quote.countDocuments(),
    Shipment.countDocuments(),
    Contact.countDocuments(),
    User.countDocuments({ isActive: true }),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'delivered' })
  ]);

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const [
    newUsers,
    newOrders,
    newQuotes,
    newProducts
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Quote.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Product.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
  ]);

  // Calculate revenue (sum of all delivered orders)
  const revenueData = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

  console.log('✅ Dashboard overview compiled');
  console.log('===== OVERVIEW COMPLETED =====\n');

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalQuotes,
        totalShipments,
        totalContacts,
        activeUsers,
        totalRevenue
      },
      orderStats: {
        pending: pendingOrders,
        completed: completedOrders,
        total: totalOrders
      },
      recentActivity: {
        newUsers,
        newOrders,
        newQuotes,
        newProducts
      }
    }
  });
});

// @desc    Get all users (with pagination)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  console.log('\n👥 ===== GET ALL USERS =====');
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {};
  if (req.query.role) filters.role = req.query.role;
  if (req.query.status) {
    if (req.query.status === 'verified') {
      filters.isActive = true;
    } else if (req.query.status === 'pending') {
      filters.status = 'pending';
    } else if (req.query.status === 'suspended') {
      filters.isActive = false;
    }
  }
  if (req.query.country) filters.country = req.query.country;
  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { company: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Get stats
  const [totalUsers, importers, exporters, pending] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'importer' }),
    User.countDocuments({ role: 'exporter' }),
    User.countDocuments({ $or: [{ status: 'pending' }, { isActive: false }] })
  ]);

  const [users, total] = await Promise.all([
    User.find(filters)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filters)
  ]);

  console.log(`✅ Found ${total} users (page ${page})`);
  console.log('===== GET USERS COMPLETED =====\n');

  res.status(200).json({
    success: true,
    data: {
      users,
      stats: {
        totalUsers,
        importers,
        exporters,
        pending
      },
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('favorites')
    .populate('recentlyViewed.product');

  if (!user) {
    return next(new ErrorResponse(`User not found with id: ${req.params.id}`, 404));
  }

  // Get user's orders, quotes, and shipments
  const [orders, quotes, shipments] = await Promise.all([
    Order.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(10),
    Quote.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(10),
    Shipment.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(10)
  ]);

  res.status(200).json({
    success: true,
    data: {
      user,
      orders,
      quotes,
      shipments
    }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  console.log('\n✏️  ===== ADMIN UPDATE USER =====');
  console.log('User ID:', req.params.id);
  console.log('Update data:', req.body);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id: ${req.params.id}`, 404));
  }

  console.log('✅ User updated successfully');
  console.log('===== UPDATE COMPLETED =====\n');

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// @desc    Create admin user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createAdminUser = asyncHandler(async (req, res, next) => {
  console.log('\n➕ ===== CREATE ADMIN USER =====');
  console.log('Data:', req.body);

  const { name, email, password, phone, company, country, role, adminRole } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email, and password', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User with this email already exists', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    company,
    country,
    role: role || 'admin',
    adminRole: adminRole || null,
    isActive: true,
    isVerified: true,
    isEmailVerified: true
  });

  console.log('✅ Admin user created:', user.email);
  console.log('👤 Role:', user.role);
  console.log('🔑 Admin Role:', user.adminRole);
  console.log('===== CREATE COMPLETED =====\n');

  res.status(201).json({
    success: true,
    message: 'Admin user created successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminRole: user.adminRole,
      isActive: user.isActive
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  console.log('\n🗑️  ===== ADMIN DELETE USER =====');
  console.log('User ID:', req.params.id);

  // Prevent admin from deleting themselves
  if (req.user._id.toString() === req.params.id) {
    return next(new ErrorResponse('You cannot delete your own account', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id: ${req.params.id}`, 404));
  }

  // Delete user
  await User.findByIdAndDelete(req.params.id);

  console.log('✅ User deleted successfully:', user.email);
  console.log('📧 User email:', user.email);
  console.log('🔒 All sessions for this user are now invalid');
  console.log('===== DELETE COMPLETED =====\n');

  res.status(200).json({
    success: true,
    message: `User ${user.email} has been permanently deleted and logged out from all sessions`,
    data: {}
  });
});

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Private/Admin
exports.toggleUserActive = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id: ${req.params.id}`, 404));
  }

  user.isActive = !user.isActive;
  await user.save();

  console.log(`✅ User ${user.email} active status: ${user.isActive}`);

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: user
  });
});

// @desc    Get all orders (with pagination, filtering, search)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  // Build filters
  const filters = {};
  
  // Status filter
  if (req.query.status && req.query.status !== 'all') {
    filters.orderStatus = req.query.status.charAt(0).toUpperCase() + req.query.status.slice(1);
  }
  
  // Payment status filter
  if (req.query.paymentStatus) {
    filters.paymentStatus = req.query.paymentStatus;
  }
  
  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filters.createdAt = {};
    if (req.query.startDate) filters.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filters.createdAt.$lte = new Date(req.query.endDate);
  }
  
  // Search by order ID, customer name, or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filters.$or = [
      { orderId: searchRegex },
      { 'shippingAddress.fullName': searchRegex },
      { 'shippingAddress.email': searchRegex }
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filters)
      .populate('buyer', 'firstName lastName email role')
      .populate('supplier', 'companyName email')
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filters)
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: orders
  });
});

// @desc    Get order statistics
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
exports.getOrderStats = asyncHandler(async (req, res, next) => {
  // Get current month start and end
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  // Get all order counts by status
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    completedOrders,
    cancelledOrders,
    monthlyOrders
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'Pending' }),
    Order.countDocuments({ orderStatus: 'Processing' }),
    Order.countDocuments({ orderStatus: 'Shipped' }),
    Order.countDocuments({ orderStatus: { $in: ['Delivered'] } }),
    Order.countDocuments({ orderStatus: 'Cancelled' }),
    Order.find({ createdAt: { $gte: monthStart, $lte: monthEnd }, orderStatus: { $ne: 'Cancelled' } })
  ]);
  
  // Calculate monthly revenue
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.pricing?.totalPrice || 0), 0);
  
  // Calculate average order value
  const avgOrderValue = totalOrders > 0 
    ? await Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, avgPrice: { $avg: '$pricing.totalPrice' } } }
      ]).then(result => result[0]?.avgPrice || 0)
    : 0;
  
  // Get returns count (assuming cancelled after delivery or refunded status)
  const returns = await Order.countDocuments({ 
    orderStatus: { $in: ['Refunded'] }
  });
  
  // Calculate growth percentage for total orders (compare with last month)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const lastMonthCount = await Order.countDocuments({
    createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
  });
  
  const growthPercentage = lastMonthCount > 0 
    ? ((monthlyOrders.length - lastMonthCount) / lastMonthCount * 100).toFixed(1)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      returns,
      monthlyRevenue,
      avgOrderValue,
      growthPercentage
    }
  });
});

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'firstName lastName email phone role')
    .populate('supplier', 'companyName email phone')
    .populate('orderItems.product', 'name images price sku')
    .populate('paymentInfo')
    .populate('shipmentInfo');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  const validStatuses = ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
  
  if (!status || !validStatuses.includes(status)) {
    return next(new ErrorResponse('Please provide a valid status', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Update order status
  order.orderStatus = status;
  
  // Add timeline entry
  order.timeline.push({
    status,
    description: `Order status updated to ${status} by admin`,
    timestamp: new Date()
  });
  
  // Update delivery status if delivered
  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  
  // Update cancelled status
  if (status === 'Cancelled' && !order.cancelledAt) {
    order.cancelledAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order
  });
});

// @desc    Create new order (admin)
// @route   POST /api/admin/orders
// @access  Private/Admin
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    buyer,
    supplier,
    orderItems,
    shippingAddress,
    billingAddress,
    pricing,
    paymentStatus,
    orderNotes
  } = req.body;

  // Validate required fields (buyer can be null for admin-created orders)
  if (!shippingAddress || !pricing) {
    return next(new ErrorResponse('Please provide shipping address and pricing details', 400));
  }

  // Create order with default empty orderItems if not provided
  const order = await Order.create({
    buyer: buyer || req.user._id, // Use admin as buyer if not specified
    supplier,
    orderItems: orderItems || [],
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    pricing,
    paymentStatus: paymentStatus || 'Pending',
    orderStatus: 'Pending',
    orderNotes,
    timeline: [{
      status: 'Pending',
      description: 'Order created by admin',
      timestamp: new Date()
    }]
  });

  const populatedOrder = await Order.findById(order._id)
    .populate('buyer', 'firstName lastName email')
    .populate('supplier', 'companyName')
    .populate('orderItems.product', 'name images');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: populatedOrder
  });
});

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
    data: {}
  });
});

// @desc    Get all products (with pagination)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  
  const filters = {};
  
  // Category filter
  if (req.query.category) filters.category = req.query.category;
  
  // Supplier filter
  if (req.query.supplier) filters.supplier = req.query.supplier;
  
  // Status filter (isApproved)
  if (req.query.isApproved) {
    filters.isApproved = req.query.isApproved;
  }
  
  // Featured filter
  if (req.query.isFeatured !== undefined) {
    filters.isFeatured = req.query.isFeatured === 'true';
  }
  
  // Active/Inactive filter
  if (req.query.isActive !== undefined) {
    filters.isActive = req.query.isActive === 'true';
  }
  
  // Search filter
  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { sku: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Build sort object
  let sortOption = { createdAt: -1 }; // Default: Latest
  if (req.query.sort) {
    const sortField = req.query.sort;
    if (sortField.startsWith('-')) {
      sortOption = { [sortField.substring(1)]: -1 };
    } else {
      sortOption = { [sortField]: 1 };
    }
  }

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate('category', 'name')
      .populate('supplier', 'companyName email country')
      .populate('brand', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filters)
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Get quote statistics
// @route   GET /api/admin/quotes/stats
// @access  Private/Admin
exports.getQuoteStats = asyncHandler(async (req, res, next) => {
  const now = new Date();
  
  const [
    totalQuotes,
    pendingQuotes,
    inReviewQuotes,
    quotedQuotes,
    acceptedQuotes,
    rejectedQuotes,
    expiredQuotes,
    highPriorityQuotes
  ] = await Promise.all([
    Quote.countDocuments(),
    Quote.countDocuments({ status: 'pending' }),
    Quote.countDocuments({ status: 'in-review' }),
    Quote.countDocuments({ status: 'quoted' }),
    Quote.countDocuments({ status: 'accepted' }),
    Quote.countDocuments({ status: 'rejected' }),
    Quote.countDocuments({ status: 'expired' }),
    Quote.countDocuments({ priority: 'high', status: { $in: ['pending', 'in-review'] } })
  ]);
  
  // Calculate percentages
  const quotedPercentage = totalQuotes > 0 ? Math.round((quotedQuotes / totalQuotes) * 100) : 0;
  const expiredPercentage = totalQuotes > 0 ? Math.round((expiredQuotes / totalQuotes) * 100) : 0;
  
  res.status(200).json({
    success: true,
    data: {
      total: totalQuotes,
      pending: pendingQuotes,
      inReview: inReviewQuotes,
      quoted: quotedQuotes,
      accepted: acceptedQuotes,
      rejected: rejectedQuotes,
      expired: expiredQuotes,
      highPriority: highPriorityQuotes,
      quotedPercentage,
      expiredPercentage
    }
  });
});

// @desc    Get all quotes (with pagination)
// @route   GET /api/admin/quotes
// @access  Private/Admin
exports.getAllQuotes = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {};
  
  // Status filter
  if (req.query.status && req.query.status !== '') {
    filters.status = req.query.status;
  }
  
  // Priority filter
  if (req.query.priority && req.query.priority !== '') {
    filters.priority = req.query.priority;
  }
  
  // Category filter
  if (req.query.category && req.query.category !== '') {
    filters.category = { $regex: req.query.category, $options: 'i' };
  }
  
  // Search filter
  if (req.query.search && req.query.search !== '') {
    filters.$or = [
      { quoteId: { $regex: req.query.search, $options: 'i' } },
      { productName: { $regex: req.query.search, $options: 'i' } },
      { 'customerInfo.name': { $regex: req.query.search, $options: 'i' } },
      { 'customerInfo.company': { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Date filter
  if (req.query.dateRange) {
    const now = new Date();
    let dateFilter;
    
    switch (req.query.dateRange) {
      case 'today':
        dateFilter = new Date(now.setHours(0, 0, 0, 0));
        break;
      case '7days':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30days':
        dateFilter = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90days':
        dateFilter = new Date(now.setDate(now.getDate() - 90));
        break;
    }
    
    if (dateFilter) {
      filters.createdAt = { $gte: dateFilter };
    }
  }

  const [quotes, total] = await Promise.all([
    Quote.find(filters)
      .populate('customer', 'name email company phone')
      .populate('supplier', 'companyName')
      .populate('product', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Quote.countDocuments(filters)
  ]);

  res.status(200).json({
    success: true,
    count: quotes.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: quotes
  });
});

// @desc    Get single quote
// @route   GET /api/admin/quotes/:id
// @access  Private/Admin
exports.getQuoteById = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)
    .populate('customer', 'name email company phone address')
    .populate('supplier', 'companyName email phone')
    .populate('product', 'name images price')
    .populate('assignedTo', 'name email');

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Update quote status
// @route   PATCH /api/admin/quotes/:id/status
// @access  Private/Admin
exports.updateQuoteStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  quote.status = status;
  await quote.save();

  res.status(200).json({
    success: true,
    message: `Quote status updated to ${status}`,
    data: quote
  });
});

// @desc    Send quote response
// @route   POST /api/admin/quotes/:id/respond
// @access  Private/Admin
exports.sendQuoteResponse = asyncHandler(async (req, res, next) => {
  const { quotedPrice, moq, leadTime, paymentTerms, shippingTerms, validUntil, notes } = req.body;
  
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  quote.supplierResponse = {
    quotedPrice,
    moq,
    leadTime,
    paymentTerms,
    shippingTerms,
    validUntil,
    notes,
    respondedAt: new Date()
  };
  quote.status = 'quoted';
  await quote.save();

  res.status(200).json({
    success: true,
    message: 'Quote response sent successfully',
    data: quote
  });
});

// @desc    Assign quote to admin/user
// @route   PATCH /api/admin/quotes/:id/assign
// @access  Private/Admin
exports.assignQuote = asyncHandler(async (req, res, next) => {
  const { assignedTo } = req.body;
  
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  quote.assignedTo = assignedTo;
  if (quote.status === 'pending') {
    quote.status = 'in-review';
  }
  await quote.save();

  res.status(200).json({
    success: true,
    message: 'Quote assigned successfully',
    data: quote
  });
});

// @desc    Delete quote
// @route   DELETE /api/admin/quotes/:id
// @access  Private/Admin
exports.deleteQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  await quote.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Quote deleted successfully'
  });
});

// @desc    Get all shipments (with pagination)
// @route   GET /api/admin/shipments
// @access  Private/Admin
exports.getAllShipments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const [shipments, total] = await Promise.all([
    Shipment.find(filters)
      .populate('order')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Shipment.countDocuments(filters)
  ]);

  res.status(200).json({
    success: true,
    count: shipments.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: shipments
  });
});

// @desc    Get all contact submissions
// @route   GET /api/admin/contacts
// @access  Private/Admin
exports.getAllContacts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const [contacts, total] = await Promise.all([
    Contact.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Contact.countDocuments(filters)
  ]);

  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: contacts
  });
});

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getSystemStats = asyncHandler(async (req, res, next) => {
  // Get user role distribution
  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  // Get order status distribution
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Get monthly revenue (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      usersByRole,
      ordersByStatus,
      monthlyRevenue
    }
  });
});

// @desc    Get supplier by ID
// @route   GET /api/admin/suppliers/:id
// @access  Private/Admin
exports.getSupplierById = asyncHandler(async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id).populate('user', 'email firstName lastName');

  if (!supplier) {
    return next(new ErrorResponse('Supplier not found', 404));
  }

  res.status(200).json({
    success: true,
    data: supplier
  });
});

// @desc    Get all suppliers
// @route   GET /api/admin/suppliers
// @access  Private/Admin
exports.getAllSuppliers = asyncHandler(async (req, res, next) => {
  console.log('\n🏭 ===== GET ALL SUPPLIERS =====');
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build filters
  const filters = {};
  
  // Status filter
  if (req.query.status) {
    if (req.query.status === 'verified') {
      filters.verificationStatus = 'verified';
    } else if (req.query.status === 'pending') {
      filters.verificationStatus = 'pending';
    } else if (req.query.status === 'rejected') {
      filters.verificationStatus = 'rejected';
    }
  }
  
  // Country filter
  if (req.query.country) {
    filters.country = req.query.country;
  }
  
  // Search filter
  if (req.query.search) {
    filters.$or = [
      { companyName: { $regex: req.query.search, $options: 'i' } },
      { mainProducts: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Get stats
  const [totalSuppliers, verified, pending, rejected] = await Promise.all([
    Supplier.countDocuments(),
    Supplier.countDocuments({ verificationStatus: 'verified' }),
    Supplier.countDocuments({ verificationStatus: 'pending' }),
    Supplier.countDocuments({ verificationStatus: 'rejected' })
  ]);

  // Get suppliers with user data
  const [suppliers, total] = await Promise.all([
    Supplier.find(filters)
      .populate('user', 'name email phone isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Supplier.countDocuments(filters)
  ]);

  // Transform data for frontend
  const transformedSuppliers = suppliers.map(supplier => {
    const productsCount = supplier.totalOrders || 0;
    
    return {
      _id: supplier._id,
      companyName: supplier.companyName,
      businessType: supplier.businessType,
      contactPerson: supplier.user?.name || 'N/A',
      email: supplier.user?.email || 'N/A',
      phone: supplier.user?.phone || 'N/A',
      country: supplier.country,
      city: supplier.city,
      yearEstablished: supplier.yearsInBusiness ? new Date().getFullYear() - supplier.yearsInBusiness : 'N/A',
      productsCount: productsCount,
      rating: supplier.rating || 0,
      isVerified: supplier.verificationStatus === 'verified',
      status: supplier.verificationStatus,
      exportCapabilities: supplier.productCategories?.join(', ') || '',
      documents: {
        businessLicense: !!supplier.businessLicense?.url,
        taxCertificate: !!supplier.taxId,
        exportLicense: !!supplier.certificates?.length,
        bankDetails: !!supplier.user?.isActive
      }
    };
  });

  console.log(`✅ Found ${total} suppliers (page ${page})`);
  console.log('===== GET SUPPLIERS COMPLETED =====\n');

  res.status(200).json({
    success: true,
    data: {
      suppliers: transformedSuppliers,
      stats: {
        totalSuppliers,
        verified,
        pending,
        rejected
      },
      count: transformedSuppliers.length,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Approve supplier
// @route   PUT /api/admin/suppliers/:id/approve
// @access  Private/Admin
exports.approveSupplier = asyncHandler(async (req, res, next) => {
  console.log('\n✅ ===== APPROVE SUPPLIER =====');
  
  const supplier = await Supplier.findById(req.params.id);
  
  if (!supplier) {
    console.log('❌ Supplier not found');
    return next(new ErrorResponse('Supplier not found', 404));
  }
  
  supplier.verificationStatus = 'verified';
  await supplier.save();
  
  // Update user status
  await User.findByIdAndUpdate(supplier.user, { isActive: true });
  
  console.log(`✅ Supplier ${supplier.companyName} approved`);
  console.log('===== APPROVE SUPPLIER COMPLETED =====\n');
  
  res.status(200).json({
    success: true,
    message: 'Supplier approved successfully',
    data: supplier
  });
});

// @desc    Reject supplier
// @route   PUT /api/admin/suppliers/:id/reject
// @access  Private/Admin
exports.rejectSupplier = asyncHandler(async (req, res, next) => {
  console.log('\n❌ ===== REJECT SUPPLIER =====');
  
  const supplier = await Supplier.findById(req.params.id);
  
  if (!supplier) {
    console.log('❌ Supplier not found');
    return next(new ErrorResponse('Supplier not found', 404));
  }
  
  supplier.verificationStatus = 'rejected';
  await supplier.save();
  
  // Update user status
  await User.findByIdAndUpdate(supplier.user, { isActive: false });
  
  console.log(`❌ Supplier ${supplier.companyName} rejected`);
  console.log('===== REJECT SUPPLIER COMPLETED =====\n');
  
  res.status(200).json({
    success: true,
    message: 'Supplier rejected successfully',
    data: supplier
  });
});

// @desc    Create supplier manually by admin
// @route   POST /api/admin/suppliers
// @access  Private/Admin
exports.createSupplier = asyncHandler(async (req, res, next) => {
  console.log('\n➕ ===== CREATE SUPPLIER =====');
  console.log('Data:', req.body);

  const {
    email,
    companyName,
    businessType,
    country,
    city,
    address,
    phone,
    website,
    description,
    mainProducts,
    productCategories
  } = req.body;

  // Validate required fields
  if (!email || !companyName || !businessType || !country || !city || !address) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Check if user with email exists
  let user = await User.findOne({ email });
  
  if (!user) {
    // Create user account for supplier
    user = await User.create({
      name: companyName,
      email,
      password: Math.random().toString(36).slice(-8) + 'Aa1!', // Generate random password
      phone,
      company: companyName,
      country,
      role: 'supplier',
      isActive: true,
      isVerified: false,
      isEmailVerified: false
    });
    console.log('✅ User account created:', user.email);
  }

  // Check if supplier already exists for this user
  const existingSupplier = await Supplier.findOne({ user: user._id });
  if (existingSupplier) {
    return next(new ErrorResponse('Supplier already exists for this user', 400));
  }

  // Create supplier
  const supplier = await Supplier.create({
    user: user._id,
    companyName,
    businessType,
    country,
    city,
    address,
    website,
    description,
    mainProducts,
    productCategories: productCategories ? productCategories.split(',').map(c => c.trim()) : [],
    verificationStatus: 'verified', // Auto-verify admin-created suppliers
    isActive: true
  });

  console.log('✅ Supplier created:', supplier.companyName);
  console.log('===== CREATE SUPPLIER COMPLETED =====\n');

  res.status(201).json({
    success: true,
    message: 'Supplier created successfully',
    data: supplier
  });
});

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
exports.getAllPayments = asyncHandler(async (req, res, next) => {
  console.log('\n💰 ===== GET ALL PAYMENTS =====');
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const Payment = require('../models/Payment');
  
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.method) filters.method = req.query.method;

  const [payments, total] = await Promise.all([
    Payment.find(filters)
      .populate('user', 'name email')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(filters)
  ]);

  console.log(`✅ Found ${total} payments (page ${page})`);
  console.log('===== GET PAYMENTS COMPLETED =====\n');

  res.status(200).json({
    success: true,
    data: {
      payments,
      count: payments.length,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single product details (Admin)
// @route   GET /api/admin/products/:id
// @access  Private/Admin
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name icon')
    .populate('supplier', 'companyName country rating email phone address');

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Handle price structure - convert flat priceMin/priceMax to nested price object
  const updateData = { ...req.body };
  if (req.body.priceMin !== undefined || req.body.priceMax !== undefined) {
    updateData.price = {
      min: req.body.priceMin !== undefined ? req.body.priceMin : product.price.min,
      max: req.body.priceMax !== undefined ? req.body.priceMax : product.price.max,
      currency: req.body.priceCurrency || product.price.currency || 'USD'
    };
    delete updateData.priceMin;
    delete updateData.priceMax;
    delete updateData.priceCurrency;
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate('category', 'name').populate('supplier', 'companyName');

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Approve product
// @route   PUT /api/admin/products/:id/approve
// @access  Private/Admin
exports.approveProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product.isApproved = 'approved';
  product.isActive = true;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product approved successfully',
    data: product
  });
});

// @desc    Reject product
// @route   PUT /api/admin/products/:id/reject
// @access  Private/Admin
exports.rejectProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product.isApproved = 'rejected';
  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product rejected successfully',
    data: product
  });
});

// @desc    Toggle product active status
// @route   PATCH /api/admin/products/:id/toggle-active
// @access  Private/Admin
exports.toggleProductActive = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product.isActive = !product.isActive;
  await product.save();

  res.status(200).json({
    success: true,
    message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
    data: product
  });
});

// @desc    Toggle product featured status
// @route   PUT /api/admin/products/:id/toggle-featured
// @access  Private/Admin
exports.toggleProductFeatured = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  res.status(200).json({
    success: true,
    message: `Product ${product.isFeatured ? 'marked as featured' : 'removed from featured'}`,
    data: product
  });
});

// @desc    Get product statistics
// @route   GET /api/admin/products/stats
// @access  Private/Admin
exports.getProductStats = asyncHandler(async (req, res, next) => {
  const [
    total,
    active,
    inactive,
    pending,
    approved,
    rejected,
    featured
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: false }),
    Product.countDocuments({ isApproved: 'pending' }),
    Product.countDocuments({ isApproved: 'approved' }),
    Product.countDocuments({ isApproved: 'rejected' }),
    Product.countDocuments({ isFeatured: true })
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      active,
      inactive,
      pending,
      approved,
      rejected,
      featured
    }
  });
});

// @desc    Upload single product image
// @route   POST /api/admin/products/upload-image
// @access  Private/Admin
exports.uploadProductImage = asyncHandler(async (req, res, next) => {
  const cloudinary = require('../config/cloudinary');
  
  if (!req.files || !req.files.image) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const file = req.files.image;

  // Validate image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check file size (5MB max)
  if (file.size > 5000000) {
    return next(new ErrorResponse('Please upload an image less than 5MB', 400));
  }

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'import-export/products',
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' },
      { quality: 'auto' }
    ]
  });

  res.status(200).json({
    success: true,
    data: {
      public_id: result.public_id,
      url: result.secure_url
    }
  });
});

// @desc    Create product (admin)
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createAdminProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    shortDescription,
    sku,
    category,
    categoryName,
    subCategory,
    supplier,
    brand,
    brandName,
    priceMin,
    priceMax,
    moq,
    unit,
    stock,
    images,
    specifications,
    features,
    tags,
    material,
    color,
    size,
    weight,
    dimensions,
    packagingType,
    shippingMethods,
    leadTime,
    warranty,
    certifications,
    isFeatured
  } = req.body;

  // Auto-create category if categoryName provided but no category ID
  let finalCategory = category;
  if (!finalCategory && categoryName) {
    const existingCategory = await Category.findOne({ name: categoryName });
    if (existingCategory) {
      finalCategory = existingCategory._id;
    } else {
      const newCategory = await Category.create({ name: categoryName, isActive: true });
      finalCategory = newCategory._id;
    }
  }

  // Auto-create brand if brandName provided but no brand ID
  let finalBrand = brand;
  if (!finalBrand && brandName) {
    const existingBrand = await Brand.findOne({ name: brandName });
    if (existingBrand) {
      finalBrand = existingBrand._id;
    } else {
      const newBrand = await Brand.create({ name: brandName, isActive: true });
      finalBrand = newBrand._id;
    }
  }

  // Create product
  const product = await Product.create({
    name,
    description,
    shortDescription,
    sku,
    category: finalCategory,
    subCategory,
    supplier,
    brand: finalBrand,
    price: {
      min: priceMin,
      max: priceMax,
      currency: 'USD'
    },
    moq,
    unit: unit || 'pieces',
    stock: stock || 0,
    images: images || [],
    specifications: specifications || [],
    features: features || [],
    tags: tags || [],
    material,
    color: color || [],
    size: size || [],
    weight: weight ? { value: parseFloat(weight), unit: 'kg' } : undefined,
    dimensions,
    packaging: packagingType,
    leadTime: leadTime ? { min: parseInt(leadTime), max: parseInt(leadTime), unit: 'days' } : undefined,
    warranty,
    certifications: certifications || [],
    isActive: true,
    isFeatured: isFeatured || false,
    isApproved: 'approved' // Admin products are auto-approved
  });

  // Populate category and supplier
  await product.populate('category', 'name');
  await product.populate('supplier', 'companyName country');

  res.status(201).json({
    success: true,
    data: product
  });
});
