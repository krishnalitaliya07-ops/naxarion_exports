const Order = require('../models/Order');
const Quote = require('../models/Quote');
const Shipment = require('../models/Shipment');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
exports.getDashboardOverview = async (req, res) => {
  try {
    console.log('\n📊 ===== DASHBOARD OVERVIEW REQUEST =====');
    const userId = req.user.id;
    console.log('User ID:', userId);
    console.log('User:', req.user.name);

    // Get all stats in parallel
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalQuotes,
      activeShipments,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments({ user: userId }),
      Order.countDocuments({ user: userId, status: 'pending' }),
      Order.countDocuments({ user: userId, status: 'completed' }),
      Quote.countDocuments({ user: userId }),
      Shipment.countDocuments({ order: { $in: await Order.find({ user: userId }).select('_id') }, status: 'in_transit' }),
      Order.find({ user: userId })
        .sort('-createdAt')
        .limit(5)
        .populate('product', 'name price')
    ]);

    // Calculate total spent
    const orders = await Order.find({ user: userId, status: 'completed' });
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    console.log('✅ Dashboard Stats:');
    console.log('  - Total Orders:', totalOrders);
    console.log('  - Pending Orders:', pendingOrders);
    console.log('  - Completed Orders:', completedOrders);
    console.log('  - Total Quotes:', totalQuotes);
    console.log('  - Active Shipments:', activeShipments);
    console.log('  - Total Spent: $', totalSpent);
    console.log('  - Recent Orders:', recentOrders.length);
    console.log('===== DASHBOARD OVERVIEW COMPLETED =====\n');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalQuotes,
          activeShipments,
          totalSpent
        },
        recentOrders: recentOrders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          product: order.product?.name,
          status: order.status,
          amount: order.totalAmount,
          date: order.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('❌ Dashboard Overview Error:', error.message);
    console.log('===== DASHBOARD OVERVIEW FAILED =====\n');
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview',
      error: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = {
      totalOrders: await Order.countDocuments({ user: userId }),
      pendingOrders: await Order.countDocuments({ user: userId, status: 'pending' }),
      completedOrders: await Order.countDocuments({ user: userId, status: 'completed' }),
      cancelledOrders: await Order.countDocuments({ user: userId, status: 'cancelled' }),
      totalQuotes: await Quote.countDocuments({ user: userId }),
      pendingQuotes: await Quote.countDocuments({ user: userId, status: 'pending' }),
      acceptedQuotes: await Quote.countDocuments({ user: userId, status: 'accepted' }),
      activeShipments: await Shipment.countDocuments({ status: 'in_transit' }),
      deliveredShipments: await Shipment.countDocuments({ status: 'delivered' })
    };

    // Calculate total spent
    const completedOrders = await Order.find({ user: userId, status: 'completed' });
    stats.totalSpent = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private
exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent orders, quotes, and shipments
    const [recentOrders, recentQuotes, recentShipments] = await Promise.all([
      Order.find({ user: userId })
        .sort('-createdAt')
        .limit(limit)
        .populate('product', 'name'),
      Quote.find({ user: userId })
        .sort('-createdAt')
        .limit(limit),
      Shipment.find({ user: userId })
        .sort('-updatedAt')
        .limit(limit)
    ]);

    // Combine and sort activities
    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        id: order._id,
        description: `Order placed for ${order.product?.name}`,
        status: order.status,
        date: order.createdAt
      })),
      ...recentQuotes.map(quote => ({
        type: 'quote',
        id: quote._id,
        description: `Quote request submitted`,
        status: quote.status,
        date: quote.createdAt
      })),
      ...recentShipments.map(shipment => ({
        type: 'shipment',
        id: shipment._id,
        description: `Shipment ${shipment.trackingNumber}`,
        status: shipment.status,
        date: shipment.updatedAt
      }))
    ].sort((a, b) => b.date - a.date).slice(0, limit);

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/dashboard/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/dashboard/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (company) user.company = company;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/dashboard/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { user: userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('product', 'name price images');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get user order stats
// @route   GET /api/dashboard/orders/stats
// @access  Private
exports.getUserOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = {
      total: await Order.countDocuments({ user: userId }),
      pending: await Order.countDocuments({ user: userId, status: 'pending' }),
      processing: await Order.countDocuments({ user: userId, status: 'processing' }),
      shipped: await Order.countDocuments({ user: userId, status: 'shipped' }),
      delivered: await Order.countDocuments({ user: userId, status: 'delivered' }),
      cancelled: await Order.countDocuments({ user: userId, status: 'cancelled' })
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order stats',
      error: error.message
    });
  }
};

