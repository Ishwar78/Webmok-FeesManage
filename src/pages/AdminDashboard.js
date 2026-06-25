import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import API from "../utils/api";
import StudentsView from "./admin/StudentsView";
import FeesView from "./admin/FeesView";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    collectedFees: 0,
    pendingFees: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    // Only fetch dashboard stats if Dashboard tab is active
    if (activeTab === "Dashboard") {
      fetchDashboardData();
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

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  const renderContent = () => {
    if (activeTab === "Students") {
      return <StudentsView />;
    }
    if (activeTab === "Fees") {
      return <FeesView />;
    }
    if (activeTab === "Reports" || activeTab === "Settings") {
      return (
        <div className="admin-view">
          <h2>{activeTab}</h2>
          <p>This module is under development.</p>
        </div>
      );
    }
    
    // Default Dashboard View
    return (
      <>
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Students</h4>
            <h2>{stats.totalStudents}</h2>
          </div>

          <div className="stat-card">
            <h4>Total Fees</h4>
            <h2>₹{stats.totalFees.toLocaleString('en-IN')}</h2>
          </div>

          <div className="stat-card">
            <h4>Collected Fees</h4>
            <h2>₹{stats.collectedFees.toLocaleString('en-IN')}</h2>
          </div>

          <div className="stat-card">
            <h4>Pending Fees</h4>
            <h2>₹{stats.pendingFees.toLocaleString('en-IN')}</h2>
          </div>
        </div>

        {/* Table */}
        <div className="table-box">
          <h2>Recent Students</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>₹{student.feeAmount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={student.status === 'Paid' ? 'paid' : 'pending'}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{textAlign: "center"}}>No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard">
      {/* Mobile Menu */}
      <button
        className="menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="logo">
          <h2>FM</h2>
        </div>

        <ul>
          <li className={activeTab === "Dashboard" ? "active" : ""} onClick={() => {setActiveTab("Dashboard"); setSidebarOpen(false);}}>Dashboard</li>
          <li className={activeTab === "Students" ? "active" : ""} onClick={() => {setActiveTab("Students"); setSidebarOpen(false);}}>Students</li>
          <li className={activeTab === "Fees" ? "active" : ""} onClick={() => {setActiveTab("Fees"); setSidebarOpen(false);}}>Fees</li>
          <li className={activeTab === "Reports" ? "active" : ""} onClick={() => {setActiveTab("Reports"); setSidebarOpen(false);}}>Reports</li>
          <li className={activeTab === "Settings" ? "active" : ""} onClick={() => {setActiveTab("Settings"); setSidebarOpen(false);}}>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main */}
      <div className="content">
        <div className="header">
          <h1>Admin {activeTab}</h1>

          <div className="admin-box">
            Admin
          </div>
        </div>

        {renderContent()}
        
      </div>
    </div>
  );
}

export default AdminDashboard;