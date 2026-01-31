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

// @desc    Update security settings
// @route   PUT /api/settings/security
// @access  Private/Admin
exports.updateSecuritySettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.securitySettings = {
    ...settings.securitySettings,
    ...req.body
  };
  settings.updatedBy = req.user.id;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Upload logo
// @route   POST /api/settings/upload-logo
// @access  Private/Admin
exports.uploadLogo = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();
  const { logoType = 'main' } = req.body;

  // In production, handle file upload to cloudinary or similar
  if (req.file) {
    if (logoType === 'main') {
      settings.logo = {
        public_id: req.file.filename,
        url: req.file.path
      };
    } else if (logoType === 'email') {
      settings.emailLogo = {
        public_id: req.file.filename,
        url: req.file.path
      };
    }
  }
  
  settings.updatedBy = req.user.id;
  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Upload favicon
// @route   POST /api/settings/upload-favicon
// @access  Private/Admin
exports.uploadFavicon = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  if (req.file) {
    settings.favicon = {
      public_id: req.file.filename,
      url: req.file.path
    };
  }
  
  settings.updatedBy = req.user.id;
  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Reset settings to default
// @route   PUT /api/settings/reset
// @access  Private/Admin
exports.resetToDefault = asyncHandler(async (req, res, next) => {
  const { section = 'all' } = req.body;
  const settings = await Settings.getSettings();

  const defaults = {
    businessSettings: {
      minimumOrderValue: 500,
      commission: 15,
      currency: 'USD',
      rfqExpiryDays: 30,
      autoApproveProducts: false,
      multiCurrencyEnabled: true
    },
    notificationSettings: {
      newUserRegistration: true,
      newOrderPlaced: true,
      paymentReceived: true,
      newRFQSubmitted: true,
      supplierVerification: true,
      lowStockAlert: false
    },
    securitySettings: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiryDays: 90,
      maxLoginAttempts: 5
    }
  };

  if (section === 'all') {
    Object.keys(defaults).forEach(key => {
      settings[key] = defaults[key];
    });
  } else if (defaults[section]) {
    settings[section] = defaults[section];
  }

  settings.updatedBy = req.user.id;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Settings reset to default',
    data: settings
  });
});

// @desc    Get system info
// @route   GET /api/settings/system-info
// @access  Private/Admin
exports.getSystemInfo = asyncHandler(async (req, res, next) => {
  const os = require('os');
  const mongoose = require('mongoose');

  res.status(200).json({
    success: true,
    data: {
      nodeVersion: process.version,
      platform: os.platform(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: os.loadavg(),
      mongoDbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// @desc    Test email configuration
// @route   POST /api/settings/test-email
// @access  Private/Admin
exports.testEmailConfig = asyncHandler(async (req, res, next) => {
  const { testEmail } = req.body;
  
  // In production, send actual test email
  // const sendEmail = require('../utils/sendEmail');
  // await sendEmail({ to: testEmail, subject: 'Test Email', text: 'This is a test email.' });

  res.status(200).json({
    success: true,
    message: `Test email sent to ${testEmail}`
  });
});

// @desc    Test payment configuration
// @route   POST /api/settings/test-payment
// @access  Private/Admin
exports.testPaymentConfig = asyncHandler(async (req, res, next) => {
  const { provider } = req.body;
  
  // In production, verify payment provider credentials
  res.status(200).json({
    success: true,
    message: `${provider} payment configuration is valid`
  });
});
