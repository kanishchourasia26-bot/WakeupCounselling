const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'PsychologicalTest', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    selectedOption: { type: Number },
    score: { type: Number, default: 0 }
  }],
  totalScore: { type: Number, required: true },
  result: { type: String, required: true },
  resultDescription: { type: String, default: '' },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);
