import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './StudentsView.css';

function StudentsView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    branch: '',
    email: '',
    phone: '',
    feeAmount: '',
    paidAmount: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/api/admin/students');
      setStudents(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch students:', error);
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
      const res = await API.post('/api/admin/students', formData);
      if (res.data.success) {
        alert('Student added successfully!');
        setShowModal(false);
        setFormData({ name: '', course: '', branch: '', email: '', phone: '', feeAmount: '', paidAmount: '' });
        fetchStudents(); // Refresh the list
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add student');
    }
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2>Manage Students</h2>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccc', minWidth: '250px' }}
          />
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Student</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
            <h3>Add New Student</h3>
            <form onSubmit={handleSubmit} className="student-form">
              <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} />
              <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} />
              <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} />
              <input type="text" name="course" placeholder="Course (e.g., B.Tech, MCA)" required value={formData.course} onChange={handleInputChange} />
              <input type="text" name="branch" placeholder="Branch (e.g., CSE, IT)" value={formData.branch} onChange={handleInputChange} />
              <input type="number" name="feeAmount" placeholder="Total Fee Amount (₹)" required value={formData.feeAmount} onChange={handleInputChange} />
              <input type="number" name="paidAmount" placeholder="Amount Paid (₹)" value={formData.paidAmount} onChange={handleInputChange} />
              
              <button type="submit" className="submit-btn">Save Student</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-box">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Course/Branch</th>
                <th>Contact</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: "center"}}>Loading...</td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const feeAmount = student.feeAmount || 0;
                  const paidAmount = student.paidAmount || 0;
                  const balance = feeAmount - paidAmount;
                  
                  return (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>
                        {student.course}
                        {student.branch ? ` - ${student.branch}` : ''}
                      </td>
                      <td>
                        <div>{student.email}</div>
                        <div style={{fontSize: '12px', color: '#666'}}>{student.phone || 'N/A'}</div>
                      </td>
                      <td>₹{feeAmount.toLocaleString('en-IN')}</td>
                      <td style={{color: '#7AC943'}}>₹{paidAmount.toLocaleString('en-IN')}</td>
                      <td style={{color: balance > 0 ? '#ef4444' : '#64748b'}}>₹{balance > 0 ? balance.toLocaleString('en-IN') : 0}</td>
                      <td>
                        <span className={
                          student.status === 'Paid' ? 'paid' : 
                          student.status === 'Partially Paid' ? 'partially-paid' : 'pending'
                        }>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{textAlign: "center"}}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentsView;
