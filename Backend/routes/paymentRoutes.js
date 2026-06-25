const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Installment = require('../models/Installment');
const Student = require('../models/Student');
const Receipt = require('../models/Receipt');
const Settings = require('../models/Settings');
const { authenticate, checkBranchAccess } = require('../middleware/authMiddleware');

router.use(authenticate, checkBranchAccess);

// Generate unique receipt number
const generateReceiptNumber = async () => {
  const settings = await Settings.findOne() || { receiptPrefix: 'FM-2026-' };
  const count = await Receipt.countDocuments();
  const nextNum = (count + 1).toString().padStart(6, '0');
  return `${settings.receiptPrefix}${nextNum}`;
};

// @route   POST /api/admin/payments/collect
// @desc    Collect a fee payment
router.post('/collect', async (req, res) => {
  try {
    const { studentId, amount, paymentMode, paymentDate, referenceNumber, remarks, receivedBy } = req.body;

    if (!studentId || !amount || !paymentMode) {
      return res.status(400).json({ success: false, message: 'Please provide required fields' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (amount > student.pendingFee) {
      return res.status(400).json({ success: false, message: 'Cannot collect more than pending amount' });
    }

    // 1. Generate Receipt Number
    const receiptNumber = await generateReceiptNumber();

    // 2. Create Payment Record
    const payment = new Payment({
      branchId: student.branchId,
      studentId,
      receiptNumber,
      paymentDate: paymentDate || new Date(),
      paymentMode,
      amount,
      referenceNumber,
      remarks,
      receivedBy
    });
    await payment.save();

    // 3. Create Receipt Record
    const receipt = new Receipt({
      branchId: student.branchId,
      studentId,
      paymentId: payment._id,
      receiptNumber
    });
    await receipt.save();

    // 4. Update Student Balances
    student.paidFee += Number(amount);
    student.pendingFee -= Number(amount);
    
    if (student.pendingFee <= 0) {
      student.feeStatus = 'Completed';
    } else if (student.paidFee > 0) {
      student.feeStatus = 'Partially Paid';
    }
    student.lastPaymentDate = payment.paymentDate;

    // 5. Update Installment Statuses
    // Fetch pending or partially paid installments, sorted by due date
    let installments = await Installment.find({ 
      studentId, 
      status: { $ne: 'Paid' } 
    }).sort({ dueDate: 1 });

    let remainingToAllocate = Number(amount);

    for (let inst of installments) {
      if (remainingToAllocate <= 0) break;

      const currentPendingForInst = inst.amount - inst.paidAmount;
      
      if (remainingToAllocate >= currentPendingForInst) {
        // Fully pay this installment
        inst.paidAmount += currentPendingForInst;
        inst.status = 'Paid';
        inst.paidDate = payment.paymentDate;
        remainingToAllocate -= currentPendingForInst;
      } else {
        // Partially pay this installment
        inst.paidAmount += remainingToAllocate;
        inst.status = 'Partially Paid';
        remainingToAllocate = 0;
      }
      await inst.save();
    }

    // 6. Calculate Next Due Date
    const nextInstallment = await Installment.findOne({ 
      studentId, 
      status: { $ne: 'Paid' } 
    }).sort({ dueDate: 1 });
    
    student.nextDueDate = nextInstallment ? nextInstallment.dueDate : null;
    await student.save();

    res.status(201).json({
      success: true,
      message: 'Payment collected successfully',
      payment,
      receipt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/payments/history/:studentId
// @desc    Get payment history for a student
router.get('/history/:studentId', async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/payments/receipt/:paymentId
// @desc    Get receipt data for a payment
router.get('/receipt/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate('studentId');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    const receipt = await Receipt.findOne({ paymentId: req.params.paymentId });
    const settings = await Settings.findOne() || {};

    res.json({
      success: true,
      payment,
      receipt,
      settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
