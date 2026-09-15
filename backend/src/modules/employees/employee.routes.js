const express = require("express");

const router = express.Router();

const employeeController = require("./employee.controller");

const {
  protect,
  adminOnly,
} = require("../../middlewares/auth.middleware");

// ==========================================
// EMPLOYEE PROFILE
// ==========================================

router.get(
  "/profile",
  protect,
  employeeController.getProfile
);

router.put(
  "/profile",
  protect,
  employeeController.updateProfile
);

// ==========================================
// ADMIN - GET ALL EMPLOYEES
// ==========================================

router.get(
  "/",
  protect,
  adminOnly,
  employeeController.getAllEmployees
);

// ==========================================
// ADMIN - SEARCH
// ==========================================

router.get(
  "/search",
  protect,
  adminOnly,
  employeeController.searchEmployees
);

// ==========================================
// ADMIN - GET BY STATUS
// ==========================================

router.get(
  "/status/:status",
  protect,
  adminOnly,
  employeeController.getEmployeesByStatus
);

// ==========================================
// ADMIN - GET EMPLOYEE BY ID
// ==========================================

router.get(
  "/:id",
  protect,
  adminOnly,
  employeeController.getEmployeeById
);

// ==========================================
// ADMIN - UPDATE EMPLOYEE
// ==========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  employeeController.updateEmployee
);

// ==========================================
// ADMIN - UPDATE STATUS
// ==========================================

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  employeeController.updateEmployeeStatus
);

// ==========================================
// ADMIN - DELETE EMPLOYEE
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  employeeController.deleteEmployee
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;