const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  address: { type: String },
  profession: { type: String, default: '' },
  bookingFor: { type: String, enum: ['Self', 'Others'], default: 'Self' },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled', 'Expired'],
    default: 'Pending'
  },
  suggestedSlot: {
    date: { type: Date },
    time: { type: String }
  },
  suggestedSlotStatus: {
    type: String,
    enum: ['none', 'suggested', 'accepted', 'declined'],
    default: 'none'
  },
  notes: { type: String, default: '' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'WC' + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

// YEH LINE MISSING THI! 👇
module.exports = mongoose.model('Booking', bookingSchema);