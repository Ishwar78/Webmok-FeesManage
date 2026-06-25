import React, { useState, useEffect } from "react";
import "./SuperAdminDashboard.css";
import API from "../utils/api";
import StudentsView from "./admin/StudentsView";
import FeesView from "./admin/FeesView";
import ClientsView from "./admin/ClientsView";
import SettingsView from "./admin/SettingsView";

function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedBranchName, setSelectedBranchName] = useState("");
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    collectedFees: 0,
    pendingFees: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchAdmins, setBranchAdmins] = useState([]);

  // Create Branch State
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [branchForm, setBranchForm] = useState({
    branchName: "", branchCode: "", address: "", city: "", state: "", phone: "", email: ""
  });

  // Create Admin State
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "", email: "", mobile: "", password: "", branchId: "", status: "Active"
  });

  const adminName = localStorage.getItem("adminName") || "Super Admin";

  useEffect(() => {
    if (activeTab === "Dashboard") fetchDashboardData();
    if (activeTab === "Branches") fetchBranches();
    if (activeTab === "Branch Admins") {
      fetchBranches();
      fetchBranchAdmins();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await API.get("/api/admin/dashboard-stats");
      setStats(statsRes.data);
      const studentsRes = await API.get("/api/admin/recent-students");
      setRecentStudents(studentsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await API.get("/api/admin/branches");
      setBranches(res.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchBranchAdmins = async () => {
    try {
      const res = await API.get("/api/admin/branches/admins");
      setBranchAdmins(res.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/admin/branches", branchForm);
      alert("Branch created successfully!");
      setShowCreateBranch(false);
      fetchBranches();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create branch");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/admin/branches/admins", adminForm);
      alert("Admin created successfully!");
      setShowCreateAdmin(false);
      fetchBranchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create admin");
    }
  };

  const renderContent = () => {
    if (activeTab === "Students") return <StudentsView />;
    if (activeTab === "Clients") return <ClientsView />;
    if (activeTab === "Fees") return <FeesView />;
    if (activeTab === "Settings") return <SettingsView />;
    if (activeTab === "Audit Logs") return <div className="admin-view"><h2>Audit Logs</h2><p>Coming Soon</p></div>;

    if (activeTab === "Branch Admins") {
      return (
        <div className="admin-view">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Branch Admins</h2>
            <button className="add-btn" onClick={() => setShowCreateAdmin(true)}>+ Create Admin</button>
          </div>
          <div className="table-box mt-4">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {branchAdmins.map(admin => (
                  <tr key={admin._id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.branchId?.branchName || 'N/A'}</td>
                    <td>{admin.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showCreateAdmin && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Create Branch Admin</h3>
                <form onSubmit={handleCreateAdmin}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" required onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" required onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" required onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <select required onChange={(e) => setAdminForm({...adminForm, branchId: e.target.value})}>
                      <option value="">Select Branch</option>
                      {branches.map(b => <option key={b._id} value={b._id}>{b.branchName}</option>)}
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="save-btn">Create</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowCreateAdmin(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "Branches") {
      if (selectedBranchId) {
        return (
          <div className="admin-view branch-specific-view">
            <button className="back-btn" onClick={() => setSelectedBranchId(null)}>← Back to Branches</button>
            <h2 style={{marginTop: '20px'}}>Branch: {selectedBranchName}</h2>
            <div className="branch-tabs">
              <div className="branch-tab-content">
                <h3 style={{marginBottom: '10px', marginTop: '20px', color: '#10b981'}}>Students in this branch</h3>
                <StudentsView branchId={selectedBranchId} />
                <h3 style={{marginBottom: '10px', marginTop: '40px', color: '#10b981'}}>Clients in this branch</h3>
                <ClientsView branchId={selectedBranchId} />
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="admin-view">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>All Branches</h2>
            <button className="add-btn" onClick={() => setShowCreateBranch(true)}>+ Create Branch</button>
          </div>
          
          <div className="branches-grid mt-4">
            {branches.map(branch => (
              <div key={branch._id} className="branch-card" onClick={() => {
                setSelectedBranchId(branch._id);
                setSelectedBranchName(branch.branchName);
              }}>
                <div className="branch-icon">🏢</div>
                <h3>{branch.branchName}</h3>
                <p>Code: {branch.branchCode}</p>
                <p>{branch.city}, {branch.state}</p>
                <button className="view-branch-btn">View Branch Data</button>
              </div>
            ))}
            {branches.length === 0 && <p>No branches found. Create one.</p>}
          </div>

          {showCreateBranch && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Create New Branch</h3>
                <form onSubmit={handleCreateBranch}>
                  <div className="form-group">
                    <label>Branch Name</label>
                    <input type="text" required onChange={(e) => setBranchForm({...branchForm, branchName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Branch Code</label>
                    <input type="text" required onChange={(e) => setBranchForm({...branchForm, branchCode: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" required onChange={(e) => setBranchForm({...branchForm, city: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" required onChange={(e) => setBranchForm({...branchForm, state: e.target.value})} />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="save-btn">Create</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowCreateBranch(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Default Dashboard View (Global)
    return (
      <div className="content-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Total Students</h4>
              <div className="stat-icon stat-icon-blue">🎓</div>
            </div>
            <h2>{stats.totalStudents}</h2>
            <span className="stat-trend">↑ All Branches</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Total Fees</h4>
              <div className="stat-icon stat-icon-green">💵</div>
            </div>
            <h2>₹{stats.totalFees.toLocaleString('en-IN')}</h2>
            <span className="stat-trend">Total Billed</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Collected Fees</h4>
              <div className="stat-icon stat-icon-purple">✅</div>
            </div>
            <h2>₹{stats.collectedFees.toLocaleString('en-IN')}</h2>
            <span className="stat-trend">Payments Received</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Pending Fees</h4>
              <div className="stat-icon stat-icon-amber">⏳</div>
            </div>
            <h2>₹{stats.pendingFees.toLocaleString('en-IN')}</h2>
            <span className="stat-trend" style={{ color: '#f59e0b' }}>Outstanding Balance</span>
          </div>
        </div>

        <div className="table-box">
          <div className="table-box-header">
            <h2>Recent Students — Global</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student, index) => (
                  <tr key={index}>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{student.name}</td>
                    <td>{student.course}</td>
                    <td style={{ fontWeight: 600 }}>₹{student.feeAmount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={student.status === 'Paid' ? 'paid' : student.status === 'Partial' ? 'partially-paid' : 'pending'}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const SA_NAV = [
    { label: 'Dashboard',     icon: '🏠' },
    { label: 'Branches',      icon: '🏢' },
    { label: 'Students',      icon: '🎓', display: 'Total Students' },
    { label: 'Clients',       icon: '👥', display: 'Total Clients' },
    { label: 'Fees',          icon: '💰', display: 'Total Fees' },
    { label: 'Branch Admins', icon: '🛡️' },
  ];

  return (
    <div className="dashboard super-admin">
      {/* Mobile Menu Button */}
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
            zIndex: 998, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="logo">
          <img
            src="/webmok-logo.png"
            alt="Web Mok Logo"
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
          <p>Super Admin</p>
        </div>

        <ul>
          {SA_NAV.map((item) => (
            <li
              key={item.label}
              className={activeTab === item.label ? 'active' : ''}
              onClick={() => { setActiveTab(item.label); setSidebarOpen(false); setSelectedBranchId(null); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.display || item.label}
            </li>
          ))}

          <li
            onClick={handleLogout}
            style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}
          >
            <span className="nav-icon">🚪</span>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="header">
          <h1>
            {SA_NAV.find(i => i.label === activeTab)?.icon}{' '}
            {activeTab}{selectedBranchId && ` › ${selectedBranchName}`}
          </h1>
          <div className="header-right">
            <div className="admin-box">{adminName} · Super Admin</div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
