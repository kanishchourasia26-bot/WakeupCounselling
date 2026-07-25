const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  body: { type: String, default: '' },
  image: { type: String, default: '' },
  date: { type: String },
  category: { type: String, default: 'event' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

eventSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
