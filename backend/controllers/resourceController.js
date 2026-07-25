const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const filter = { status: 'published' };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.file = req.file.path;
    const resource = await Resource.create(data);
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.file = req.file.path;
    const resource = await Resource.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    const idx = resource.bookmarkedBy.indexOf(req.user._id);
    if (idx > -1) {
      resource.bookmarkedBy.splice(idx, 1);
    } else {
      resource.bookmarkedBy.push(req.user._id);
    }
    await resource.save();
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const resources = await Resource.find({ bookmarkedBy: req.user._id, status: 'published' });
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
