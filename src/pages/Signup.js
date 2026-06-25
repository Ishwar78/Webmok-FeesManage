import React from "react";
import "./Signup.css";

function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1>Join Fees Manager</h1>
        <p>
          Create your account and start managing students,
          fees, reports and payments easily.
        </p>
      </div>

      <div className="signup-right">
        <div className="signup-card">
          <h2>Create Account</h2>

          <form>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
              />
            </div>

            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;