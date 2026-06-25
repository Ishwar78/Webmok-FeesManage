import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import API from "../utils/api";
import StudentsView from "./admin/StudentsView";
import FeesView from "./admin/FeesView";
import ClientsView from "./admin/ClientsView";
import SettingsView from "./admin/SettingsView";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Students",  icon: "🎓" },
  { label: "Clients",   icon: "🏢" },
  { label: "Fees",      icon: "💰" },
];

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    collectedFees: 0,
    pendingFees: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);

  const adminName = localStorage.getItem("adminName") || "Admin";

  useEffect(() => {
    if (activeTab === "Dashboard") fetchDashboardData();
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
    if (activeTab === "Students") return <StudentsView />;
    if (activeTab === "Clients")  return <ClientsView />;
    if (activeTab === "Fees")     return <FeesView />;
    if (activeTab === "Settings") return <SettingsView />;
    if (activeTab === "Reports") {
      return (
        <div className="admin-view">
          <h2>{activeTab}</h2>
          <p>This module is under development.</p>
        </div>
      );
    }

    // ── Dashboard ──────────────────────────────────────────────
    return (
      <div className="content-body">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Total Students</h4>
              <div className="stat-icon stat-icon-blue">🎓</div>
            </div>
            <h2>{stats.totalStudents}</h2>
            <span className="stat-trend">↑ Active Enrollments</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Total Fees</h4>
              <div className="stat-icon stat-icon-green">💵</div>
            </div>
            <h2>₹{stats.totalFees.toLocaleString("en-IN")}</h2>
            <span className="stat-trend">Total Billed</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Collected Fees</h4>
              <div className="stat-icon stat-icon-purple">✅</div>
            </div>
            <h2>₹{stats.collectedFees.toLocaleString("en-IN")}</h2>
            <span className="stat-trend">Payments Received</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h4>Pending Fees</h4>
              <div className="stat-icon stat-icon-amber">⏳</div>
            </div>
            <h2>₹{stats.pendingFees.toLocaleString("en-IN")}</h2>
            <span className="stat-trend" style={{ color: "#f59e0b" }}>
              Outstanding Balance
            </span>
          </div>
        </div>

        {/* Recent Students Table */}
        <div className="table-box">
          <div className="table-box-header">
            <h2>Recent Students</h2>
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
                    <td style={{ color: "#94a3b8", fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ fontWeight: 600, color: "#1e293b" }}>{student.name}</td>
                    <td>{student.course}</td>
                    <td style={{ fontWeight: 600 }}>₹{student.feeAmount.toLocaleString("en-IN")}</td>
                    <td>
                      <span
                        className={
                          student.status === "Paid"
                            ? "paid"
                            : student.status === "Partial"
                            ? "partially-paid"
                            : "pending"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Mobile Menu Button */}
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
            zIndex: 998, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Logo */}
        <div className="logo">
          <img
            src="/webmok-logo.png"
            alt="Web Mok Logo"
            onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
          />
          <p>Admin Panel</p>
        </div>

        {/* Nav Items */}
        <ul>
          {NAV_ITEMS.map((item) => (
            <li
              key={item.label}
              className={activeTab === item.label ? "active" : ""}
              onClick={() => { setActiveTab(item.label); setSidebarOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </li>
          ))}

          {/* Logout */}
          <li
            onClick={handleLogout}
            style={{ marginTop: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}
          >
            <span className="nav-icon">🚪</span>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Top Header */}
        <div className="header">
          <h1>
            {NAV_ITEMS.find((i) => i.label === activeTab)?.icon}{" "}
            {activeTab}
          </h1>
          <div className="header-right">
            <div className="admin-box">{adminName}</div>
          </div>
        </div>

        {/* Page Content */}
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;