const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    score: { type: Number, default: 0 }
  }],
  order: { type: Number, default: 0 }
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  questions: [questionSchema],
  scoringRules: [{
    minScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    result: { type: String, required: true },
    description: { type: String, default: '' }
  }],
  duration: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PsychologicalTest', testSchema);
