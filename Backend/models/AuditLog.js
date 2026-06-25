const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch' // Can be null for Super Admin actions that are global
  },
  action: {
    type: String,
    required: true
  },
  ip: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
