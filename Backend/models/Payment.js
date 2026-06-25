const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank', 'Card', 'Cheque'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  referenceNumber: {
    type: String, // For UPI transaction ID, Cheque number, etc.
  },
  remarks: {
    type: String,
  },
  receivedBy: {
    type: String, // E.g., 'Admin' or the logged-in user name
    default: 'Admin',
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
