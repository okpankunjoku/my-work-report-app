const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth");
const attendanceRoutes = require("../modules/attendance");
const reportRoutes = require("../modules/reports");
const dashboardRoutes = require("../modules/dashboard");
const employeeRoutes = require("../modules/employees");
const notificationRoutes = require("../modules/notifications");
const adminRoutes = require("../modules/admin");

// ==========================================
// API HEALTH CHECK
// ==========================================

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running...",
  });
});

// ==========================================
// API ROUTES
// ==========================================

router.use("/auth", authRoutes);

router.use("/attendance", attendanceRoutes);

router.use("/reports", reportRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/employees", employeeRoutes);

router.use("/notifications", notificationRoutes);

// ==========================================
// ADMIN ROUTES
// ==========================================

router.use("/admin", adminRoutes);

module.exports = router;