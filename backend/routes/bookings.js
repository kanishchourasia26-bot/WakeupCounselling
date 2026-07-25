const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const ctrl = require('../controllers/bookingController');

router.post('/', protect, ctrl.createBooking);
router.get('/my', protect, ctrl.getUserBookings);
router.get('/:id', protect, ctrl.getBookingById);
router.put('/:id/cancel', protect, ctrl.cancelBooking);
router.put('/:id/respond', protect, ctrl.respondToSuggestion);
router.get('/', protect, admin, ctrl.getAllBookings);
router.put('/:id/status', protect, admin, ctrl.updateBookingStatus);
router.put('/:id/suggest', protect, admin, ctrl.suggestSlot);

module.exports = router;
