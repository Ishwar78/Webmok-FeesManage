import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './StudentsView.css';

function StudentsView({ branchId }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialFormState = {
    name: '', fatherName: '', dob: '', gender: '',
    course: '', branch: '', modeOfTraining: '', preferredBatchTime: '',
    email: '', phone: '', aadharNumber: '', panNumber: '',
    feeAmount: '', paidAmount: '',
    address: { street: '', city: '', state: '', pincode: '' },
    educationDetails: [
      { qualification: '10th', board: '', year: '', percentage: '' },
      { qualification: '12th', board: '', year: '', percentage: '' },
      { qualification: 'Graduation (UG)', board: '', year: '', percentage: '' },
      { qualification: 'Post Graduation (PG)', board: '', year: '', percentage: '' },
      { qualification: 'Other', board: '', year: '', percentage: '' }
    ],
    workExperience: { isWorking: false, companyName: '', designation: '', experienceYears: '' },
    documents: {
      aadharCopy: false, panCopy: false, photos: false,
      marksheet10: false, marksheet12: false, marksheetUG: false, marksheetPG: false
    },
    installmentPlan: {
      planType: 'One Time',
      installments: []
    }
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchStudents();
  }, [branchId]);

  const fetchStudents = async () => {
    try {
      const url = branchId ? `/api/admin/students?branchId=${branchId}` : '/api/admin/students';
      const res = await API.get(url);
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

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEdu = [...formData.educationDetails];
    updatedEdu[index][field] = value;
    setFormData({ ...formData, educationDetails: updatedEdu });
  };

  const handleInstallmentPlanChange = (e) => {
    const planType = e.target.value;
    const totalFee = Number(formData.feeAmount) || 0;
    
    let newInstallments = [];
    if (planType === 'One Time' && totalFee > 0) {
      newInstallments = [{ amount: totalFee, dueDate: new Date().toISOString().split('T')[0] }];
    } else if (planType === 'Custom') {
      newInstallments = [{ amount: '', dueDate: '' }];
    }
    
    setFormData({
      ...formData,
      installmentPlan: {
        planType,
        installments: newInstallments
      }
    });
  };

  const handleAddInstallment = () => {
    setFormData({
      ...formData,
      installmentPlan: {
        ...formData.installmentPlan,
        installments: [...formData.installmentPlan.installments, { amount: '', dueDate: '' }]
      }
    });
  };

  const handleRemoveInstallment = (index) => {
    const updated = [...formData.installmentPlan.installments];
    updated.splice(index, 1);
    setFormData({
      ...formData,
      installmentPlan: {
        ...formData.installmentPlan,
        installments: updated
      }
    });
  };

  const handleInstallmentChange = (index, field, value) => {
    const updated = [...formData.installmentPlan.installments];
    updated[index][field] = value;
    setFormData({
      ...formData,
      installmentPlan: {
        ...formData.installmentPlan,
        installments: updated
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (branchId) payload.branchId = branchId;
      const res = await API.post('/api/admin/students', payload);
      if (res.data.success) {
        alert('Student added successfully!');
        setShowModal(false);
        setFormData(initialFormState);
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
          <div className="modal-content large-modal">
            <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
            <h3 style={{ borderBottom: '2px solid #1a56db', paddingBottom: '10px', marginBottom: '20px', color: '#1a56db' }}>REGISTRATION FORM</h3>
            
            <form onSubmit={handleSubmit} className="student-form-advanced">
              
              <div className="form-section">
                <h4>1. PERSONAL DETAILS</h4>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Full Name (As per ID Proof)</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>PAN Card Number</label>
                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>Father's / Guardian Name</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>Address</label>
                    <input type="text" placeholder="Street Address" value={formData.address.street} onChange={(e) => handleNestedChange('address', 'street', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>City</label>
                    <input type="text" value={formData.address.city} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>State</label>
                    <input type="text" value={formData.address.state} onChange={(e) => handleNestedChange('address', 'state', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Mobile Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>Pincode</label>
                    <input type="text" value={formData.address.pincode} onChange={(e) => handleNestedChange('address', 'pincode', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Email ID</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>Aadhar Card Number</label>
                    <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>2. COURSE DETAILS</h4>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Course Name</label>
                    <input type="text" name="course" required value={formData.course} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>Branch</label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>Mode of Training</label>
                    <div className="radio-group">
                      <label><input type="radio" name="modeOfTraining" value="Online" checked={formData.modeOfTraining === 'Online'} onChange={handleInputChange}/> Online</label>
                      <label><input type="radio" name="modeOfTraining" value="Offline" checked={formData.modeOfTraining === 'Offline'} onChange={handleInputChange}/> Offline</label>
                      <label><input type="radio" name="modeOfTraining" value="Hybrid" checked={formData.modeOfTraining === 'Hybrid'} onChange={handleInputChange}/> Hybrid</label>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Preferred Batch Time</label>
                    <div className="radio-group">
                      <label><input type="radio" name="preferredBatchTime" value="Morning" checked={formData.preferredBatchTime === 'Morning'} onChange={handleInputChange}/> Morning</label>
                      <label><input type="radio" name="preferredBatchTime" value="Afternoon" checked={formData.preferredBatchTime === 'Afternoon'} onChange={handleInputChange}/> Afternoon</label>
                      <label><input type="radio" name="preferredBatchTime" value="Evening" checked={formData.preferredBatchTime === 'Evening'} onChange={handleInputChange}/> Evening</label>
                      <label><input type="radio" name="preferredBatchTime" value="Weekend" checked={formData.preferredBatchTime === 'Weekend'} onChange={handleInputChange}/> Weekend</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>3. EDUCATIONAL DETAILS</h4>
                <div className="table-responsive">
                  <table className="edu-table">
                    <thead>
                      <tr>
                        <th>Qualification</th>
                        <th>Board / University</th>
                        <th>Year of Passing</th>
                        <th>Percentage / CGPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.educationDetails.map((edu, index) => (
                        <tr key={index}>
                          <td>
                            {edu.qualification === 'Other' || edu.isOther ? (
                              <input type="text" placeholder="Other Qualification" value={edu.qualification === 'Other' ? '' : edu.qualification} onChange={(e) => {
                                handleEducationChange(index, 'qualification', e.target.value);
                                handleEducationChange(index, 'isOther', true);
                              }} />
                            ) : (
                              edu.qualification
                            )}
                          </td>
                          <td><input type="text" value={edu.board} onChange={(e) => handleEducationChange(index, 'board', e.target.value)} /></td>
                          <td><input type="text" value={edu.year} onChange={(e) => handleEducationChange(index, 'year', e.target.value)} /></td>
                          <td><input type="text" value={edu.percentage} onChange={(e) => handleEducationChange(index, 'percentage', e.target.value)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="form-section">
                <h4>4. WORK EXPERIENCE DETAILS</h4>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Are you currently working?</label>
                    <div className="radio-group">
                      <label><input type="radio" name="isWorking" value="true" checked={formData.workExperience.isWorking === true} onChange={() => handleNestedChange('workExperience', 'isWorking', true)}/> Yes</label>
                      <label><input type="radio" name="isWorking" value="false" checked={formData.workExperience.isWorking === false} onChange={() => handleNestedChange('workExperience', 'isWorking', false)}/> No</label>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>If Yes, Company Name</label>
                    <input type="text" disabled={!formData.workExperience.isWorking} value={formData.workExperience.companyName} onChange={(e) => handleNestedChange('workExperience', 'companyName', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Designation</label>
                    <input type="text" disabled={!formData.workExperience.isWorking} value={formData.workExperience.designation} onChange={(e) => handleNestedChange('workExperience', 'designation', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Work Experience (Years)</label>
                    <input type="text" disabled={!formData.workExperience.isWorking} value={formData.workExperience.experienceYears} onChange={(e) => handleNestedChange('workExperience', 'experienceYears', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="form-row-split">
                <div className="form-section half-width">
                  <h4>5. DOCUMENTS REQUIRED</h4>
                  <div className="checkbox-group-vertical">
                    <label><input type="checkbox" checked={formData.documents.aadharCopy} onChange={(e) => handleNestedChange('documents', 'aadharCopy', e.target.checked)}/> Aadhar Card Copy</label>
                    <label><input type="checkbox" checked={formData.documents.panCopy} onChange={(e) => handleNestedChange('documents', 'panCopy', e.target.checked)}/> PAN Card Copy</label>
                    <label><input type="checkbox" checked={formData.documents.photos} onChange={(e) => handleNestedChange('documents', 'photos', e.target.checked)}/> 2 Passport Size Photographs</label>
                    <p style={{ margin: '10px 0 5px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>Educational Documents:</p>
                    <label><input type="checkbox" checked={formData.documents.marksheet10} onChange={(e) => handleNestedChange('documents', 'marksheet10', e.target.checked)}/> 10th Marksheet</label>
                    <label><input type="checkbox" checked={formData.documents.marksheet12} onChange={(e) => handleNestedChange('documents', 'marksheet12', e.target.checked)}/> 12th Marksheet</label>
                    <label><input type="checkbox" checked={formData.documents.marksheetUG} onChange={(e) => handleNestedChange('documents', 'marksheetUG', e.target.checked)}/> UG Last Semester DMC Copy</label>
                    <label><input type="checkbox" checked={formData.documents.marksheetPG} onChange={(e) => handleNestedChange('documents', 'marksheetPG', e.target.checked)}/> PG Last Semester DMC Copy</label>
                  </div>
                </div>

                <div className="form-section half-width fee-section">
                  <h4>6. FEE DETAILS & INSTALLMENTS</h4>
                  <div className="input-group">
                    <label>Total Fee Amount (₹) *</label>
                    <input type="number" name="feeAmount" required value={formData.feeAmount} onChange={(e) => {
                      handleInputChange(e);
                      // If One Time is selected, auto-update its amount
                      if (formData.installmentPlan.planType === 'One Time') {
                        setFormData(prev => ({
                          ...prev,
                          feeAmount: e.target.value,
                          installmentPlan: {
                            ...prev.installmentPlan,
                            installments: [{ amount: e.target.value, dueDate: new Date().toISOString().split('T')[0] }]
                          }
                        }));
                      }
                    }} />
                  </div>
                  <div className="input-group" style={{marginTop: '15px'}}>
                    <label>Initial Amount Paid (₹)</label>
                    <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} />
                  </div>

                  <div className="input-group" style={{marginTop: '15px'}}>
                    <label>Fee Structure</label>
                    <select name="planType" value={formData.installmentPlan.planType} onChange={handleInstallmentPlanChange}>
                      <option value="One Time">One Time</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Half Yearly">Half Yearly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Custom">Custom Installments</option>
                    </select>
                  </div>

                  {formData.installmentPlan.installments.length > 0 && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '5px', border: '1px solid #e2e8f0' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>Installment Schedule</p>
                      {formData.installmentPlan.installments.map((inst, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-end' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>Amount (₹)</label>
                            <input type="number" value={inst.amount} onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)} required style={{ width: '100%', padding: '5px' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>Due Date</label>
                            <input type="date" value={inst.dueDate} onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)} required style={{ width: '100%', padding: '5px' }} />
                          </div>
                          {(formData.installmentPlan.planType === 'Custom' || formData.installmentPlan.planType === 'Monthly' || formData.installmentPlan.planType === 'Quarterly' || formData.installmentPlan.planType === 'Half Yearly' || formData.installmentPlan.planType === 'Yearly') && (
                            <button type="button" onClick={() => handleRemoveInstallment(index)} style={{ padding: '6px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                          )}
                        </div>
                      ))}
                      {(formData.installmentPlan.planType === 'Custom' || formData.installmentPlan.planType === 'Monthly' || formData.installmentPlan.planType === 'Quarterly' || formData.installmentPlan.planType === 'Half Yearly' || formData.installmentPlan.planType === 'Yearly') && (
                        <button type="button" onClick={handleAddInstallment} style={{ marginTop: '5px', fontSize: '12px', padding: '5px 10px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Installment</button>
                      )}
                    </div>
                  )}
                  
                  <div className="submit-area">
                    <button type="submit" className="submit-btn registration-submit">Save Student Registration</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewStudent && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <span className="close-btn" onClick={() => setViewStudent(null)}>&times;</span>
            <h3 style={{ borderBottom: '2px solid #1a56db', paddingBottom: '10px', marginBottom: '20px', color: '#1a56db' }}>STUDENT DETAILS</h3>
            
            <div className="view-details-container">
              <div className="form-section">
                <h4>1. PERSONAL DETAILS</h4>
                <div className="details-grid">
                  <p><strong>Name:</strong> {viewStudent.name}</p>
                  <p><strong>Father's Name:</strong> {viewStudent.fatherName || 'N/A'}</p>
                  <p><strong>Date of Birth:</strong> {viewStudent.dob || 'N/A'}</p>
                  <p><strong>Gender:</strong> {viewStudent.gender || 'N/A'}</p>
                  <p><strong>Phone:</strong> {viewStudent.phone || 'N/A'}</p>
                  <p><strong>Email:</strong> {viewStudent.email}</p>
                  <p><strong>Aadhar Number:</strong> {viewStudent.aadharNumber || 'N/A'}</p>
                  <p><strong>PAN Number:</strong> {viewStudent.panNumber || 'N/A'}</p>
                  {viewStudent.address && (
                    <p style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {viewStudent.address.street}, {viewStudent.address.city}, {viewStudent.address.state} - {viewStudent.address.pincode}</p>
                  )}
                </div>
              </div>

              <div className="form-section" style={{ marginTop: '20px' }}>
                <h4>2. COURSE DETAILS</h4>
                <div className="details-grid">
                  <p><strong>Course:</strong> {viewStudent.course}</p>
                  <p><strong>Branch:</strong> {viewStudent.branch || 'N/A'}</p>
                  <p><strong>Mode of Training:</strong> {viewStudent.modeOfTraining || 'N/A'}</p>
                  <p><strong>Preferred Batch:</strong> {viewStudent.preferredBatchTime || 'N/A'}</p>
                  <p><strong>Total Fee:</strong> ₹{viewStudent.feeAmount ? viewStudent.feeAmount.toLocaleString('en-IN') : 0}</p>
                  <p><strong>Paid Amount:</strong> ₹{viewStudent.paidAmount ? viewStudent.paidAmount.toLocaleString('en-IN') : 0}</p>
                  <p><strong>Enrollment Date:</strong> {new Date(viewStudent.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {viewStudent.educationDetails && viewStudent.educationDetails.length > 0 && (
                <div className="form-section" style={{ marginTop: '20px' }}>
                  <h4>3. EDUCATIONAL DETAILS</h4>
                  <table className="edu-table" style={{ marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>Qualification</th>
                        <th>Board / University</th>
                        <th>Year</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewStudent.educationDetails.filter(e => e.board || e.year || e.percentage).map((edu, idx) => (
                        <tr key={idx}>
                          <td>{edu.qualification}</td>
                          <td>{edu.board}</td>
                          <td>{edu.year}</td>
                          <td>{edu.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {viewStudent.workExperience && (
                <div className="form-section" style={{ marginTop: '20px' }}>
                  <h4>4. WORK EXPERIENCE</h4>
                  <div className="details-grid">
                    <p><strong>Working:</strong> {viewStudent.workExperience.isWorking ? 'Yes' : 'No'}</p>
                    {viewStudent.workExperience.isWorking && (
                      <>
                        <p><strong>Company:</strong> {viewStudent.workExperience.companyName}</p>
                        <p><strong>Designation:</strong> {viewStudent.workExperience.designation}</p>
                        <p><strong>Experience:</strong> {viewStudent.workExperience.experienceYears} Years</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                <th>Actions</th>
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
                      <td>
                        <button onClick={() => setViewStudent(student)} className="view-btn" style={{ padding: '5px 10px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#334155' }}>View</button>
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
