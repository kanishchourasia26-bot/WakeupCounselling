const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.createBooking = async (req, res) => {
  try {
    const bookingData = { ...req.body, userId: req.user._id };
    const booking = await Booking.create(bookingData);
    await Notification.create({
      userId: req.user._id,
      title: 'Booking Submitted',
      message: `Your appointment request ${booking.bookingId} has been submitted successfully.`,
      type: 'booking_submitted',
      relatedId: booking._id
    });
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    // EXPIRATION LOGIC REMOVED: Now a pure, fast read operation
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'fullName email phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (req.user.role !== 'admin' && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // EXPIRATION LOGIC REMOVED: No more saving to the database on a GET request
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // EXPIRATION LOGIC REMOVED: Now a pure, fast read operation
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter).populate('userId', 'fullName email phone').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes;
    await booking.save();
    
    const typeMap = {
      'Confirmed': 'booking_confirmed',
      'Rejected': 'booking_rejected',
      'Completed': 'session_completed',
      'Cancelled': 'booking_rejected'
    };
    
    await Notification.create({
      userId: booking.userId,
      title: `Booking ${status}`,
      message: `Your appointment ${booking.bookingId} has been ${status.toLowerCase()}.`,
      type: typeMap[status] || 'general',
      relatedId: booking._id
    });
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.suggestSlot = async (req, res) => {
  try {
    const { date, time } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    booking.suggestedSlot = { date, time };
    booking.suggestedSlotStatus = 'suggested';
    await booking.save();
    
    await Notification.create({
      userId: booking.userId,
      title: 'New Slot Suggested',
      message: `Admin suggested a new slot: ${date} at ${time} for booking ${booking.bookingId}.`,
      type: 'slot_suggested',
      relatedId: booking._id
    });
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.respondToSuggestion = async (req, res) => {
  try {
    const { action } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (action === 'accept') {
      booking.preferredDate = booking.suggestedSlot.date;
      booking.preferredTime = booking.suggestedSlot.time;
      booking.suggestedSlotStatus = 'accepted';
      booking.status = 'Confirmed';
    } else {
      booking.suggestedSlotStatus = 'declined';
    }
    
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    booking.status = 'Cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};