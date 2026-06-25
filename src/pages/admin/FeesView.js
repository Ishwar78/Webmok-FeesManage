import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

function FeesView() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      // Using the students endpoint since it joins fee data
      const res = await API.get('/api/admin/students');
      setFees(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch fees:', error);
      setLoading(false);
    }
  };

  const filteredFees = fees.filter(fee => 
    fee.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    fee.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2>Manage Fees</h2>
        <input 
          type="text" 
          placeholder="Search by student name or course..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccc', minWidth: '250px' }}
        />
      </div>

      <div className="table-box">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course / Branch</th>
                <th>Total Fee (₹)</th>
                <th>Amount Paid (₹)</th>
                <th>Pending Amount (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{textAlign: "center"}}>Loading fee records...</td>
                </tr>
              ) : filteredFees.length > 0 ? (
                filteredFees.map((record) => {
                  const feeAmount = record.feeAmount || 0;
                  const paidAmount = record.paidAmount || 0;
                  const pendingAmount = feeAmount - paidAmount;
                  
                  return (
                    <tr key={record._id}>
                      <td style={{ fontWeight: '600' }}>{record.name}</td>
                      <td>
                        {record.course}
                        {record.branch ? ` - ${record.branch}` : ''}
                      </td>
                      <td style={{ color: '#0b4f6c', fontWeight: '500' }}>₹{feeAmount.toLocaleString('en-IN')}</td>
                      <td style={{ color: '#7AC943', fontWeight: '600' }}>₹{paidAmount.toLocaleString('en-IN')}</td>
                      <td style={{ color: pendingAmount > 0 ? '#ef4444' : '#64748b', fontWeight: '600' }}>
                        ₹{pendingAmount > 0 ? pendingAmount.toLocaleString('en-IN') : 0}
                      </td>
                      <td>
                        <span className={
                          record.status === 'Paid' ? 'paid' : 
                          record.status === 'Partially Paid' ? 'partially-paid' : 'pending'
                        }>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{textAlign: "center"}}>No fee records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeesView;
