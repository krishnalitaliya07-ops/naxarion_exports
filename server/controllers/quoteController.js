const asyncHandler = require('express-async-handler');
const Quote = require('../models/Quote');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Private
exports.getQuotes = asyncHandler(async (req, res, next) => {
  let query = Quote.find(req.queryFilter || {})
    .populate('buyer', 'name email company')
    .populate('product', 'name images sku')
    .populate('supplier', 'companyName email');

  // If buyer, show only their quotes
  if (req.user.role === 'buyer') {
    query = query.find({ buyer: req.user.id });
  }

  // If supplier, show quotes for their products
  if (req.user.role === 'supplier') {
    query = query.find({ supplier: req.user.id });
  }

  // Apply sorting
  if (req.sortBy) {
    query = query.sort(req.sortBy);
  }

  // Apply pagination
  query = query.skip(req.startIndex).limit(req.limit);

  const quotes = await query;

  res.status(200).json({
    success: true,
    count: quotes.length,
    pagination: req.pagination,
    data: quotes
  });
});

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Private
exports.getQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)
    .populate('buyer', 'name email phone company')
    .populate('product', 'name images sku price moq')
    .populate('supplier', 'companyName email phone');

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (quote.buyer.toString() !== req.user.id && 
      quote.supplier.toString() !== req.user.id && 
      req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this quote', 401));
  }

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Create quote request
// @route   POST /api/quotes
// @access  Private/Buyer
exports.createQuote = asyncHandler(async (req, res, next) => {
  req.body.buyer = req.user.id;

  // Get product and validate
  const product = await Product.findById(req.body.product).populate('supplier');
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.body.product}`, 404));
  }

  req.body.supplier = product.supplier._id;

  const quote = await Quote.create(req.body);

  res.status(201).json({
    success: true,
    data: quote
  });
});

// @desc    Update quote (supplier response)
// @route   PUT /api/quotes/:id
// @access  Private/Supplier/Admin
exports.updateQuote = asyncHandler(async (req, res, next) => {
  let quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (quote.supplier.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this quote', 401));
  }

  quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Respond to quote request
// @route   PUT /api/quotes/:id/respond
// @access  Private/Supplier
exports.respondToQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (quote.supplier.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to respond to this quote', 401));
  }

  quote.status = 'responded';
  quote.response = {
    message: req.body.message,
    price: req.body.price,
    minQuantity: req.body.minQuantity,
    leadTime: req.body.leadTime,
    validUntil: req.body.validUntil,
    terms: req.body.terms
  };
  quote.respondedAt = Date.now();

  await quote.save();

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Accept quote
// @route   PUT /api/quotes/:id/accept
// @access  Private/Buyer
exports.acceptQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (quote.buyer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to accept this quote', 401));
  }

  if (quote.status !== 'responded') {
    return next(new ErrorResponse('Quote has not been responded to yet', 400));
  }

  quote.status = 'accepted';
  await quote.save();

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Reject quote
// @route   PUT /api/quotes/:id/reject
// @access  Private/Buyer
exports.rejectQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (quote.buyer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to reject this quote', 401));
  }

  quote.status = 'rejected';
  await quote.save();

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Get my quote requests
// @route   GET /api/quotes/my/requests
// @access  Private
exports.getMyQuotes = asyncHandler(async (req, res, next) => {
  const quotes = await Quote.find({ buyer: req.user.id })
    .populate('product', 'name images')
    .populate('supplier', 'companyName')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: quotes.length,
    data: quotes
  });
});

// @desc    Get quote statistics
// @route   GET /api/quotes/stats
// @access  Private/Admin
exports.getQuoteStats = asyncHandler(async (req, res, next) => {
  const totalQuotes = await Quote.countDocuments();
  const pendingQuotes = await Quote.countDocuments({ status: 'pending' });
  const respondedQuotes = await Quote.countDocuments({ status: 'responded' });
  const acceptedQuotes = await Quote.countDocuments({ status: 'accepted' });
  const rejectedQuotes = await Quote.countDocuments({ status: 'rejected' });

  res.status(200).json({
    success: true,
    data: {
      total: totalQuotes,
      pending: pendingQuotes,
      responded: respondedQuotes,
      accepted: acceptedQuotes,
      rejected: rejectedQuotes
    }
  });
});
