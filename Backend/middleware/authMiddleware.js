const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Verify JWT and inject user into req
exports.authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await Admin.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    
    // Deactivated user check
    if (req.user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Account is inactive. Contact Super Admin.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Auto inject branchId for Branch Admins
exports.checkBranchAccess = (req, res, next) => {
  if (req.user.role === 'Branch Admin') {
    // If accessing a specific resource, it should ideally check if that resource belongs to branchId.
    // For lists, we automatically inject branchId into query.
    if (req.method === 'GET') {
      req.query.branchId = req.user.branchId;
    } else if (req.method === 'POST' || req.method === 'PUT') {
      req.body.branchId = req.user.branchId;
    }
  }
  next();
};
