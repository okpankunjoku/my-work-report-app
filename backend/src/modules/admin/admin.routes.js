const express = require("express");

const router = express.Router();

const adminController = require("./admin.controller");

const {
  protect,
} = require("../../middlewares/auth.middleware");

// ==========================================
// Admin Dashboard
// ==========================================

// GET /api/v1/admin/dashboard
router.get(
  "/dashboard",
  protect,
  (req, res, next) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  },
  adminController.getAdminDashboard
);

// ==========================================
// Admin Reports
// ==========================================

// GET /api/v1/admin/reports
router.get(
  "/reports",
  protect,
  (req, res, next) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  },
  adminController.getAllReports
);

module.exports = router;