const authService = require("./auth.service");
const successResponse = require("../../utils/successResponse");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res) => {
  return successResponse(
    res,
    "Forgot password feature coming soon."
  );
};

const getMe = async (req, res, next) => {
  try {
    const employee = await authService.getMe(req.user._id);

    return successResponse(
      res,
      "Employee fetched successfully.",
      employee
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  getMe,
};