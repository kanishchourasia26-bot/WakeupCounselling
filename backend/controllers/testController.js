const PsychologicalTest = require('../models/PsychologicalTest');
const TestResult = require('../models/TestResult');
const Notification = require('../models/Notification');

exports.getTests = async (req, res) => {
  try {
    const tests = await PsychologicalTest.find({ isActive: true }).select('-questions.options.score');
    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await PsychologicalTest.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const test = await PsychologicalTest.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    let totalScore = 0;
    const scoredAnswers = answers.map((ans, idx) => {
      const question = test.questions[idx];
      const selectedOption = question.options[ans.selectedOption];
      const score = selectedOption ? selectedOption.score : 0;
      totalScore += score;
      return { ...ans, score };
    });
    let result = 'Normal';
    let resultDescription = '';
    for (const rule of test.scoringRules) {
      if (totalScore >= rule.minScore && totalScore <= rule.maxScore) {
        result = rule.result;
        resultDescription = rule.description;
        break;
      }
    }
    const testResult = await TestResult.create({
      userId: req.user._id,
      testId,
      answers: scoredAnswers,
      totalScore,
      result,
      resultDescription
    });
    await Notification.create({
      userId: req.user._id,
      title: 'Test Completed',
      message: `You completed "${test.title}" with result: ${result}`,
      type: 'test_completed',
      relatedId: testResult._id
    });
    res.status(201).json({ success: true, result: testResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const results = await TestResult.find({ userId: req.user._id })
      .populate('testId', 'title category')
      .sort({ createdAt: -1 });
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const result = await TestResult.findById(req.params.id)
      .populate('testId', 'title category questions');
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    if (result.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTest = async (req, res) => {
  try {
    const test = await PsychologicalTest.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const test = await PsychologicalTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    await PsychologicalTest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const results = await TestResult.find()
      .populate('userId', 'fullName email')
      .populate('testId', 'title category')
      .sort({ createdAt: -1 });
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
