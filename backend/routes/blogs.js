const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/blogController');

router.get('/', ctrl.getBlogs);
router.get('/all', protect, admin, ctrl.getAllBlogs);
router.get('/:slug', ctrl.getBlogBySlug);
router.post('/', protect, admin, upload('blogs').single('image'), ctrl.createBlog);
router.put('/:id', protect, admin, upload('blogs').single('image'), ctrl.updateBlog);
router.delete('/:id', protect, admin, ctrl.deleteBlog);

module.exports = router;
