const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const Order = require('../models/Order');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private/Admin
exports.getShipments = asyncHandler(async (req, res, next) => {
  let query = Shipment.find(req.queryFilter || {})
    .populate('order')
    .populate('buyer', 'name email');

  // Apply sorting
  if (req.sortBy) {
    query = query.sort(req.sortBy);
  }

  // Apply pagination
  query = query.skip(req.startIndex).limit(req.limit);

  const shipments = await query;

  res.status(200).json({
    success: true,
    count: shipments.length,
    pagination: req.pagination,
    data: shipments
  });
});

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
exports.getShipment = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findById(req.params.id)
    .populate('order')
    .populate('buyer', 'name email phone');

  if (!shipment) {
    return next(new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: shipment
  });
});

// @desc    Create shipment
// @route   POST /api/shipments
// @access  Private/Admin
exports.createShipment = asyncHandler(async (req, res, next) => {
  // Verify order exists
  const order = await Order.findById(req.body.order);
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.body.order}`, 404));
  }

  req.body.buyer = order.buyer;

  const shipment = await Shipment.create(req.body);

  // Update order status
  order.status = 'shipped';
  await order.save();

  res.status(201).json({
    success: true,
    data: shipment
  });
});

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private/Admin
exports.updateShipment = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!shipment) {
    return next(new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: shipment
  });
});

// @desc    Update shipment status
// @route   PUT /api/shipments/:id/status
// @access  Private/Admin
exports.updateShipmentStatus = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    return next(new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404));
  }

  shipment.status = req.body.status;
  
  if (req.body.status === 'delivered') {
    shipment.deliveredAt = Date.now();
    
    // Update order status
    const order = await Order.findById(shipment.order);
    if (order) {
      order.status = 'delivered';
      order.deliveredAt = Date.now();
      await order.save();
    }
  }

  await shipment.save();

  res.status(200).json({
    success: true,
    data: shipment
  });
});

// @desc    Add tracking update
// @route   PUT /api/shipments/:id/tracking
// @access  Private/Admin
exports.addTrackingUpdate = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    return next(new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404));
  }

  shipment.trackingHistory.push({
    status: req.body.status,
    location: req.body.location,
    description: req.body.description,
    timestamp: Date.now()
  });

  shipment.currentLocation = req.body.location;
  await shipment.save();

  res.status(200).json({
    success: true,
    data: shipment
  });
});

// @desc    Track shipment by tracking number
// @route   GET /api/shipments/track/:trackingNumber
// @access  Public
exports.trackShipment = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber })
    .populate('order', 'orderNumber')
    .select('-buyer');

  if (!shipment) {
    return next(new ErrorResponse('Shipment not found with this tracking number', 404));
  }

  res.status(200).json({
    success: true,
    data: shipment
  });
});

// @desc    Get shipment statistics
// @route   GET /api/shipments/stats
// @access  Private/Admin
exports.getShipmentStats = asyncHandler(async (req, res, next) => {
  const totalShipments = await Shipment.countDocuments();
  const pendingShipments = await Shipment.countDocuments({ status: 'pending' });
  const inTransitShipments = await Shipment.countDocuments({ status: 'in_transit' });
  const deliveredShipments = await Shipment.countDocuments({ status: 'delivered' });

  // Get shipments by carrier
  const carrierBreakdown = await Shipment.aggregate([
    { $group: { _id: '$carrier', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: totalShipments,
      pending: pendingShipments,
      inTransit: inTransitShipments,
      delivered: deliveredShipments,
      carrierBreakdown
    }
  });
});
