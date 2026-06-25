import React from "react";

function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7fb",
      }}
    >
      {/* Left Section */}

      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg, #2563eb, #1e40af)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <h1
          style={{
            fontSize: "55px",
            marginBottom: "20px",
          }}
        >
          Fees Management
          <br />
          System
        </h1>

        <p
          style={{
            fontSize: "20px",
            lineHeight: "1.8",
            maxWidth: "500px",
          }}
        >
          Manage student fees, payments, reports and
          institution records with one powerful dashboard.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "20px",
          }}
        >
          <div>
            <h2>500+</h2>
            <p>Institutions</p>
          </div>

          <div>
            <h2>50K+</h2>
            <p>Students</p>
          </div>

          <div>
            <h2>99.9%</h2>
            <p>Secure</p>
          </div>
        </div>
      </div>

      {/* Right Section */}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "#fff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Welcome Back 👋
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginBottom: "30px",
            }}
          >
            Login to your account
          </p>

          <form>
            <div style={{ marginBottom: "20px" }}>
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              <label>
                <input type="checkbox" /> Remember Me
              </label>

              <a
                href="/"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "15px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >
            <span style={{ color: "#6b7280" }}>
              Don't have an account?
            </span>

            <a
              href="/signup"
              style={{
                marginLeft: "5px",
                color: "#2563eb",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;