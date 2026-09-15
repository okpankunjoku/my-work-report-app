const express = require("express");

const router = express.Router();

const dashboardController = require("./dashboard.controller");
const { protect } = require("../../middlewares/auth.middleware");

// Employee Dashboard
router.get(
  "/",
  protect,
  dashboardController.getEmployeeDashboard
);

module.exports = router;