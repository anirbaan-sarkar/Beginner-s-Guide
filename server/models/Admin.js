const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // Intend to use bcrypt for password hashing

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }, // Only manage createdAt automatically
});

// Pre-save hook to hash password before saving (example, actual hashing to be implemented later)
// adminSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
