const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Installment = require('../models/Installment');
const { authenticate, checkBranchAccess } = require('../middleware/authMiddleware');

router.use(authenticate, checkBranchAccess);

// @route   POST /api/admin/students
// @desc    Add a new student and initial fee record
router.post('/', async (req, res) => {
  try {
    const { 
      name, course, branch, email, phone, feeAmount, paidAmount,
      fatherName, dob, gender, aadharNumber, panNumber,
      address, modeOfTraining, preferredBatchTime, educationDetails,
      workExperience, documents,
      installmentPlan
    } = req.body;

    // Validate
    if (!name || !course || !email || !feeAmount) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if student exists
    let existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this email already exists' });
    }

    // Determine status
    let status = 'Pending';
    const paid = Number(paidAmount) || 0;
    const total = Number(feeAmount) || 0;
    const pending = total - paid;
    if (paid >= total && total > 0) {
      status = 'Completed';
    } else if (paid > 0) {
      status = 'Partially Paid';
    }

    // Default Installment Plan if not provided
    const plan = installmentPlan || {
      planType: 'One Time',
      installments: [{ amount: total, dueDate: new Date() }]
    };

    // Calculate next due date
    let nextDueDate = null;
    if (plan.installments && plan.installments.length > 0) {
      // Find the first installment due date that is in the future or the earliest one
      const sorted = [...plan.installments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      nextDueDate = sorted[0].dueDate;
    }

    // Create Student
    const student = new Student({
      branchId: req.body.branchId || null,
      name, course, branch, email, phone, fatherName, dob, gender,
      aadharNumber, panNumber, address, modeOfTraining, preferredBatchTime,
      educationDetails, workExperience, documents,
      totalFee: total,
      paidFee: paid,
      pendingFee: pending,
      feeStatus: status,
      nextDueDate: nextDueDate,
      installmentPlan: plan
    });

    await student.save();

    // Create Installments
    if (plan.installments && plan.installments.length > 0) {
      const installmentDocs = plan.installments.map((inst, index) => ({
        studentId: student._id,
        installmentNumber: index + 1,
        amount: inst.amount,
        dueDate: inst.dueDate,
        paidAmount: 0,
        status: 'Pending'
      }));
      await Installment.insertMany(installmentDocs);
    }

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
    const filter = {};
    if (req.query.branchId) filter.branchId = req.query.branchId;
    const students = await Student.find(filter).sort({ createdAt: -1 });
    
    // Map students with their fee status directly from the new Student fields
    // and also fetch installments if needed (for now, returning from student model)
    const studentsWithFees = students.map((student) => {
      return {
        ...student.toObject(),
        feeAmount: student.totalFee,
        paidAmount: student.paidFee,
        status: student.feeStatus
      };
    });

    res.json(studentsWithFees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
