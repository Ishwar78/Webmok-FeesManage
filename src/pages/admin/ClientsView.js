import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './ClientsView.css';

function ClientsView({ branchId }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Payment State
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    remarks: ''
  });

  // History & Receipt State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  const initialFormState = {
    clientName: '',
    projectName: '',
    projectType: 'Website',
    amount: '',
    paidAmount: '',
    contactEmail: '',
    contactPhone: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchClients();
  }, [branchId]);

  const fetchClients = async () => {
    try {
      const url = branchId ? `/api/admin/clients?branchId=${branchId}` : '/api/admin/clients';
      const res = await API.get(url);
      setClients(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (branchId) payload.branchId = branchId;
      const res = await API.post('/api/admin/clients', payload);
      if (res.data.success) {
        alert('Client added successfully!');
        setShowModal(false);
        setFormData(initialFormState);
        fetchClients();
        if (res.data.payment) {
          handleViewReceipt(res.data.payment._id);
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add client');
    }
  };

  const handleCollectClick = (client) => {
    setSelectedClient(client);
    setPaymentData({
      amount: '',
      paymentMode: 'Cash',
      paymentDate: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      remarks: ''
    });
    setShowCollectModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        clientId: selectedClient._id,
        amount: paymentData.amount,
        paymentMode: paymentData.paymentMode,
        paymentDate: paymentData.paymentDate,
        referenceNumber: paymentData.referenceNumber,
        remarks: paymentData.remarks
      };
      const res = await API.post('/api/admin/clients/collect', payload);
      if (res.data.success) {
        alert('Payment collected successfully! Receipt generated.');
        setShowCollectModal(false);
        fetchClients();
        handleViewReceipt(res.data.payment._id);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to collect payment');
    }
  };

  const handleViewHistory = async (client) => {
    setSelectedClient(client);
    try {
      const res = await API.get(`/api/admin/clients/history/${client._id}`);
      setPaymentHistory(res.data);
      setShowHistoryModal(true);
    } catch (error) {
      alert('Failed to fetch payment history');
    }
  };

  const handleViewReceipt = async (paymentId) => {
    try {
      const res = await API.get(`/api/admin/clients/receipt/${paymentId}`);
      if (res.data.success) {
        setReceiptData(res.data);
        setShowReceiptModal(true);
      }
    } catch (error) {
      alert('Failed to fetch receipt');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const filteredClients = clients.filter(client => 
    client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.projectType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2>Manage Clients</h2>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccc', minWidth: '250px' }}
          />
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Client</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
            <h3 style={{ borderBottom: '2px solid #0b4f6c', paddingBottom: '10px', marginBottom: '20px', color: '#0b4f6c' }}>ADD NEW CLIENT</h3>
            
            <form onSubmit={handleSubmit} className="client-form">
              <div className="input-group">
                <label>Client Name *</label>
                <input type="text" name="clientName" required value={formData.clientName} onChange={handleInputChange} />
              </div>
              
              <div className="input-group">
                <label>Project Name *</label>
                <input type="text" name="projectName" required value={formData.projectName} onChange={handleInputChange} />
              </div>

              <div className="input-group">
                <label>Project Type *</label>
                <select name="projectType" value={formData.projectType} onChange={handleInputChange}>
                  <option value="Website">Website</option>
                  <option value="Marketing">Marketing</option>
                  <option value="App Development">App Development</option>
                  <option value="SEO">SEO</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} />
              </div>

              <div className="input-group">
                <label>Contact Phone</label>
                <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} />
              </div>

              <div className="input-group">
                <label>Total Amount (₹) *</label>
                <input type="number" name="amount" required value={formData.amount} onChange={handleInputChange} />
              </div>

              <div className="input-group">
                <label>Paid Amount (₹)</label>
                <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} />
              </div>
              
              <div className="submit-area">
                <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: '15px' }}>Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-box">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Project</th>
                <th>Type</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: "center"}}>Loading...</td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const balance = (client.amount || 0) - (client.paidAmount || 0);
                  
                  return (
                    <tr key={client._id}>
                      <td>
                        <div style={{fontWeight: 'bold'}}>{client.clientName}</div>
                        <div style={{fontSize: '12px', color: '#666'}}>{client.contactPhone || client.contactEmail || 'No contact info'}</div>
                      </td>
                      <td>{client.projectName}</td>
                      <td>{client.projectType}</td>
                      <td>₹{(client.amount || 0).toLocaleString('en-IN')}</td>
                      <td style={{color: '#7AC943'}}>₹{(client.paidAmount || 0).toLocaleString('en-IN')}</td>
                      <td style={{color: balance > 0 ? '#ef4444' : '#64748b'}}>₹{balance > 0 ? balance.toLocaleString('en-IN') : 0}</td>
                      <td>
                        <span className={
                          client.status === 'Completed' || client.status === 'Paid' ? 'paid' : 
                          client.status === 'Partially Paid' ? 'partially-paid' : 'pending'
                        }>
                          {client.status === 'Paid' ? 'Completed' : client.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => handleCollectClick(client)} style={{ padding: '5px 8px', backgroundColor: '#7AC943', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Collect Payment</button>
                          <button onClick={() => handleViewHistory(client)} style={{ padding: '5px 8px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>History</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{textAlign: "center"}}>No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {showCollectModal && selectedClient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowCollectModal(false)}>&times;</span>
            <h3 style={{ borderBottom: '2px solid #0b4f6c', paddingBottom: '10px', marginBottom: '20px', color: '#0b4f6c' }}>COLLECT CLIENT PAYMENT</h3>
            
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '5px', fontSize: '14px' }}>
              <p><strong>Client:</strong> {selectedClient.clientName} - {selectedClient.projectName}</p>
              <p><strong>Pending Amount:</strong> ₹{Math.max(0, (selectedClient.amount || 0) - (selectedClient.paidAmount || 0)).toLocaleString('en-IN')}</p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="client-form">
              <div className="input-group">
                <label>Payment Date *</label>
                <input type="date" required value={paymentData.paymentDate} onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})} />
              </div>

              <div className="input-group">
                <label>Amount Paid (₹) *</label>
                <input type="number" required max={Math.max(0, (selectedClient.amount || 0) - (selectedClient.paidAmount || 0))} value={paymentData.amount} onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})} />
              </div>

              <div className="input-group">
                <label>Payment Mode *</label>
                <select required value={paymentData.paymentMode} onChange={(e) => setPaymentData({...paymentData, paymentMode: e.target.value})}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {(paymentData.paymentMode !== 'Cash') && (
                <div className="input-group">
                  <label>Reference Number</label>
                  <input type="text" placeholder="Transaction ID, Cheque No, etc." value={paymentData.referenceNumber} onChange={(e) => setPaymentData({...paymentData, referenceNumber: e.target.value})} />
                </div>
              )}

              <div className="input-group">
                <label>Remarks</label>
                <input type="text" value={paymentData.remarks} onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})} />
              </div>

              <div className="submit-area" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" className="submit-btn" style={{ flex: 1, backgroundColor: '#7AC943' }}>Collect Payment</button>
                <button type="button" className="submit-btn" onClick={() => setShowCollectModal(false)} style={{ flex: 1, backgroundColor: '#94a3b8' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showHistoryModal && selectedClient && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <span className="close-btn" onClick={() => setShowHistoryModal(false)}>&times;</span>
            <h3 style={{ borderBottom: '2px solid #0b4f6c', paddingBottom: '10px', marginBottom: '20px', color: '#0b4f6c' }}>CLIENT PAYMENT HISTORY</h3>
            
            <h4 style={{ marginBottom: '15px' }}>{selectedClient.clientName} ({selectedClient.projectName})</h4>

            <table className="edu-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Receipt No</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Ref/Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.length > 0 ? paymentHistory.map(payment => (
                  <tr key={payment._id}>
                    <td>{new Date(payment.paymentDate).toLocaleDateString('en-GB')}</td>
                    <td>{payment.receiptNumber}</td>
                    <td style={{ color: '#7AC943', fontWeight: 'bold' }}>₹{payment.amount.toLocaleString('en-IN')}</td>
                    <td>{payment.paymentMode}</td>
                    <td>{payment.referenceNumber || payment.remarks || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleViewReceipt(payment._id)} style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Receipt</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No payment history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="modal-overlay printable-receipt-overlay">
          <div className="modal-content receipt-modal-content" style={{ maxWidth: '800px', width: '100%' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
              <button onClick={handlePrintReceipt} className="submit-btn" style={{ backgroundColor: '#10b981' }}>Print Receipt</button>
              <button onClick={() => setShowReceiptModal(false)} className="submit-btn" style={{ backgroundColor: '#ef4444' }}>Close</button>
            </div>

            <div className="printable-receipt-area" style={{ padding: '40px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ margin: '0 0 10px 0', color: '#0b4f6c' }}>{receiptData.settings.instituteName || 'INSTITUTE NAME'}</h1>
                  <p style={{ margin: '0 0 5px 0' }}>{receiptData.settings.instituteAddress}</p>
                  <p style={{ margin: '0 0 5px 0' }}>Phone: {receiptData.settings.phone} | Email: {receiptData.settings.email}</p>
                  {receiptData.settings.gstNumber && <p style={{ margin: 0 }}>GST: {receiptData.settings.gstNumber}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ margin: '0 0 10px 0', color: '#555' }}>PAYMENT RECEIPT</h2>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Receipt No:</strong> {receiptData.receipt.receiptNumber}</p>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Date:</strong> {new Date(receiptData.payment.paymentDate).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Client Name:</strong> {receiptData.payment.clientId.clientName}</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Project:</strong> {receiptData.payment.clientId.projectName} ({receiptData.payment.clientId.projectType})</p>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Total Project Cost:</strong> ₹{(receiptData.payment.clientId.amount || 0).toLocaleString('en-IN')}</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Total Pending Balance:</strong> ₹{(receiptData.payment.clientId.amount - receiptData.payment.clientId.paidAmount || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Payment Mode</th>
                    <th style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Ref / Remarks</th>
                    <th style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>Project Payment</td>
                    <td style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{receiptData.payment.paymentMode}</td>
                    <td style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{receiptData.payment.referenceNumber || receiptData.payment.remarks || '-'}</td>
                    <td style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold' }}>₹{receiptData.payment.amount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px' }}>
                <div>
                  <p style={{ fontStyle: 'italic', color: '#666', margin: 0 }}>{receiptData.settings.footerMessage || 'Thank you for your payment.'}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ borderBottom: '1px solid #000', width: '200px', marginBottom: '5px', height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {receiptData.settings.authorizedSignature ? (
                      <span style={{ fontFamily: 'cursive', fontSize: '20px' }}>{receiptData.settings.authorizedSignature}</span>
                    ) : null}
                  </div>
                  <p style={{ margin: 0 }}>Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientsView;
