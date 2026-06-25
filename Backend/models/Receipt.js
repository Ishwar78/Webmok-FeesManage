const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
  pdfUrl: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
