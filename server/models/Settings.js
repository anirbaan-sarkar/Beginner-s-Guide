const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true, // e.g., 'about_us_content', 'contact_email', 'maintenance_mode'
  },
  value: {
    type: String, // Can store various types of settings, e.g., text, JSON stringified, boolean as string
    required: true,
  },
  description: { // Optional field to describe what the setting is for
    type: String,
  }
}, {
  timestamps: { createdAt: false, updatedAt: 'updatedAt' }, // Automatically manage updatedAt
});

const Setting = mongoose.model('Setting', settingsSchema);

module.exports = Setting;
