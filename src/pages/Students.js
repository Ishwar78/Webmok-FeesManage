import React from "react";

function Students() {
  return (
    <div style={{ minHeight: "80vh", padding: "40px", background: "#f7f8fa" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <h1 style={{ color: "#0b4f6c", marginBottom: "20px", fontSize: "32px" }}>Students Directory</h1>
        <p style={{ color: "#666", fontSize: "18px", marginBottom: "30px" }}>Manage all your students from this central hub. View, add, edit, or remove student records.</p>
        
        {/* Placeholder for student list/table */}
        <div style={{ padding: "50px", textAlign: "center", border: "2px dashed #e2e8f0", borderRadius: "10px", color: "#94a3b8" }}>
          <h2>Student List Module</h2>
          <p>Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

export default Students;
