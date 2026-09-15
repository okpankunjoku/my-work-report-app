const employeeService = require("./employee.service");

// ==========================================
// GET LOGGED-IN EMPLOYEE PROFILE
// ==========================================

const getProfile = async (req, res, next) => {
  try {
    const employee =
      await employeeService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: "Employee profile fetched successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE LOGGED-IN EMPLOYEE PROFILE
// ==========================================

const updateProfile = async (req, res, next) => {
  try {
    const employee =
      await employeeService.updateProfile(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Employee profile updated successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - GET ALL EMPLOYEES
// ==========================================

const getAllEmployees = async (req, res, next) => {
  try {
    const employees =
      await employeeService.getAllEmployees();

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully.",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - GET EMPLOYEES BY STATUS
// ==========================================

const getEmployeesByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;

    const employees =
      await employeeService.getEmployeesByStatus(status);

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully.",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - SEARCH EMPLOYEES
// ==========================================

const searchEmployees = async (req, res, next) => {
  try {
    const { q } = req.query;

    const employees =
      await employeeService.searchEmployees(q);

    res.status(200).json({
      success: true,
      message: "Employee search completed successfully.",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - GET EMPLOYEE BY ID
// ==========================================

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee =
      await employeeService.getEmployeeById(id);

    res.status(200).json({
      success: true,
      message: "Employee retrieved successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - UPDATE EMPLOYEE
// ==========================================

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee =
      await employeeService.updateEmployee(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - UPDATE EMPLOYEE STATUS
// ==========================================

const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const employee =
      await employeeService.updateEmployeeStatus(
        id,
        status
      );

    res.status(200).json({
      success: true,
      message: "Employee status updated successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - DELETE EMPLOYEE
// ==========================================

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee =
      await employeeService.deleteEmployee(id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
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