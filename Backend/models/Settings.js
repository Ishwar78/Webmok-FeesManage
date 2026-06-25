const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  instituteName: { type: String, default: 'Webmok Institute' },
  instituteLogo: { type: String, default: '' },
  instituteAddress: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  receiptPrefix: { type: String, default: 'FM-2026-' },
  currency: { type: String, default: 'INR' },
  authorizedSignature: { type: String, default: '' },
  footerMessage: { type: String, default: 'Thank you for your payment.' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
