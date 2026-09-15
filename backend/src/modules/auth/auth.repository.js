const Employee = require("../../models/Employee");

// Find employee by email
const findByEmail = async (email) => {
  const employee = await Employee.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  console.log("==================================");
  console.log("LOGIN EMPLOYEE CHECK");
  console.log("Email:", email);
  console.log("Employee found:", !!employee);
  console.log("Employee ID:", employee?._id);
  console.log("Password exists:", !!employee?.password);
  console.log("Password type:", typeof employee?.password);
  console.log("==================================");

  return employee;
};

// Find employee by Employee ID
const findByEmployeeId = async (employeeId) => {
  return await Employee.findOne({
    employeeId: employeeId.trim(),
  });
};

// Create employee
const createEmployee = async (employeeData) => {
  return await Employee.create(employeeData);
};

// Find employee by ID
const findById = async (id) => {
  return await Employee.findById(id);
};

// Update last login
const updateLastLogin = async (id) => {
  return await Employee.findByIdAndUpdate(
    id,
    {
      lastLogin: new Date(),
    },
    {
      new: true,
    }
  );
};

module.exports = {
  findByEmail,
  findByEmployeeId,
  createEmployee,
  findById,
  updateLastLogin,
};