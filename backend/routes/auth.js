const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);
router.get('/me', protect, ctrl.getMe);
router.put('/profile', protect, upload('profiles').single('profileImage'), ctrl.updateProfile);
router.put('/change-password', protect, ctrl.changePassword);
router.get('/users', protect, admin, ctrl.getAllUsers);

module.exports = router;
