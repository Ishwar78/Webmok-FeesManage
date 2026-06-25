import React, { useState } from "react";
import "./AdminLogin.css";
import API from "../utils/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/api/admin/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("admin", "true");

        alert(res.data.message);

        window.location.href = "/admin-dashboard";
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Invalid Credentials");
      } else {
        alert("Cannot connect to server. Please ensure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-logo">
          <h1>FM</h1>
        </div>

        <h2>Admin Login</h2>
        <p>Fees Management System</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;