import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Index() {
  
  // Simple fade-in animation on scroll simulation
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 150 * index);
    });
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "90vh",
          background: "linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center"
        }}
      >
        {/* Background Decorative Elements */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "400px", height: "400px", background: "rgba(122, 201, 67, 0.1)", borderRadius: "50%", filter: "blur(50px)" }}></div>
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "300px", height: "300px", background: "rgba(11, 79, 108, 0.1)", borderRadius: "50%", filter: "blur(40px)" }}></div>

        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            padding: "80px 50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "50px",
            flexWrap: "wrap",
            zIndex: 1,
            position: "relative"
          }}
        >
          {/* Left Content */}
          <div
            style={{
              flex: "1",
              minWidth: "400px",
              animation: "fadeInUp 1s ease-out"
            }}
          >
            <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(122, 201, 67, 0.15)', color: '#0b4f6c', borderRadius: '20px', fontWeight: '600', marginBottom: '20px', fontSize: '14px' }}>
              🚀 Next-Generation Management
            </div>
            <h1
              style={{
                fontSize: "64px",
                lineHeight: "1.1",
                color: "#0b4f6c",
                marginBottom: "25px",
                fontWeight: "800",
                letterSpacing: "-1px"
              }}
            >
              Smart <span style={{ color: "#7AC943" }}>Fees</span>
              <br />
              Management
              <br />
              For Institutions
            </h1>

            <p
              style={{
                fontSize: "20px",
                color: "#475569",
                lineHeight: "1.6",
                maxWidth: "600px",
                marginBottom: "40px"
              }}
            >
              Empower your institution with an all-in-one platform for secure online & offline fees collection. Automate reports, track dues, and scale seamlessly.
            </p>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Link
                to="/signup"
                style={{
                  padding: "16px 36px",
                  background: "#7AC943",
                  textDecoration: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 25px rgba(122,201,67,.4)",
                  display: "inline-block"
                }}
                onMouseOver={(e) => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 15px 30px rgba(122,201,67,.5)"; }}
                onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 10px 25px rgba(122,201,67,.4)"; }}
              >
                Get Started Free
              </Link>
              
              <Link
                to="/login"
                style={{
                  padding: "16px 36px",
                  background: "#fff",
                  textDecoration: "none",
                  border: "2px solid #0b4f6c",
                  borderRadius: "10px",
                  color: "#0b4f6c",
                  fontSize: "18px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  display: "inline-block"
                }}
                onMouseOver={(e) => { e.target.style.background = "#0b4f6c"; e.target.style.color = "#fff"; }}
                onMouseOut={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#0b4f6c"; }}
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div
            style={{
              flex: "1",
              textAlign: "center",
              minWidth: "450px",
              position: "relative"
            }}
          >
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(135deg, rgba(122,201,67,0.2), rgba(11,79,108,0.2))", borderRadius: "20px", transform: "rotate(-3deg)", zIndex: -1 }}></div>
            <img
              src="/fee.webp"
              alt="Fees Management Dashboard"
              style={{
                width: "100%",
                maxWidth: "700px",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: "transform 0.5s ease"
              }}
              onMouseOver={(e) => { e.target.style.transform = "scale(1.02)"; }}
              onMouseOut={(e) => { e.target.style.transform = "scale(1)"; }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: "#0b4f6c", padding: "60px 0" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 50px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "30px" }}>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <h2 style={{ fontSize: "48px", fontWeight: "800", margin: "0", color: "#7AC943" }}>500+</h2>
            <p style={{ fontSize: "18px", margin: "10px 0 0", color: "#cbd5e1" }}>Institutions</p>
          </div>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <h2 style={{ fontSize: "48px", fontWeight: "800", margin: "0", color: "#7AC943" }}>1M+</h2>
            <p style={{ fontSize: "18px", margin: "10px 0 0", color: "#cbd5e1" }}>Students Managed</p>
          </div>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <h2 style={{ fontSize: "48px", fontWeight: "800", margin: "0", color: "#7AC943" }}>99%</h2>
            <p style={{ fontSize: "18px", margin: "10px 0 0", color: "#cbd5e1" }}>Collection Rate</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          background: "#fff",
          padding: "100px 50px",
        }}
      >
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "42px", color: "#0b4f6c", fontWeight: "800", marginBottom: "15px" }}>Why Choose Web Mok?</h2>
            <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "700px", margin: "0 auto" }}>Everything you need to streamline your institution's financial operations in one beautifully designed platform.</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "30px",
            }}
          >
            {[
              { icon: "📊", title: "Smart Reports", desc: "Generate multi-dimensional financial reports with single click exports to Excel and PDF." },
              { icon: "💰", title: "Omnichannel Collection", desc: "Accept payments via cash, cards, UPI, and bank transfers with instant reconciliation." },
              { icon: "⚙️", title: "Flexible Structures", desc: "Create dynamic fee components, discounts, and late fee rules for specific courses." },
              { icon: "🔒", title: "Bank-Grade Security", desc: "Your data is encrypted and backed up daily. Role-based access ensures complete privacy." }
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  background: "#fff",
                  padding: "40px 30px",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,.05)",
                  border: "1px solid rgba(0,0,0,0.02)",
                  transition: "all 0.3s ease",
                  opacity: 0,
                  transform: "translateY(20px)",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,.05)"; }}
              >
                <div style={{ fontSize: "48px", marginBottom: "20px", background: "rgba(122, 201, 67, 0.1)", width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "16px" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "22px", color: "#0b4f6c", marginBottom: "15px", fontWeight: "700" }}>{feature.title}</h3>
                <p style={{ color: "#64748b", lineHeight: "1.7", fontSize: "16px" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "80px 50px", background: "linear-gradient(135deg, #7AC943 0%, #5ba82c 100%)", textAlign: "center", color: "#fff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "20px" }}>Ready to modernize your institution?</h2>
          <p style={{ fontSize: "20px", marginBottom: "40px", opacity: "0.9" }}>Join hundreds of schools and colleges that trust Web Mok.</p>
          <Link to="/signup" style={{ padding: "18px 45px", background: "#fff", color: "#0b4f6c", fontSize: "20px", fontWeight: "700", textDecoration: "none", borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", display: "inline-block", transition: "transform 0.3s" }} onMouseOver={(e) => e.target.style.transform = "scale(1.05)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"}>
            Start Free Trial
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          h1 { font-size: 42px !important; }
          .feature-card { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Index;