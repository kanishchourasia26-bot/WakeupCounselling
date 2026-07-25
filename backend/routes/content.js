const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/contentController');

// Dashboard stats
router.get('/dashboard/stats', protect, admin, ctrl.getDashboardStats);

// Site details
router.get('/site-details', ctrl.getSiteDetails);
router.put('/site-details', protect, admin,
  upload('logos').fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
  ctrl.updateSiteDetails
);

// CMS
router.get('/cms', ctrl.getCMS);
router.get('/cms/:key', ctrl.getCMSByKey);
router.put('/cms/:key', protect, admin, upload('cms').single('image'), ctrl.updateCMS);

// Banners
router.get('/banners', ctrl.getBanners);
router.post('/banners', protect, admin, upload('banners').single('image'), ctrl.createBanner);
router.put('/banners/:id', protect, admin, upload('banners').single('image'), ctrl.updateBanner);
router.delete('/banners/:id', protect, admin, ctrl.deleteBanner);

// FAQs
router.get('/faqs', ctrl.getFAQs);
router.post('/faqs', protect, admin, ctrl.createFAQ);
router.put('/faqs/:id', protect, admin, ctrl.updateFAQ);
router.delete('/faqs/:id', protect, admin, ctrl.deleteFAQ);

// Gallery
router.get('/gallery', ctrl.getGallery);
router.post('/gallery', protect, admin, upload('gallery').single('image'), ctrl.createGalleryItem);
router.delete('/gallery/:id', protect, admin, ctrl.deleteGalleryItem);

// Testimonials
router.get('/testimonials', ctrl.getTestimonials);
router.post('/testimonials', protect, admin, ctrl.createTestimonial);
router.put('/testimonials/:id', protect, admin, ctrl.updateTestimonial);
router.delete('/testimonials/:id', protect, admin, ctrl.deleteTestimonial);

// Events
router.get('/events', ctrl.getEvents);
router.get('/events/:slug', ctrl.getEventBySlug);
router.post('/events', protect, admin, upload('news').single('image'), ctrl.createEvent);
router.put('/events/:id', protect, admin, upload('news').single('image'), ctrl.updateEvent);
router.delete('/events/:id', protect, admin, ctrl.deleteEvent);

// Workshops
router.get('/workshops', ctrl.getWorkshops);
router.get('/workshops/:slug', ctrl.getWorkshopBySlug);
router.post('/workshops', protect, admin, upload('courses').single('image'), ctrl.createWorkshop);
router.put('/workshops/:id', protect, admin, upload('courses').single('image'), ctrl.updateWorkshop);
router.delete('/workshops/:id', protect, admin, ctrl.deleteWorkshop);

module.exports = router;
