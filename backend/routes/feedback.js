const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const ctrl = require('../controllers/feedbackController');

router.post('/', protect, ctrl.createFeedback);
router.get('/', ctrl.getAllFeedback);
router.get('/admin', protect, admin, ctrl.getAdminFeedback);

module.exports = router;
