const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticate, checkBranchAccess } = require('../middleware/authMiddleware');

router.use(authenticate, checkBranchAccess);

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics
router.get('/dashboard-stats', async (req, res) => {
  try {
    const filter = {};
    if (req.query.branchId) filter.branchId = req.query.branchId;

    const totalStudents = await Student.countDocuments(filter);
    
    const students = await Student.find(filter);
    let totalFees = 0;
    let collectedFees = 0;
    let pendingFees = 0;

    students.forEach(student => {
      totalFees += student.totalFee || 0;
      collectedFees += student.paidFee || 0;
      pendingFees += student.pendingFee || 0;
    });

    // If database is empty, return dummy values for demonstration
    if (totalStudents === 0) {
      return res.json({
        totalStudents: 250,
        totalFees: 500000,
        collectedFees: 350000,
        pendingFees: 150000
      });
    }

    res.json({
      totalStudents,
      totalFees,
      collectedFees,
      pendingFees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/recent-students
// @desc    Get recent students with fee status
router.get('/recent-students', async (req, res) => {
  try {
    const filter = {};
    if (req.query.branchId) filter.branchId = req.query.branchId;
    const students = await Student.find(filter).sort({ createdAt: -1 }).limit(5);
    
    // If no students, return dummy data
    if (students.length === 0) {
      return res.json([
        { _id: '1', name: 'Rahul Sharma', course: 'MCA', feeAmount: 50000, status: 'Paid' },
        { _id: '2', name: 'Amit Kumar', course: 'BCA', feeAmount: 40000, status: 'Pending' },
        { _id: '3', name: 'Priya', course: 'B.Tech', feeAmount: 60000, status: 'Paid' },
      ]);
    }

    // Map students with their fee status
    const recentStudents = students.map((student) => {
      return {
        _id: student._id,
        name: student.name,
        course: student.course,
        feeAmount: student.totalFee || 0,
        status: student.feeStatus || 'Pending'
      };
    });

    res.json(recentStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
