const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  branchCode: {
    type: String,
    required: true,
    unique: true,
  },
  instituteName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  phone: { type: String },
  email: { type: String },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
