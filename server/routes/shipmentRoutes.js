const express = require('express');
const {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  addTrackingUpdate,
  trackShipment,
  getShipmentStats
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validation');
const { advancedFilter, sorting, paginate } = require('../middleware/pagination');
const Shipment = require('../models/Shipment');

const router = express.Router();

// Public route for tracking
router.get('/track/:trackingNumber', trackShipment);

// Protected routes
router.use(protect);

router.get('/stats', authorize('admin'), getShipmentStats);

router
  .route('/')
  .get(authorize('admin'), advancedFilter, sorting, paginate(Shipment), getShipments)
  .post(authorize('admin'), createShipment);

router
  .route('/:id')
  .get(validateId, validate, getShipment)
  .put(authorize('admin'), validateId, validate, updateShipment);

router.put('/:id/status', authorize('admin'), validateId, validate, updateShipmentStatus);
router.put('/:id/tracking', authorize('admin'), validateId, validate, addTrackingUpdate);

module.exports = router;
