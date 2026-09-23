const { body } = require("express-validator");

// ==========================================
// Register Validation
// ==========================================

const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),

  body("phone")
    .optional()
    .trim(),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),

  body("position")
    .trim()
    .notEmpty()
    .withMessage("Position is required"),
];

// ==========================================
// Login Validation
// ==========================================

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ==========================================
// Forgot Password Validation
// ==========================================

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

// ==========================================
// Reset Password Validation
// ==========================================

const resetPasswordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),
];

// ==========================================
// Export
// ==========================================

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};