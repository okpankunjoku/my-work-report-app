const express = require("express");

const router = express.Router();

const reportController = require("./report.controller");

const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const {
  submitReportValidation,
} = require("./report.validation");

// ==========================================
// Submit Report
// POST /api/v1/reports
// ==========================================

router.post(
  "/",
  protect,
  submitReportValidation,
  validate,
  reportController.submitReport
);

// ==========================================
// Get Today's Report
// GET /api/v1/reports/today
// ==========================================

router.get(
  "/today",
  protect,
  reportController.getTodayReport
);

// ==========================================
// Get Report History
// GET /api/v1/reports/history
// ==========================================

router.get(
  "/history",
  protect,
  reportController.getReportHistory
);

// ==========================================
// Get Report By ID
// GET /api/v1/reports/:id
// ==========================================

router.get(
  "/:id",
  protect,
  reportController.getReportById
);

module.exports = router;