const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get platform settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update platform settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.updateSettings(req.body, req.user.id);

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update general settings
// @route   PUT /api/settings/general
// @access  Private/Admin
exports.updateGeneralSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.siteName = req.body.siteName || settings.siteName;
  settings.siteDescription = req.body.siteDescription || settings.siteDescription;
  settings.siteEmail = req.body.siteEmail || settings.siteEmail;
  settings.sitePhone = req.body.sitePhone || settings.sitePhone;
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update payment settings
// @route   PUT /api/settings/payment
// @access  Private/Admin
exports.updatePaymentSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.paymentSettings = {
    ...settings.paymentSettings,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update shipping settings
// @route   PUT /api/settings/shipping
// @access  Private/Admin
exports.updateShippingSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.shippingSettings = {
    ...settings.shippingSettings,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update email settings
// @route   PUT /api/settings/email
// @access  Private/Admin
exports.updateEmailSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.emailSettings = {
    ...settings.emailSettings,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update business settings
// @route   PUT /api/settings/business
// @access  Private/Admin
exports.updateBusinessSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.businessSettings = {
    ...settings.businessSettings,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update notification settings
// @route   PUT /api/settings/notifications
// @access  Private/Admin
exports.updateNotificationSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.notificationSettings = {
    ...settings.notificationSettings,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update SEO settings
// @route   PUT /api/settings/seo
// @access  Private/Admin
exports.updateSEOSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.seoSettings = {
    ...settings.seoSettings,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Toggle maintenance mode
// @route   PUT /api/settings/maintenance
// @access  Private/Admin
exports.toggleMaintenanceMode = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.maintenanceMode.enabled = !settings.maintenanceMode.enabled;
  settings.maintenanceMode.message = req.body.message || settings.maintenanceMode.message;
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update legal documents
// @route   PUT /api/settings/legal
// @access  Private/Admin
exports.updateLegalDocuments = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.legal = {
    ...settings.legal,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});
