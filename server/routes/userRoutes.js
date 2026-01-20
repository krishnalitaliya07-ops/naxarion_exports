const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleActiveStatus,
  getUsersByRole,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validation');
const { advancedFilter, sorting, paginate } = require('../middleware/pagination');
const User = require('../models/User');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getUserStats);
router.get('/role/:role', getUsersByRole);

router
  .route('/')
  .get(advancedFilter, sorting, paginate(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(validateId, validate, getUser)
  .put(validateId, validate, updateUser)
  .delete(validateId, validate, deleteUser);

router.put('/:id/toggle-active', validateId, validate, toggleActiveStatus);

module.exports = router;
