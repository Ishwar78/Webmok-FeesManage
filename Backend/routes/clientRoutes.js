const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const ClientPayment = require('../models/ClientPayment');
const ClientReceipt = require('../models/ClientReceipt');
const Settings = require('../models/Settings');
const { authenticate, checkBranchAccess } = require('../middleware/authMiddleware');

router.use(authenticate, checkBranchAccess);

// Generate unique receipt number for client
const generateClientReceiptNumber = async () => {
  const settings = await Settings.findOne() || { receiptPrefix: 'FM-2026-' };
  const count = await ClientReceipt.countDocuments();
  const nextNum = (count + 1).toString().padStart(6, '0');
  return `C${settings.receiptPrefix}${nextNum}`; // Prefix 'C' for client receipts
};

// @route   POST /api/admin/clients
// @desc    Add a new client
router.post('/', async (req, res) => {
  try {
    const { clientName, projectName, projectType, amount, paidAmount, contactEmail, contactPhone } = req.body;

    // Validate
    if (!clientName || !projectName || !projectType || !amount) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Determine status
    let status = 'Pending';
    const paid = Number(paidAmount) || 0;
    const total = Number(amount) || 0;
    if (paid >= total && total > 0) {
      status = 'Paid';
    } else if (paid > 0) {
      status = 'Partially Paid';
    }

    // Create Client
    const client = new Client({
      branchId: req.body.branchId || null,
      clientName,
      projectName,
      projectType,
      amount: total,
      paidAmount: paid,
      status,
      contactEmail,
      contactPhone
    });

    await client.save();

    let payment = null;
    let receipt = null;

    if (paid > 0) {
      const receiptNumber = await generateClientReceiptNumber();
      payment = new ClientPayment({
        branchId: req.body.branchId || null,
        clientId: client._id,
        receiptNumber,
        paymentDate: new Date(),
        paymentMode: 'Cash', // Default to cash for initial creation, could be sent from frontend later
        amount: paid,
        remarks: 'Initial payment at time of registration'
      });
      await payment.save();

      receipt = new ClientReceipt({
        branchId: req.body.branchId || null,
        clientId: client._id,
        paymentId: payment._id,
        receiptNumber
      });
      await receipt.save();
    }

    res.status(201).json({
      success: true,
      message: 'Client added successfully',
      client,
      payment,
      receipt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/clients
// @desc    Get all clients
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.branchId) filter.branchId = req.query.branchId;
    const clients = await Client.find(filter).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});



// @route   POST /api/admin/clients/collect
// @desc    Collect a client payment
router.post('/collect', async (req, res) => {
  try {
    const { clientId, amount, paymentMode, paymentDate, referenceNumber, remarks } = req.body;

    if (!clientId || !amount || !paymentMode) {
      return res.status(400).json({ success: false, message: 'Please provide required fields' });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const pending = client.amount - client.paidAmount;
    if (amount > pending) {
      return res.status(400).json({ success: false, message: 'Cannot collect more than pending amount' });
    }

    // Generate Receipt Number
    const receiptNumber = await generateClientReceiptNumber();

    // Create Payment Record
    const payment = new ClientPayment({
      branchId: client.branchId,
      clientId,
      receiptNumber,
      paymentDate: paymentDate || new Date(),
      paymentMode,
      amount,
      referenceNumber,
      remarks,
      receivedBy: 'Admin'
    });
    await payment.save();

    // Create Receipt Record
    const receipt = new ClientReceipt({
      branchId: client.branchId,
      clientId,
      paymentId: payment._id,
      receiptNumber
    });
    await receipt.save();

    // Update Client Balances
    client.paidAmount += Number(amount);
    
    if (client.paidAmount >= client.amount && client.amount > 0) {
      client.status = 'Completed';
    } else if (client.paidAmount > 0) {
      client.status = 'Partially Paid';
    }

    await client.save();

    res.status(201).json({
      success: true,
      message: 'Payment collected successfully',
      payment,
      receipt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/clients/history/:clientId
// @desc    Get payment history for a client
router.get('/history/:clientId', async (req, res) => {
  try {
    const payments = await ClientPayment.find({ clientId: req.params.clientId }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/clients/receipt/:paymentId
// @desc    Get receipt data for a client payment
router.get('/receipt/:paymentId', async (req, res) => {
  try {
    const payment = await ClientPayment.findById(req.params.paymentId).populate('clientId');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    const receipt = await ClientReceipt.findOne({ paymentId: req.params.paymentId });
    const settings = await Settings.findOne() || {};

    res.json({
      success: true,
      payment,
      receipt,
      settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
