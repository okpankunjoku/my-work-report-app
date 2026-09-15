const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const AppError = require("../utils/AppError");

// ==========================================
// PROTECT ROUTES
// ==========================================

const protect = async (req, res, next) => {
  try {
    // ==========================================
    // Get Authorization Header
    // ==========================================

    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      throw new AppError(
        "Not authorized. Please provide a valid token.",
        401
      );
    }

    // ==========================================
    // Extract Token
    // ==========================================

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError(
        "Not authorized. Please provide a valid token.",
        401
      );
    }

    // ==========================================
    // Verify Token
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================
    // Find Employee
    // ==========================================

    const employee = await Employee.findById(
      decoded.id
    );

    if (!employee) {
      throw new AppError(
        "Employee not found.",
        401
      );
    }

    // ==========================================
    // Attach Employee To Request
    // ==========================================

    req.user = employee;

    next();
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN ONLY
// ==========================================

const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Not authorized.",
        401
      );
    }

    if (req.user.role !== "Admin") {
      throw new AppError(
        "Access denied. Admin privileges required.",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  protect,
  adminOnly,
};