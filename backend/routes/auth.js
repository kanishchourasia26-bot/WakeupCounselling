const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
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

// 👇 NAYE OTP VERIFICATION ROUTES (Rate limit ke saath) 👇
router.post('/send-otp', authLimiter, authController.sendOtp);
router.post('/verify-otp', authLimiter, authController.verifyOtp);
// 👆 --------------------------------------------------- 👆

// Apply the authLimiter specifically to login and register
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

// Protected user routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, upload('profiles').single('profileImage'), authController.updateProfile);
router.post('/change-password', protect, authController.changePassword);

// Password Reset Flow
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// ==========================================
// ADMIN CLIENT MANAGEMENT ROUTES (Protected)
// ==========================================
router.get('/admin/users/:id/details', protect, admin, authController.getUserDetailsForAdmin);
router.put('/admin/users/:id/notes', protect, admin, authController.updateCounselorNotes);
router.post('/admin/users/:id/resources', protect, admin, authController.addClientResource);
router.delete('/admin/users/:id/resources/:resourceId', protect, admin, authController.deleteClientResource);
router.delete('/admin/users/:id', protect, admin, authController.deleteClient);

// Protected admin general routes
router.get('/users', protect, admin, authController.getAllUsers);

module.exports = router;