const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
exports.getContacts = asyncHandler(async (req, res, next) => {
  let query = Contact.find(req.queryFilter || {})
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name');

  // Apply search
  if (req.searchQuery) {
    query = query.find({
      $or: [
        { name: { $regex: req.searchQuery, $options: 'i' } },
        { email: { $regex: req.searchQuery, $options: 'i' } },
        { subject: { $regex: req.searchQuery, $options: 'i' } }
      ]
    });
  }

  // Apply sorting
  if (req.sortBy) {
    query = query.sort(req.sortBy);
  }

  // Apply pagination
  query = query.skip(req.startIndex).limit(req.limit);

  const contacts = await query;

  res.status(200).json({
    success: true,
    count: contacts.length,
    pagination: req.pagination,
    data: contacts
  });
});

// @desc    Get single contact message
// @route   GET /api/contacts/:id
// @access  Private/Admin
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name email');

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  // Mark as read if it's new
  if (contact.status === 'new') {
    contact.status = 'read';
    await contact.save();
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Create contact message
// @route   POST /api/contacts
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  // Add IP and user agent
  req.body.ipAddress = req.ip;
  req.body.userAgent = req.headers['user-agent'];

  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Your message has been received. We will get back to you soon!',
    data: contact
  });
});

// @desc    Update contact status
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
exports.updateContactStatus = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  contact.status = req.body.status;
  await contact.save();

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Respond to contact
// @route   PUT /api/contacts/:id/respond
// @access  Private/Admin
exports.respondToContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  contact.response = {
    message: req.body.message,
    respondedBy: req.user.id,
    respondedAt: Date.now()
  };
  contact.status = 'responded';

  await contact.save();

  // TODO: Send email response to contact

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Assign contact to user
// @route   PUT /api/contacts/:id/assign
// @access  Private/Admin
exports.assignContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  contact.assignedTo = req.body.assignedTo;
  await contact.save();

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Add note to contact
// @route   PUT /api/contacts/:id/notes
// @access  Private/Admin
exports.addNote = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  contact.notes.push({
    note: req.body.note,
    addedBy: req.user.id,
    addedAt: Date.now()
  });

  await contact.save();

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Contact deleted successfully'
  });
});

// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private/Admin
exports.getContactStats = asyncHandler(async (req, res, next) => {
  const totalContacts = await Contact.countDocuments();
  const newContacts = await Contact.countDocuments({ status: 'new' });
  const readContacts = await Contact.countDocuments({ status: 'read' });
  const respondedContacts = await Contact.countDocuments({ status: 'responded' });
  const closedContacts = await Contact.countDocuments({ status: 'closed' });

  // Get contacts by type
  const typeBreakdown = await Contact.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: totalContacts,
      new: newContacts,
      read: readContacts,
      responded: respondedContacts,
      closed: closedContacts,
      typeBreakdown
    }
  });
});
