const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/resourceController');

router.get('/', ctrl.getResources);
router.get('/bookmarks', protect, ctrl.getUserBookmarks);
router.post('/', protect, admin, upload('resources').single('file'), ctrl.createResource);
router.put('/:id', protect, admin, upload('resources').single('file'), ctrl.updateResource);
router.delete('/:id', protect, admin, ctrl.deleteResource);
router.put('/:id/bookmark', protect, ctrl.toggleBookmark);

module.exports = router;
