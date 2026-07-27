const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload'); 

// Define the rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { 
    success: false, 
    message: 'Too many attempts from this IP, please try again after 15 minutes.' 
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Apply the authLimiter specifically to login and register
router.post('/register', authLimiter, ctrl.register);
router.post('/login', authLimiter, ctrl.login);
router.post('/logout', ctrl.logout);

// Protected user routes
router.get('/me', protect, ctrl.getMe);
router.put('/profile', protect, upload('profiles').single('profileImage'), ctrl.updateProfile);
router.post('/change-password', protect, ctrl.changePassword);

// Password Reset Flow
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

// Protected admin routes
router.get('/users', protect, admin, ctrl.getAllUsers);

module.exports = router;