import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

function StudentProfileModal({ student, onClose }) {
  const [installments, setInstallments] = useState([]);

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        // We need an endpoint to fetch installments, but for now we'll just show the plan from the student object if we don't have the endpoint.
        // Actually, since we created Installment records, we should fetch them. Let's assume we add an endpoint: /api/admin/payments/installments/:studentId
      } catch (e) {
        console.error(e);
      }
    };
    fetchInstallments();
  }, [student._id]);

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h3 style={{ borderBottom: '2px solid #1a56db', paddingBottom: '10px', marginBottom: '20px', color: '#1a56db' }}>STUDENT PROFILE</h3>
        
        <div className="profile-header" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>{student.name}</h4>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Course:</strong> {student.course}</p>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Phone:</strong> {student.phone || 'N/A'}</p>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Email:</strong> {student.email}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Fee Summary</h4>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Total Fee:</strong> ₹{(student.feeAmount || 0).toLocaleString('en-IN')}</p>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#10b981' }}><strong>Paid:</strong> ₹{(student.paidAmount || 0).toLocaleString('en-IN')}</p>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#ef4444' }}><strong>Pending:</strong> ₹{Math.max(0, (student.feeAmount || 0) - (student.paidAmount || 0)).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
            <span>Payment Progress</span>
            <span>{Math.round(((student.paidAmount || 0) / (student.feeAmount || 1)) * 100)}%</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#10b981', width: `${Math.min(100, ((student.paidAmount || 0) / (student.feeAmount || 1)) * 100)}%` }}></div>
          </div>
        </div>

        {/* Detailed details from earlier can go here. Since the user can already view details in the Students view, we can keep this focused on payments as requested in Flow 8 */}
        
      </div>
    </div>
  );
}

export default StudentProfileModal;
