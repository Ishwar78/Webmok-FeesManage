const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const studentRoutes = require("./routes/studentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

// Connect to database
connectDB();

app.use(cors());
app.use(express.json());

// Seed Admin User
const seedAdmin = async () => {
  try {
    let admin = await Admin.findOne({ email: "info@gmail.in" });
    if (!admin) {
      await Admin.create({
        email: "info@gmail.in",
        password: "webmok@#12398", // This will be hashed by the pre-save hook
      });
      console.log("Admin user seeded successfully");
    } else {
      // Force update password to ensure it's correct
      admin.password = "webmok@#12398";
      await admin.save();
      console.log("Admin user password reset successfully");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
seedAdmin();

const branchRoutes = require("./routes/branchRoutes");
const auditRoutes = require("./routes/auditRoutes");

// ...
// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/admin/students", studentRoutes);
app.use("/api/admin/clients", clientRoutes);
app.use("/api/admin/payments", paymentRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/branches", branchRoutes);
app.use("/api/admin/audit", auditRoutes);

app.get("/", (req, res) => {
  res.send("Fees Management Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});