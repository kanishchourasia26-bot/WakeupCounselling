const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const crypto = require('crypto');
const Booking = require('../models/Booking'); 
// Agar Test model bhi hai toh usko bhi import kar lena: const Test = require('../models/Test');
// Helper function to set secure cookie options
const getCookieOptions = () => ({
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
  httpOnly: true, // Makes token invisible to frontend JavaScript (prevents XSS)
  secure: process.env.NODE_ENV === 'production', // Use HTTPS only in production
  sameSite: 'strict' // Prevents CSRF attacks
});

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, gender, dateOfBirth, address, occupation, emergencyContact } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone: phone || '',
      gender: gender || '',
      dateOfBirth: dateOfBirth || null,
      address: address || '',
      occupation: occupation || '',
      emergencyContact: emergencyContact || ''
    });

    const token = generateToken(user._id);
    
    // Attach token as an httpOnly cookie
    res.status(201)
      .cookie('token', token, getCookieOptions())
      .json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    // Attach token as an httpOnly cookie
    res.status(200)
      .cookie('token', token, getCookieOptions())
      .json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW: Logout function to clear the cookie
exports.logout = async (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // Expires immediately
      httpOnly: true
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.profileImage = req.file.path;
    }
    delete updates.password;
    delete updates.role;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();
    res.json({ success: true, message: 'Password reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ==========================================
// ADMIN: CLIENT MANAGEMENT FUNCTIONS
// ==========================================

// 1. Get specific user details along with their bookings
exports.getUserDetailsForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch user's bookings
    const bookings = await Booking.find({ userId: req.params.id }).sort({ createdAt: -1 });
    
    // Agar tests ka feature chal raha hai toh ye line use karein:
    // const tests = await Test.find({ userId: req.params.id });

    res.json({
      user,
      bookings,
      tests: [], // Abhi ke liye empty bhej rahe hain
      resources: user.resources || []
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Save/Update Counselor Notes
exports.updateCounselorNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    await User.findByIdAndUpdate(req.params.id, { counselorNotes: notes });
    res.json({ message: 'Notes saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save notes' });
  }
};

// 3. Add Individual Resource
exports.addClientResource = async (req, res) => {
  try {
    const { title, link, description } = req.body;
    const user = await User.findById(req.params.id);
    
    user.resources.push({ title, link, description });
    await user.save();
    
    res.json({ message: 'Resource assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign resource' });
  }
};

// 4. Delete Individual Resource
exports.deleteClientResource = async (req, res) => {
  try {
    const { id, resourceId } = req.params;
    const user = await User.findById(id);
    
    user.resources = user.resources.filter(r => r._id.toString() !== resourceId);
    await user.save();
    
    res.json({ message: 'Resource removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove resource' });
  }
};

// 5. Delete Client Completely
exports.deleteClient = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Optional: Delete their bookings too
    // await Booking.deleteMany({ userId: req.params.id });
    res.json({ message: 'Client deleted permanently' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete client' });
  }
};