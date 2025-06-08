const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const uniqueUserId = uuidv4();
console.log("unique code is"+uniqueUserId); 

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
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
