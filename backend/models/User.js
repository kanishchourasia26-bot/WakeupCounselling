const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
  dateOfBirth: { type: Date },
  address: { type: String, default: '' },
  occupation: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  isActive: { type: Boolean, default: true },

  // 👇 EMAIL OTP VERIFICATION FIELDS 👇
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },
  // 👆 ------------------------------- 👆

  // 👇 Admin Client Management Fields 👇
  counselorNotes: { 
    type: String, 
    default: '' 
  },
  resources: [{
    title: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String, default: '' },
    assignedAt: { type: Date, default: Date.now }
  }]
  // 👆 -------------------------------- 👆

}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  // Security ke liye OTP fields ko bhi API response se hide kar diya
  delete obj.otp;
  delete obj.otpExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);