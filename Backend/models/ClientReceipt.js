const mongoose = require('mongoose');

const clientReceiptSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientPayment',
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ClientReceipt', clientReceiptSchema);
