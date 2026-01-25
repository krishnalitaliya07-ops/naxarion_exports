const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const Shipment = require('../models/Shipment');
const Contact = require('../models/Contact');
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
  if (req.query.isActive) filters.isActive = req.query.isActive === 'true';
  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { company: { $regex: req.query.search, $options: 'i' } }
    ];
  }

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
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users
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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  console.log('\n🗑️  ===== ADMIN DELETE USER =====');
  console.log('User ID:', req.params.id);

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id: ${req.params.id}`, 404));
  }

  console.log('✅ User deleted successfully:', user.email);
  console.log('===== DELETE COMPLETED =====\n');

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
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

// @desc    Get all orders (with pagination)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filters)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
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

// @desc    Get all products (with pagination)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
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

// @desc    Get all quotes (with pagination)
// @route   GET /api/admin/quotes
// @access  Private/Admin
exports.getAllQuotes = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const [quotes, total] = await Promise.all([
    Quote.find(filters)
      .populate('user', 'name email company')
      .populate('product', 'name')
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
