const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { authenticate, checkBranchAccess } = require('../middleware/authMiddleware');

router.use(authenticate, checkBranchAccess);

// @route   GET /api/admin/settings
// @desc    Get institute settings
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.branchId) filter.branchId = req.query.branchId;

    let settings = await Settings.findOne(filter);
    if (!settings) {
      settings = new Settings(filter);
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update institute settings
router.put('/', async (req, res) => {
  try {
    const filter = {};
    if (req.body.branchId) filter.branchId = req.body.branchId;

    let settings = await Settings.findOne(filter);
    if (!settings) {
      settings = new Settings(filter);
    }

    const {
      instituteName,
      instituteAddress,
      phone,
      email,
      gstNumber,
      receiptPrefix,
      footerMessage,
      authorizedSignature
    } = req.body;

    if (instituteName) settings.instituteName = instituteName;
    if (instituteAddress) settings.instituteAddress = instituteAddress;
    if (phone) settings.phone = phone;
    if (email) settings.email = email;
    if (gstNumber) settings.gstNumber = gstNumber;
    if (receiptPrefix) settings.receiptPrefix = receiptPrefix;
    if (footerMessage) settings.footerMessage = footerMessage;
    if (authorizedSignature) settings.authorizedSignature = authorizedSignature;

    await settings.save();

    res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
