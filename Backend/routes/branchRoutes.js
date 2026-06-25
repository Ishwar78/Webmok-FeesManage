const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const Admin = require('../models/Admin');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// All routes require Super Admin
router.use(authenticate, authorize('Super Admin'));

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find().populate('createdBy', 'name email');
    res.json(branches);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create Branch
router.post('/', async (req, res) => {
  try {
    const branch = await Branch.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, branch });
  } catch (err) {
    console.error("Create branch error:", err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// Update Branch
router.put('/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, branch });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete Branch
router.delete('/:id', async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Branch deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get branch admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find({ role: 'Branch Admin' }).populate('branchId', 'branchName');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create Branch Admin
router.post('/admins', async (req, res) => {
  try {
    const { name, email, mobile, password, branchId, status } = req.body;
    
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    admin = new Admin({
      name, email, mobile, password, branchId, status, role: 'Branch Admin'
    });

    await admin.save();
    res.status(201).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Update Branch Admin
router.put('/admins/:id', async (req, res) => {
  try {
    const { name, mobile, branchId, status, password } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    admin.name = name || admin.name;
    admin.mobile = mobile || admin.mobile;
    admin.branchId = branchId || admin.branchId;
    admin.status = status || admin.status;
    
    if (password) {
      admin.password = password; // Will be hashed in pre-save hook
    }

    await admin.save();
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete Branch Admin
router.delete('/admins/:id', async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
