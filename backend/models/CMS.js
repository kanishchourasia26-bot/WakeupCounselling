const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },
  image: { type: String, default: '' },
  banner: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CMS', cmsSchema);
