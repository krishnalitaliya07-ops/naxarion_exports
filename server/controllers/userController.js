const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query = User.find(req.queryFilter || {});

  // Apply search
  if (req.searchQuery) {
    query = query.find({
      $or: [
        { name: { $regex: req.searchQuery, $options: 'i' } },
        { email: { $regex: req.searchQuery, $options: 'i' } },
        { company: { $regex: req.searchQuery, $options: 'i' } }
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

  const users = await query;

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: req.pagination,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-active
// @access  Private/Admin
exports.toggleActiveStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private/Admin
exports.getUsersByRole = asyncHandler(async (req, res, next) => {
  const { role } = req.params;

  if (!['buyer', 'supplier', 'admin'].includes(role)) {
    return next(new ErrorResponse('Invalid role', 400));
  }

  const users = await User.find({ role });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const buyers = await User.countDocuments({ role: 'buyer' });
  const suppliers = await User.countDocuments({ role: 'supplier' });
  const admins = await User.countDocuments({ role: 'admin' });
  const activeUsers = await User.countDocuments({ isActive: true });
  const verifiedUsers = await User.countDocuments({ isVerified: true });

  res.status(200).json({
    success: true,
    data: {
      total: totalUsers,
      buyers,
      suppliers,
      admins,
      active: activeUsers,
      verified: verifiedUsers,
      inactive: totalUsers - activeUsers
    }
  });
});
