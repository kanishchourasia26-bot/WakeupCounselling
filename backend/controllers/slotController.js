const AvailableSlot = require('../models/AvailableSlot');
const Holiday = require('../models/Holiday');

exports.getAvailableSlots = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const slots = await AvailableSlot.find(filter).sort({ date: 1 });
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSlot = async (req, res) => {
  try {
    const { date, timeSlots } = req.body;
    const slot = await AvailableSlot.findOneAndUpdate(
      { date: new Date(date) },
      { date: new Date(date), timeSlots, isAdminAvailable: true },
      { upsert: true, new: true }
    );
    res.json({ success: true, slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const slot = await AvailableSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await AvailableSlot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json({ success: true, holidays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.create(req.body);
    res.status(201).json({ success: true, holiday });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Holiday removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
