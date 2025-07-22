// scripts/createAdmin.js
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    console.log('🔍 Checking for existing admin user...');

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists. Username:', existingAdmin.username);
      return existingAdmin;
    }

    console.log('📝 Creating new admin user...');

    const adminUser = new User({
      username: 'admin', // Admin username
      password: 'admin123', // Admin password (will be hashed)
      role: 'admin', // Set role to admin
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin');

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);

    // If it's a duplicate key error, the user might already exist
    if (error.code === 11000) {
      console.log('ℹ️  Admin user might already exist (duplicate key error)');
      try {
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
          console.log('✅ Found existing admin user');
          return existingAdmin;
        }
      } catch (findError) {
        console.error('❌ Error finding existing admin:', findError.message);
      }
    }

    throw error;
  }
};

module.exports = { createAdminUser };
