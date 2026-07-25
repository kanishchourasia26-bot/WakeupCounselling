const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const ctrl = require('../controllers/contactController');

router.post('/', ctrl.createContact);
router.get('/', protect, admin, ctrl.getAllContacts);
router.delete('/:id', protect, admin, ctrl.deleteContact);

module.exports = router;
