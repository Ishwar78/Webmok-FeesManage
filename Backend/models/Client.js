const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  clientName: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
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
    default: 'Pending',
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
