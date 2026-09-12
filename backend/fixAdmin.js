const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

const fixAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    const User = mongoose.model('User', new mongoose.Schema({
      fullName: String,
      email: String,
      password: String,
      phone: String,
      role: String,
      isVerified: Boolean
    }));

    // Update admin to be verified
    const result = await User.updateOne(
      { email: 'admin@wakeupcounseling.com' },
      { 
        $set: { 
          isVerified: true,
          role: 'admin'
        } 
      },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin123@#$', salt);
      
      await User.create({
        fullName: 'Admin Counselor',
        email: 'admin@wakeupcounseling.com',
        password: hashedPassword,
        phone: '+919876543210',
        role: 'admin',
        isVerified: true
      });
      
      console.log('✅ New admin user created!');
    } else {
      console.log('✅ Admin user updated successfully!');
    }

    console.log('\n🔐 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    admin@wakeupcounseling.com');
    console.log('Password: Admin123@#$');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ Login at: http://localhost:5173/login\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixAdmin();
