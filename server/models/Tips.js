const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true, // e.g., 'email', 'sop'
  },
  subcategory: {
    type: String,
  },
  status: {
    type: String,
    default: 'draft', // e.g., 'draft', 'published'
    enum: ['draft', 'published'],
  },
  author: {
    type: String, // admin identifier or could be mongoose.Schema.Types.ObjectId if linking to Admin collection
    required: true,
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
});

const Tip = mongoose.model('Tip', tipSchema);

module.exports = Tip;
