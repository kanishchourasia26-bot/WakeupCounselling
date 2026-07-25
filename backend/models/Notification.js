const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['signup', 'booking_submitted', 'booking_confirmed', 'booking_rejected',
           'session_reminder', 'session_completed', 'profile_updated', 'test_completed',
           'slot_suggested', 'general'],
    default: 'general'
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
