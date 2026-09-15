const express = require("express");

const router = express.Router();

const attendanceController = require("./attendance.controller");

const {
  protect,
  adminOnly,
} = require("../../middlewares/auth.middleware");

const validate = require("../../middlewares/validate.middleware");

const {
  clockInValidation,
  clockOutValidation,
} = require("./attendance.validation");

// ==========================================
// EMPLOYEE - CLOCK IN
// ==========================================

router.post(
  "/clock-in",
  protect,
  clockInValidation,
  validate,
  attendanceController.clockIn
);

// ==========================================
// EMPLOYEE - CLOCK OUT
// ==========================================

router.post(
  "/clock-out",
  protect,
  clockOutValidation,
  validate,
  attendanceController.clockOut
);

// ==========================================
// EMPLOYEE - TODAY'S ATTENDANCE
// ==========================================

router.get(
  "/today",
  protect,
  attendanceController.getTodayAttendance
);

// ==========================================
// EMPLOYEE - ATTENDANCE HISTORY
// ==========================================

router.get(
  "/history",
  protect,
  attendanceController.getAttendanceHistory
);

// ==========================================
// ADMIN - GET ALL ATTENDANCE
// ==========================================

router.get(
  "/all",
  protect,
  adminOnly,
  attendanceController.getAllAttendance
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;