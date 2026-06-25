const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Fee = require('../models/Fee');

// @route   POST /api/admin/students
// @desc    Add a new student and initial fee record
router.post('/', async (req, res) => {
  try {
    const { name, course, branch, email, phone, feeAmount, paidAmount } = req.body;

    // Validate
    if (!name || !course || !email || !feeAmount) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if student exists
    let existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this email already exists' });
    }

    // Create Student
    const student = new Student({
      name,
      course,
      branch,
      email,
      phone
    });

    await student.save();

    // Determine status
    let status = 'Pending';
    const paid = Number(paidAmount) || 0;
    const total = Number(feeAmount) || 0;
    if (paid >= total && total > 0) {
      status = 'Paid';
    } else if (paid > 0) {
      status = 'Partially Paid';
    }

    // Create Fee Record
    const fee = new Fee({
      student: student._id,
      amount: total,
      paidAmount: paid,
      status: status
    });

    await fee.save();

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      student,
      fee
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/students
// @desc    Get all students with their fee records
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    
    // Map students with their fee status
    const studentsWithFees = await Promise.all(students.map(async (student) => {
      const fee = await Fee.findOne({ student: student._id });
      return {
        _id: student._id,
        name: student.name,
        course: student.course,
        branch: student.branch,
        email: student.email,
        phone: student.phone,
        enrollmentDate: student.enrollmentDate,
        feeAmount: fee ? fee.amount : 0,
        paidAmount: fee ? fee.paidAmount : 0,
        status: fee ? fee.status : 'Pending'
      };
    }));

    res.json(studentsWithFees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
