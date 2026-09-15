const AppError = require("../utils/AppError");

// ==========================================
// Admin / Management Access Middleware
// ==========================================

const adminOnly = (req, res, next) => {
  try {
    // ==========================================
    // Make Sure Employee Is Authenticated
    // ==========================================

    if (!req.user) {
      throw new AppError(
        "Not authorized. Please login first.",
        401
      );
    }

    // ==========================================
    // Check Role
    // ==========================================

    const allowedRoles = ["Admin", "Manager"];

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "Access denied. Admin or Manager privileges required.",
        403
      );
    }

    // ==========================================
    // Continue
    // ==========================================

    next();
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Admin Only
// ==========================================

const adminOnlyStrict = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Not authorized. Please login first.",
        401
      );
    }

    if (req.user.role !== "Admin") {
      throw new AppError(
        "Access denied. Administrator privileges required.",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminOnly,
  adminOnlyStrict,
};