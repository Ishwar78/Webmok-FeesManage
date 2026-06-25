const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: { type: String },
  mobile: { type: String },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Branch Admin'], 
    default: 'Super Admin' 
  },
  branchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },
  profilePhoto: { type: String },
  lastLogin: { type: Date }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
