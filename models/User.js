const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'gameController'], // Combined enum values
    required: true,
    default: 'gameController' // Default role set to 'controller'
  },
  image: {
    type: String, // Store the file path or URL
    default: null
  },
  location: {
    type: String,
    default: ''
  },
  restaurantName: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
