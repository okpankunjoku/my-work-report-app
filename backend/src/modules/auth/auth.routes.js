const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const validate = require("../../middlewares/validate.middleware");
const { protect } = require("../../middlewares/auth.middleware");

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
} = require("./auth.validation");

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

// Get Logged-in Employee
router.get(
  "/me",
  protect,
  authController.getMe
);

module.exports = router;