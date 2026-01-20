const express = require('express');
const {
  getSettings,
  updateSettings,
  updateGeneralSettings,
  updatePaymentSettings,
  updateShippingSettings,
  updateEmailSettings,
  updateBusinessSettings,
  updateNotificationSettings,
  updateSEOSettings,
  toggleMaintenanceMode,
  updateLegalDocuments
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getSettings)
  .put(updateSettings);

router.put('/general', updateGeneralSettings);
router.put('/payment', updatePaymentSettings);
router.put('/shipping', updateShippingSettings);
router.put('/email', updateEmailSettings);
router.put('/business', updateBusinessSettings);
router.put('/notifications', updateNotificationSettings);
router.put('/seo', updateSEOSettings);
router.put('/maintenance', toggleMaintenanceMode);
router.put('/legal', updateLegalDocuments);

module.exports = router;
