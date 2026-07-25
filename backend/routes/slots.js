const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const ctrl = require('../controllers/slotController');

router.get('/', ctrl.getAvailableSlots);
router.get('/holidays', ctrl.getHolidays);
router.post('/', protect, admin, ctrl.createSlot);
router.put('/:id', protect, admin, ctrl.updateSlot);
router.delete('/:id', protect, admin, ctrl.deleteSlot);
router.post('/holidays', protect, admin, ctrl.createHoliday);
router.delete('/holidays/:id', protect, admin, ctrl.deleteHoliday);

module.exports = router;
