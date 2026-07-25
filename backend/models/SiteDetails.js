const mongoose = require('mongoose');

const siteDetailsSchema = new mongoose.Schema({
  title: { type: String, default: 'Wake Up Counselling' },
  tagline: { type: String, default: 'Jabalpur' },
  about: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  youtube: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SiteDetails', siteDetailsSchema);
