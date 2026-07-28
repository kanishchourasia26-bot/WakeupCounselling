const CMS = require('../models/CMS');
const Banner = require('../models/Banner');
const FAQ = require('../models/FAQ');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Event = require('../models/Event');
const Workshop = require('../models/Workshop');
const SiteDetails = require('../models/SiteDetails');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Feedback = require('../models/Feedback');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBookings, pendingBookings, completedBookings, totalContacts, totalFeedback] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Completed' }),
      Contact.countDocuments(),
      Feedback.countDocuments()
    ]);
    const recentBookings = await Booking.find().populate('userId', 'fullName email').sort({ createdAt: -1 }).limit(5);
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers, totalBookings, pendingBookings, completedBookings,
        totalContacts, totalFeedback,
        avgRating: avgRating[0] ? avgRating[0].avg.toFixed(1) : 0
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCMS = async (req, res) => {
  try {
    const items = await CMS.find();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCMSByKey = async (req, res) => {
  try {
    const item = await CMS.findOne({ key: req.params.key });
    if (!item) return res.status(404).json({ success: false, message: 'CMS item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCMS = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path;
    const item = await CMS.findOneAndUpdate({ key: req.params.key }, updates, { upsert: true, new: true });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const banner = await Banner.create(data);
    res.status(201).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path;
    const banner = await Banner.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createGalleryItem = async (req, res) => {
  console.log("🚀 === GALLERY UPLOAD API HIT HUI ===");
  console.log("📦 BODY DATA:", req.body);
  console.log("🖼️ UPLOADED FILE:", req.file);

  try {
    const imageUrl = req.file ? req.file.path : ''; 

    if (!imageUrl) {
      console.log("❌ Error: Image URL nahi mila");
      return res.status(400).json({ success: false, message: 'Image upload failed' });
    }

    const newItem = await Gallery.create({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      image: imageUrl
    });

    console.log("✅ SUCCESS! Database me save ho gaya:", newItem);
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.error("🔥 ASLI DATABASE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const items = await Testimonial.find({ isActive: true });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const event = await Event.create(data);
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path;
    const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json({ success: true, workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkshopBySlug = async (req, res) => {
  try {
    const workshop = await Workshop.findOne({ slug: req.params.slug });
    if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found' });
    const related = await Workshop.find({ _id: { $ne: workshop._id }, status: 'published' }).limit(4);
    res.json({ success: true, workshop, related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createWorkshop = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const workshop = await Workshop.create(data);
    res.status(201).json({ success: true, workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorkshop = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path;
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    await Workshop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Workshop deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSiteDetails = async (req, res) => {
  try {
    let site = await SiteDetails.findOne();
    if (!site) site = await SiteDetails.create({});
    res.json({ success: true, site });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSiteDetails = async (req, res) => {
  try {
    let site = await SiteDetails.findOne();
    if (!site) site = await SiteDetails.create({});
    Object.assign(site, req.body);
    if (req.files) {
      if (req.files.logo) site.logo = req.files.logo[0].path;
      if (req.files.favicon) site.favicon = req.files.favicon[0].path;
    }
    await site.save();
    res.json({ success: true, site });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
