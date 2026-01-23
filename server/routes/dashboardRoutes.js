const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getDashboardStats,
  getRecentActivity,
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  getUserOrderStats,
  getUserQuotes,
  getUserQuoteStats,
  getUserShipments,
  getUserShipmentStats,
  getUserNotifications,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  addToRecentlyViewed,
  getRecentlyViewed
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Dashboard Overview & Stats
router.get('/overview', getDashboardOverview);
router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);

// User Profile
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// Orders
router.get('/orders', getUserOrders);
router.get('/orders/stats', getUserOrderStats);

// Quotes
router.get('/quotes', getUserQuotes);
router.get('/quotes/stats', getUserQuoteStats);

// Shipments
router.get('/shipments', getUserShipments);
router.get('/shipments/stats', getUserShipmentStats);

// Notifications
router.get('/notifications', getUserNotifications);

// Favorites
router.get('/favorites', getUserFavorites);
router.post('/favorites/:productId', addToFavorites);
router.delete('/favorites/:productId', removeFromFavorites);

// Recently Viewed
router.get('/recently-viewed', getRecentlyViewed);
router.post('/recently-viewed/:productId', addToRecentlyViewed);

module.exports = router;
