const Feedback = require('../models/Feedback');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.createFeedback = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'Completed') {
      return res.status(400).json({ success: false, message: 'Can only give feedback for completed sessions' });
    }
    const existing = await Feedback.findOne({ bookingId });
    if (existing) return res.status(400).json({ success: false, message: 'Feedback already submitted' });
    const feedback = await Feedback.create({
      userId: req.user._id, bookingId, rating, review
    });
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isVisible: true })
      .populate('userId', 'fullName profileImage')
      .populate('bookingId', 'bookingId')
      .sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'fullName email phone')
      .populate('bookingId', 'bookingId')
      .sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
