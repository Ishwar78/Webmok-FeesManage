const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate, authorize('Super Admin'));

router.get('/', async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .populate('branch', 'branchName')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
