const employeeRepository = require("./employee.repository");

// ==========================================
// GET LOGGED-IN EMPLOYEE PROFILE
// ==========================================

const getProfile = async (employeeId) => {
  const employee =
    await employeeRepository.findById(employeeId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: employee._id,
    fullName: employee.fullName,
    email: employee.email,
    employeeId: employee.employeeId,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    role: employee.role,
    status: employee.status,
    profileImage: employee.profileImage || "",
  };
};

// ==========================================
// UPDATE LOGGED-IN EMPLOYEE PROFILE
// ==========================================

const updateProfile = async (employeeId, data) => {
  const allowedUpdates = {
    fullName: data.fullName,
    phone: data.phone,
    department: data.department,
    position: data.position,
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });

  const employee =
    await employeeRepository.updateProfile(
      employeeId,
      allowedUpdates
    );

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: employee._id,
    fullName: employee.fullName,
    email: employee.email,
    employeeId: employee.employeeId,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    role: employee.role,
    status: employee.status,
    profileImage: employee.profileImage || "",
  };
};

// ==========================================
// ADMIN - GET ALL EMPLOYEES
// ==========================================

const getAllEmployees = async () => {
  return await employeeRepository.findAll();
};

// ==========================================
// ADMIN - GET EMPLOYEES BY STATUS
// ==========================================

const getEmployeesByStatus = async (status) => {
  const allowedStatuses = [
    "Active",
    "Inactive",
    "Suspended",
  ];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid employee status.");
    error.statusCode = 400;
    throw error;
  }

  return await employeeRepository.findByStatus(status);
};

// ==========================================
// ADMIN - SEARCH EMPLOYEES
// ==========================================

const searchEmployees = async (search) => {
  if (!search || !search.trim()) {
    return await employeeRepository.findAll();
  }

  return await employeeRepository.searchEmployees(
    search.trim()
  );
};

// ==========================================
// ADMIN - GET EMPLOYEE BY ID
// ==========================================

const getEmployeeById = async (employeeId) => {
  const employee =
    await employeeRepository.findById(employeeId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

// ==========================================
// ADMIN - UPDATE EMPLOYEE
// ==========================================

const updateEmployee = async (employeeId, data) => {
  const allowedUpdates = {
    fullName: data.fullName,
    phone: data.phone,
    department: data.department,
    position: data.position,
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });

  if (Object.keys(allowedUpdates).length === 0) {
    const error = new Error(
      "No valid employee information provided."
    );

    error.statusCode = 400;
    throw error;
  }

  const employee =
    await employeeRepository.updateEmployee(
      employeeId,
      allowedUpdates
    );

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

// ==========================================
// ADMIN - UPDATE EMPLOYEE STATUS
// ==========================================

const updateEmployeeStatus = async (
  employeeId,
  status
) => {
  const allowedStatuses = [
    "Active",
    "Inactive",
    "Suspended",
  ];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid employee status.");
    error.statusCode = 400;
    throw error;
  }

  const employee =
    await employeeRepository.updateStatus(
      employeeId,
      status
    );

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

// ==========================================
// ADMIN - DELETE EMPLOYEE
// ==========================================

const deleteEmployee = async (employeeId) => {
  const employee =
    await employeeRepository.findById(employeeId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  // Prevent deleting an administrator
  if (
    employee.role &&
    employee.role.toLowerCase() === "admin"
  ) {
    const error = new Error(
      "Admin accounts cannot be deleted."
    );

    error.statusCode = 403;
    throw error;
  }

  const deletedEmployee =
    await employeeRepository.deleteEmployee(
      employeeId
    );

  if (!deletedEmployee) {
    const error = new Error(
      "Failed to delete employee."
    );

    error.statusCode = 500;
    throw error;
  }

  return {
    id: deletedEmployee._id,
    fullName: deletedEmployee.fullName,
    employeeId: deletedEmployee.employeeId,
    email: deletedEmployee.email,
  };
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getProfile,
  updateProfile,
  getAllEmployees,
  getEmployeesByStatus,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
};