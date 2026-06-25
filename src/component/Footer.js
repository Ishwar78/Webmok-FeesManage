import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column brand-column">
          <Link to="/" className="footer-logo-link">
            <div className="footer-logo-wrapper">
              <img
                src="/webmok-logo.png"
                alt="Web Mok Logo"
                className="footer-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.querySelector('.footer-logo-fallback').style.display = 'flex';
                }}
              />
              <div className="footer-logo-fallback" style={{display: 'none'}}>
                <span style={{fontSize: '28px', fontWeight: '800', color: '#0b4f6c'}}>Web</span>
                <span style={{fontSize: '28px', fontWeight: '800', color: '#00aacc', marginLeft: '6px'}}>Mok</span>
              </div>
            </div>
          </Link>
          <p className="footer-description">
            Empowering educational institutions with a comprehensive and secure fees management solution. Simplifying administration, one click at a time.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" title="Facebook">f</a>
            <a href="#" className="social-icon" title="Twitter">𝕏</a>
            <a href="#" className="social-icon" title="Instagram">📷</a>
            <a href="#" className="social-icon" title="LinkedIn">in</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/students">Students</Link></li>
            <li><Link to="/fees">Fees</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li>📍 123 Education Lane, Tech City, 10001</li>
            <li>📧 support@webmok.com</li>
            <li>📞 +1 (800) 123-4567</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Web Mok Fees Management System. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
