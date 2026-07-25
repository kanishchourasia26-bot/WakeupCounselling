const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const ctrl = require('../controllers/testController');

// IMPORTANT: Specific routes must come BEFORE parameterized routes (/:id)

// User result routes (specific paths first)
router.get('/results/my', protect, ctrl.getUserResults);
router.get('/results/:id', protect, ctrl.getResultById);
router.get('/results', protect, admin, ctrl.getAllResults);

// Submit test
router.post('/submit', protect, ctrl.submitTest);

// Public routes
router.get('/', ctrl.getTests);

// Parameterized routes (must come AFTER specific routes)
router.get('/:id', ctrl.getTestById);

// Admin routes
router.post('/', protect, admin, ctrl.createTest);
router.put('/:id', protect, admin, ctrl.updateTest);
router.delete('/:id', protect, admin, ctrl.deleteTest);

module.exports = router;
