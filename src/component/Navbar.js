import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <img
            src="/webmok-logo.png"
            alt="Web Mok Logo"
            className="brand-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <span
            className="brand-fallback-text"
            style={{ display: 'none', alignItems: 'center', gap: '4px' }}
          >
            <span style={{ color: '#0b4f6c', fontWeight: 800, fontSize: '22px' }}>Web</span>
            <span style={{ color: '#00aacc', fontWeight: 800, fontSize: '22px' }}>Mok</span>
          </span>
        </Link>

        {/* Hamburger */}
        <div
          className={`menu-icon ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menu */}
        <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <div className="nav-links">
            <Link to="/" className={`nav-item ${isActive("/")}`} onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link to="/students" className={`nav-item ${isActive("/students")}`} onClick={() => setMenuOpen(false)}>
              Students
            </Link>

            <Link to="/fees" className={`nav-item ${isActive("/fees")}`} onClick={() => setMenuOpen(false)}>
              Fees
            </Link>

            <Link to="/reports" className={`nav-item ${isActive("/reports")}`} onClick={() => setMenuOpen(false)}>
              Reports
            </Link>
          </div>

          <div className="nav-buttons">
            <Link
              to="/login"
              className="btn-login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="btn-signup"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;