require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    // Check if admin already exists
    let admin = await User.findOne({ email: 'admin@wakeupcounseling.com' });

    if (admin) {
      console.log('Admin user already exists. Updating...');
      // Update existing admin to be verified
      admin.isVerified = true;
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('Creating new admin user...');
      // Create new admin
      admin = await User.create({
        fullName: 'Admin Counselor',
        email: 'admin@wakeupcounseling.com',
        password: 'Admin123@#$',
        phone: '+919876543210',
        role: 'admin',
        isVerified: true  // ✅ This is the key fix
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n🔐 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    admin@wakeupcounseling.com');
    console.log('Password: Admin123@#$');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ You can now login at: http://localhost:5173/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
