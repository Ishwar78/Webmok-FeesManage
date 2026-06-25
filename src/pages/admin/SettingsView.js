import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './SettingsView.css';

function SettingsView() {
  const [settings, setSettings] = useState({
    instituteName: '',
    instituteAddress: '',
    phone: '',
    email: '',
    gstNumber: '',
    receiptPrefix: 'FM-2026-',
    footerMessage: 'Thank you for your payment.',
    authorizedSignature: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/api/admin/settings');
      if (res.data) {
        setSettings(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/api/admin/settings', settings);
      if (res.data.success) {
        alert('Settings updated successfully!');
      }
    } catch (error) {
      alert('Failed to update settings');
    }
  };

  if (loading) {
    return <div className="admin-view">Loading Settings...</div>;
  }

  return (
    <div className="admin-view">
      <h2 style={{ marginBottom: '20px' }}>Institute Settings</h2>
      
      <div className="settings-container">
        <form onSubmit={handleSubmit} className="settings-form">
          
          <div className="form-section">
            <h4>General Details</h4>
            <div className="form-grid">
              <div className="input-group">
                <label>Institute Name *</label>
                <input type="text" name="instituteName" required value={settings.instituteName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={settings.email} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={settings.phone} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>GST Number</label>
                <input type="text" name="gstNumber" value={settings.gstNumber} onChange={handleInputChange} />
              </div>
              <div className="input-group full-width">
                <label>Institute Address</label>
                <textarea name="instituteAddress" rows="3" value={settings.instituteAddress} onChange={handleInputChange}></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Receipt Configuration</h4>
            <div className="form-grid">
              <div className="input-group">
                <label>Receipt Number Prefix</label>
                <input type="text" name="receiptPrefix" required value={settings.receiptPrefix} onChange={handleInputChange} />
                <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>E.g. FM-2026- will produce FM-2026-000001</small>
              </div>
              <div className="input-group">
                <label>Authorized Signatory Name</label>
                <input type="text" name="authorizedSignature" value={settings.authorizedSignature} onChange={handleInputChange} />
              </div>
              <div className="input-group full-width">
                <label>Receipt Footer Message</label>
                <input type="text" name="footerMessage" value={settings.footerMessage} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="submit-area" style={{ marginTop: '20px' }}>
            <button type="submit" className="submit-btn registration-submit" style={{ width: '200px' }}>Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsView;
