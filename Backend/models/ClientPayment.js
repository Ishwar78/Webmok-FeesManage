const mongoose = require('mongoose');

const clientPaymentSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
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
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  referenceNumber: {
    type: String,
  },
  remarks: {
    type: String,
  },
  receivedBy: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('ClientPayment', clientPaymentSchema);
