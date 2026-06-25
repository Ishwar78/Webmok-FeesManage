const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Partially Paid'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
  },
  paymentDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
