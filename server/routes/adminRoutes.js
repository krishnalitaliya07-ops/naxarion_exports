const express = require('express');
const router = express.Router();
const {
  getAdminDashboardOverview,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActive,
  getAllOrders,
  getAllProducts,
  getAllQuotes,
  getAllShipments,
  getAllContacts,
  getSystemStats
} = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/overview', getAdminDashboardOverview);
router.get('/stats', getSystemStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-active', toggleUserActive);

// Orders Management
router.get('/orders', getAllOrders);

// Products Management
router.get('/products', getAllProducts);

// Quotes Management
router.get('/quotes', getAllQuotes);

// Shipments Management
router.get('/shipments', getAllShipments);

// Contact Submissions
router.get('/contacts', getAllContacts);

module.exports = router;
