const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['article', 'pdf', 'video'], required: true },
  url: { type: String, default: '' },
  file: { type: String, default: '' },
  category: { type: String, default: 'General' },
  isBookmarked: { type: Boolean, default: false },
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
