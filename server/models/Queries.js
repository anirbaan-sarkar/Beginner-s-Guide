const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // Basic email validation, can be enhanced
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  question: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending', // e.g., 'pending', 'resolved'
    enum: ['pending', 'resolved'],
  },
  resolvedAt: {
    type: Date,
  },
  adminNotes: {
    type: String,
  },
}, {
  timestamps: { createdAt: 'submittedAt', updatedAt: true }, // submittedAt will be auto-managed, also track updatedAt
});

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
