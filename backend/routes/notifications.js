const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

router.get('/', protect, ctrl.getUserNotifications);
router.put('/:id/read', protect, ctrl.markAsRead);
router.put('/read-all', protect, ctrl.markAllAsRead);
router.post('/', protect, admin, ctrl.createNotification);

module.exports = router;
