const AppError = require("../../utils/AppError");

const authRepository = require("./auth.repository");

const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("./auth.utils");

// ==========================================
// Register
// ==========================================

const register = async (data) => {
  const {
    fullName,
    employeeId,
    email,
    password,
    phone,
    department,
    position,
  } = data;

  // ==========================================
  // Check Existing Email
  // ==========================================

  const existingEmail =
    await authRepository.findByEmail(email);

  if (existingEmail) {
    throw new AppError(
      "Email already exists.",
      409
    );
  }

  // ==========================================
  // Check Existing Employee ID
  // ==========================================

  const existingEmployee =
    await authRepository.findByEmployeeId(
      employeeId
    );

  if (existingEmployee) {
    throw new AppError(
      "Employee ID already exists.",
      409
    );
  }

  // ==========================================
  // Hash Password
  // ==========================================

  const hashedPassword =
    await hashPassword(password);

  // ==========================================
  // Create Employee
  // ==========================================

  const employee =
    await authRepository.createEmployee({
      fullName,
      employeeId,
      email,
      password: hashedPassword,
      phone,
      department,
      position,

      // IMPORTANT:
      // Public registration can only create
      // normal Employees.
      role: "Employee",

      status: "Active",
    });

  // ==========================================
  // Generate Token
  // ==========================================

  const token = generateToken(employee);

  // ==========================================
  // Return
  // ==========================================

  return {
    employee,
    token,
  };
};

// ==========================================
// Login
// ==========================================

const login = async (email, password) => {
  const employee =
    await authRepository.findByEmail(email);

  if (!employee) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  // ==========================================
  // Check Account Status
  // ==========================================

  if (employee.status !== "Active") {
    throw new AppError(
      `Your account is ${employee.status.toLowerCase()}. Please contact the administrator.`,
      403
    );
  }

  // ==========================================
  // Compare Password
  // ==========================================

  const isMatch =
    await comparePassword(
      password,
      employee.password
    );

  if (!isMatch) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  // ==========================================
  // Update Last Login
  // ==========================================

  await authRepository.updateLastLogin(
    employee._id
  );

  // ==========================================
  // Generate Token
  // ==========================================

  const token = generateToken(employee);

  // ==========================================
  // Remove Password From Response
  // ==========================================

  employee.password = undefined;

  // ==========================================
  // Return Login Data
  // ==========================================

  return {
    employee,
    token,
  };
};

// ==========================================
// Get Current Employee
// ==========================================

const getMe = async (id) => {
  const employee =
    await authRepository.findById(id);

  if (!employee) {
    throw new AppError(
      "Employee not found.",
      404
    );
  }

  return employee;
};

// ==========================================
// Export
// ==========================================

module.exports = {
  register,
  login,
  getMe,
};