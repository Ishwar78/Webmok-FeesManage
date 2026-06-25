const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  installmentNumber: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Partially Paid'],
    default: 'Pending',
  },
  paidDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Installment', installmentSchema);
