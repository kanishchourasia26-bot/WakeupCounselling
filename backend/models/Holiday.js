const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  reason: { type: String, default: '' },
  type: { type: String, enum: ['holiday', 'block'], default: 'holiday' }
}, { timestamps: true });

module.exports = mongoose.model('Holiday', holidaySchema);
