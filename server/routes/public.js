const express = require('express');
const router = express.Router();
const Tip = require('../models/Tips'); // Adjusted path assuming models are in ../models/
const Setting = require('../models/Settings'); // Adjusted path

// GET /api/tips/email - Fetch published email tips
router.get('/tips/email', async (req, res) => {
  try {
    const emailTips = await Tip.find({ category: 'email', status: 'published' })
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(emailTips);
  } catch (error) {
    console.error('Error fetching email tips:', error);
    res.status(500).json({ message: 'Error fetching email tips. Please try again later.' });
  }
});

// GET /api/tips/sop - Fetch published SOP tips
router.get('/tips/sop', async (req, res) => {
  try {
    const sopTips = await Tip.find({ category: 'sop', status: 'published' })
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(sopTips);
  } catch (error) {
    console.error('Error fetching SOP tips:', error);
    res.status(500).json({ message: 'Error fetching SOP tips. Please try again later.' });
  }
});

// GET /api/settings/public - Fetch specific public settings
router.get('/settings/public', async (req, res) => {
  try {
    const publicSettingKeys = ['about_us_content', 'public_website_description', 'admin_bio']; // Added admin_bio as per previous HTML
    const settingsArray = await Setting.find({ key: { $in: publicSettingKeys } });

    const settingsMap = settingsArray.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    // Ensure all requested keys have at least a default value if not found
    publicSettingKeys.forEach(key => {
        if (!settingsMap.hasOwnProperty(key)) {
            settingsMap[key] = ''; // Default to empty string if not found
        }
    });

    res.json(settingsMap);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Error fetching public settings. Please try again later.' });
  }
});

module.exports = router;
