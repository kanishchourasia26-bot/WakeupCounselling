const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlots: [{
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  isAdminAvailable: { type: Boolean, default: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

availableSlotSchema.index({ date: 1 });

module.exports = mongoose.model('AvailableSlot', availableSlotSchema);