// @desc    Get user quotes
// @route   GET /api/dashboard/quotes
// @access  Private
exports.getUserQuotes = async (req, res) => {
  try {
    console.log('\n📋 ========== GET USER QUOTES ==========');
    const userId = req.user.id;
    console.log('User ID:', userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { customer: userId };
    if (status) query.status = status;
    console.log('Query:', query);

    const quotes = await Quote.find(query)
      .populate('supplier', 'companyName email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Quote.countDocuments(query);
    console.log('✅ Quotes found:', quotes.length);
    console.log('Total quotes:', total);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      data: quotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log('❌ ERROR fetching quotes:', error.message);
    console.log('========================================\n');
    res.status(500).json({
      success: false,
      message: 'Error fetching quotes',
      error: error.message
    });
  }
};

// @desc    Get user quote stats
// @route   GET /api/dashboard/quotes/stats
// @access  Private
exports.getUserQuoteStats = async (req, res) => {
  try {
    console.log('\n📊 ========== GET USER QUOTE STATS ==========');
    const userId = req.user.id;
    console.log('User ID:', userId);

    const stats = {
      total: await Quote.countDocuments({ customer: userId }),
      pending: await Quote.countDocuments({ customer: userId, status: 'pending' }),
      accepted: await Quote.countDocuments({ customer: userId, status: 'accepted' }),
      rejected: await Quote.countDocuments({ customer: userId, status: 'rejected' })
    };
    console.log('✅ Stats:', stats);
    console.log('============================================\n');

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.log('❌ ERROR fetching quote stats:', error.message);
    console.log('============================================\n');
    res.status(500).json({
      success: false,
      message: 'Error fetching quote stats',
      error: error.message
    });
  }
};

// @desc    Get user shipments
// @route   GET /api/dashboard/shipments
// @access  Private
exports.getUserShipments = async (req, res) => {
  try {
    console.log('\n📦 ========== GET USER SHIPMENTS ==========');
    const userId = req.user.id;
    console.log('User ID:', userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Find user's orders first
    const userOrders = await Order.find({ user: userId }).select('_id');
    const orderIds = userOrders.map(order => order._id);
    console.log('User orders found:', orderIds.length);

    const shipments = await Shipment.find({ order: { $in: orderIds } })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('order', 'orderNumber');

    const total = await Shipment.countDocuments({ order: { $in: orderIds } });
    console.log('✅ Shipments found:', shipments.length);
    console.log('Total shipments:', total);
    console.log('==========================================\n');

    res.status(200).json({
      success: true,
      data: shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log('❌ ERROR fetching shipments:', error.message);
    console.log('==========================================\n');
    res.status(500).json({
      success: false,
      message: 'Error fetching shipments',
      error: error.message
    });
  }
};

// @desc    Get user shipment stats
// @route   GET /api/dashboard/shipments/stats
// @access  Private
exports.getUserShipmentStats = async (req, res) => {
  try {
    console.log('\n📊 ========== GET USER SHIPMENT STATS ==========');
    const userId = req.user.id;
    console.log('User ID:', userId);
    
    const userOrders = await Order.find({ user: userId }).select('_id');
    const orderIds = userOrders.map(order => order._id);

    const stats = {
      total: await Shipment.countDocuments({ order: { $in: orderIds } }),
      pending: await Shipment.countDocuments({ order: { $in: orderIds }, status: 'Pending Pickup' }),
      in_transit: await Shipment.countDocuments({ order: { $in: orderIds }, status: 'In Transit' }),
      delivered: await Shipment.countDocuments({ order: { $in: orderIds }, status: 'Delivered' })
    };
    console.log('✅ Stats:', stats);
    console.log('===============================================\n');

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.log('❌ ERROR fetching shipment stats:', error.message);
    console.log('===============================================\n');
    res.status(500).json({
      success: false,
      message: 'Error fetching shipment stats',
      error: error.message
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/dashboard/notifications
// @access  Private
exports.getUserNotifications = async (req, res) => {
  try {
    // This will be implemented when Notification model is ready
    res.status(200).json({
      success: true,
      data: [],
      message: 'Notifications feature coming soon'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// @desc    Add product to favorites
// @route   POST /api/dashboard/favorites/:productId
// @access  Private
exports.addToFavorites = async (req, res) => {
  try {
    console.log('\n⭐ ========== ADD TO FAVORITES ==========');
    const userId = req.user.id;
    const { productId } = req.params;
    console.log('User ID:', userId);
    console.log('Product ID:', productId);

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log('❌ ERROR: Product not found');
      console.log('=========================================\n');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get user and check if already in favorites
    const user = await User.findById(userId);
    if (user.favorites.includes(productId)) {
      console.log('⚠️  Product already in favorites');
      console.log('=========================================\n');
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    // Add to favorites
    user.favorites.push(productId);
    await user.save();
    console.log('✅ Product added to favorites successfully');
    console.log('=========================================\n');

    res.status(200).json({
      success: true,
      message: 'Product added to favorites'
    });
  } catch (error) {
    console.log('❌ ERROR adding to favorites:', error.message);
    console.log('=========================================\n');
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
};

// @desc    Remove product from favorites
// @route   DELETE /api/dashboard/favorites/:productId
// @access  Private
exports.removeFromFavorites = async (req, res) => {
  try {
    console.log('\n🗑️  ========== REMOVE FROM FAVORITES ==========');
    const userId = req.user.id;
    const { productId } = req.params;
    console.log('User ID:', userId);
    console.log('Product ID:', productId);

    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();
    console.log('✅ Product removed from favorites successfully');
    console.log('===============================================\n');

    res.status(200).json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error) {
    console.log('❌ ERROR removing from favorites:', error.message);
    console.log('===============================================\n');
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/dashboard/favorites
// @access  Private
exports.getUserFavorites = async (req, res) => {
  try {
    console.log('\n💖 ========== GET USER FAVORITES ==========');
    const userId = req.user.id;
    console.log('User ID:', userId);
    
    const user = await User.findById(userId).populate({
      path: 'favorites',
      populate: [
        { path: 'category', select: 'name icon' },
        { path: 'supplier', select: 'companyName country rating' }
      ]
    });
    console.log('✅ Favorites found:', user.favorites.length);
    console.log('===========================================\n');

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    console.log('❌ ERROR fetching favorites:', error.message);
    console.log('===========================================\n');
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// @desc    Add product to recently viewed
// @route   POST /api/dashboard/recently-viewed/:productId
// @access  Private
exports.addToRecentlyViewed = async (req, res) => {
  try {
    console.log('\n👁️  ========== ADD TO RECENTLY VIEWED ==========');
    const userId = req.user.id;
    const { productId } = req.params;
    console.log('User ID:', userId);
    console.log('Product ID:', productId);

    const user = await User.findById(userId);
    
    // Remove if already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      item => item.product.toString() !== productId
    );
    
    // Add to beginning
    user.recentlyViewed.unshift({
      product: productId,
      viewedAt: new Date()
    });
    
    // Keep only last 20 items
    user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    
    await user.save();
    console.log('✅ Added to recently viewed successfully');
    console.log('================================================\n');

    res.status(200).json({
      success: true,
      message: 'Added to recently viewed'
    });
  } catch (error) {
    console.log('❌ ERROR adding to recently viewed:', error.message);
    console.log('================================================\n');
    res.status(500).json({
      success: false,
      message: 'Error adding to recently viewed',
      error: error.message
    });
  }
};

// @desc    Get recently viewed products
// @route   GET /api/dashboard/recently-viewed
// @access  Private
exports.getRecentlyViewed = async (req, res) => {
  try {
    console.log('\n👁️  ========== GET RECENTLY VIEWED ==========');
    const userId = req.user.id;
    console.log('User ID:', userId);
    
    const user = await User.findById(userId).populate({
      path: 'recentlyViewed.product',
      populate: [
        { path: 'category', select: 'name icon' },
        { path: 'supplier', select: 'companyName country rating' }
      ]
    });

    const recentlyViewed = user.recentlyViewed
      .filter(item => item.product) // Filter out any null products
      .map(item => ({
        ...item.product.toObject(),
        viewedAt: item.viewedAt
      }));
    console.log('✅ Recently viewed found:', recentlyViewed.length);
    console.log('============================================\n');

    res.status(200).json({
      success: true,
      count: recentlyViewed.length,
      data: recentlyViewed
    });
  } catch (error) {
    console.log('❌ ERROR fetching recently viewed:', error.message);
    console.log('============================================\n');
    res.status(500).json({
      success: false,
      message: 'Error fetching recently viewed',
      error: error.message
    });
  }
};
