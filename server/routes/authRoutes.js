const express = require('express');
const passport = require('../config/passport');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
  verifyEmail,
  resendCode,
  googleCallback,
  googleLogin,
  getUserSettings,
  updateUserSettings
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerValidation, loginValidation } = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendCode);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Google Firebase Authentication
router.post('/google', googleLogin);

// Legacy Google OAuth routes (kept for backwards compatibility)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
    googleCallback
  );
} else {
  // Fallback route when Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured. Please contact administrator.'
    });
  });
}

router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/settings', protect, getUserSettings);
router.put('/settings', protect, updateUserSettings);

module.exports = router;
