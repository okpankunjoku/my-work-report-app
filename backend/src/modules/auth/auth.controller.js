const authService = require("./auth.service");
const successResponse = require("../../utils/successResponse");

// ==========================================
// Register
// ==========================================

const register = async (req, res, next) => {
  try {
    const result = await authService.register(
      req.body
    );

    return successResponse(
      res,
      "Employee registered successfully.",
      result,
      201
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Login
// ==========================================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(
      email,
      password
    );

    return successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Forgot Password
// ==========================================

const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    return successResponse(
      res,
      "If an account with that email exists, a password reset link has been sent."
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Reset Password
// ==========================================

const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result =
      await authService.resetPassword(
        token,
        password
      );

    return successResponse(
      res,
      result.message
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Logged-in Employee
// ==========================================

const getMe = async (req, res, next) => {
  try {
    const employee =
      await authService.getMe(
        req.user._id
      );

    return successResponse(
      res,
      "Employee fetched successfully.",
      employee
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
};