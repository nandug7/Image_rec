const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  fileType: String,
  fileData: Buffer,
  extractedText: String,
  totalAmount: Number,   // ✅ New field
  category: String,      // ✅ New field
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Bill', billSchema);
