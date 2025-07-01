const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  status: {
    type: String,
    default: 'active', // 'active' or 'blocked'
    enum: ['active', 'blocked']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// ✅ THIS MUST BE PRESENT!
module.exports = mongoose.model('User', userSchema);
