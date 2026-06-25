const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  name: {
    type: String,
    required: true,
  },
  fatherName: { type: String },
  dob: { type: String },
  gender: { type: String },
  course: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
  },
  modeOfTraining: { type: String },
  preferredBatchTime: { type: String },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  aadharNumber: { type: String },
  panNumber: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  educationDetails: [
    {
      qualification: { type: String },
      board: { type: String },
      year: { type: String },
      percentage: { type: String },
    }
  ],
  workExperience: {
    isWorking: { type: Boolean, default: false },
    companyName: { type: String },
    designation: { type: String },
    experienceYears: { type: String },
  },
  documents: {
    aadharCopy: { type: Boolean, default: false },
    panCopy: { type: Boolean, default: false },
    photos: { type: Boolean, default: false },
    marksheet10: { type: Boolean, default: false },
    marksheet12: { type: Boolean, default: false },
    marksheetUG: { type: Boolean, default: false },
    marksheetPG: { type: Boolean, default: false },
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  totalFee: { type: Number, default: 0 },
  paidFee: { type: Number, default: 0 },
  pendingFee: { type: Number, default: 0 },
  feeStatus: { type: String, enum: ['Pending', 'Partially Paid', 'Completed'], default: 'Pending' },
  nextDueDate: { type: Date },
  lastPaymentDate: { type: Date },
  installmentPlan: {
    planType: { type: String, enum: ['One Time', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'Custom'], default: 'One Time' },
    installments: [
      {
        amount: Number,
        dueDate: Date
      }
    ]
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
