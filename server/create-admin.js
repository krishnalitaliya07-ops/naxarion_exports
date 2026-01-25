const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    await connectDB();

    const adminUsers = [
      {
        name: 'Admin User',
        email: 'jsheta15@gmail.com',
        password: '12345678',
        phone: '+1234567890',
        company: 'Nexarion Global Exports',
        country: 'United States'
      },
      {
        name: 'Nexarion Admin',
        email: 'nexarionglobalexports@gmail.com',
        password: '12345678',
        phone: '+1234567890',
        company: 'Nexarion Global Exports',
        country: 'United States'
      }
    ];

    console.log('\n🔐 ===== CREATING ADMIN USERS =====\n');

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin user already exists: ${adminData.email}`);
        
        // Update to admin if not already
        if (existingAdmin.role !== 'admin') {
          existingAdmin.role = 'admin';
          existingAdmin.isActive = true;
          existingAdmin.isVerified = true;
          existingAdmin.isEmailVerified = true;
          await existingAdmin.save();
          console.log('✅ User updated to admin role\n');
        } else {
          console.log('✅ Already has admin role\n');
        }
      } else {
        // Create new admin user
        const admin = await User.create({
          ...adminData,
          role: 'admin',
          isActive: true,
          isVerified: true,
          isEmailVerified: true,
          authProvider: 'local'
        });

        console.log('🎉 Admin user created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: 12345678');
        console.log('👤 Name:', admin.name);
        console.log('🛡️  Role:', admin.role);
        console.log('');
      }
    }

    console.log('==========================================');
    console.log('✅ All admin users processed!');
    console.log('==========================================');
    console.log('\n⚠️  IMPORTANT: Please change passwords after first login!');
    console.log('\n🔐 Admin Login URL: http://localhost:3001/admin/login');
    console.log('\nAdmin Credentials:');
    console.log('1. jsheta15@gmail.com / 12345678');
    console.log('2. nexarionglobalexports@gmail.com / 12345678');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();
