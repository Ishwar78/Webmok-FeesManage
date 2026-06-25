const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// @route   POST /api/admin/login
// @desc    Admin Login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("Login attempt received:", { email, password });
    email = email?.toLowerCase().trim();
    password = password?.trim();

    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("Login failed: Admin not found for email:", email);
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log("Login failed: Password mismatch for email:", email);
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      email: admin.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
