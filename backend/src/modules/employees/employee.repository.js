const Employee = require("../../models/Employee");

// ==========================================
// FIND EMPLOYEE BY ID
// ==========================================

const findById = async (employeeId) => {
  return await Employee.findById(employeeId).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
};

// ==========================================
// FIND ALL EMPLOYEES
// ==========================================

const findAll = async () => {
  return await Employee.find()
    .select(
      "-password -resetPasswordToken -resetPasswordExpires"
    )
    .sort({ createdAt: -1 });
};

// ==========================================
// FIND EMPLOYEES BY STATUS
// ==========================================

const findByStatus = async (status) => {
  return await Employee.find({ status })
    .select(
      "-password -resetPasswordToken -resetPasswordExpires"
    )
    .sort({ createdAt: -1 });
};

// ==========================================
// SEARCH EMPLOYEES
// ==========================================

const searchEmployees = async (search) => {
  const regex = new RegExp(search, "i");

  return await Employee.find({
    $or: [
      { fullName: regex },
      { email: regex },
      { employeeId: regex },
      { department: regex },
      { position: regex },
    ],
  })
    .select(
      "-password -resetPasswordToken -resetPasswordExpires"
    )
    .sort({ createdAt: -1 });
};

// ==========================================
// UPDATE LOGGED-IN EMPLOYEE PROFILE
// ==========================================

const updateProfile = async (
  employeeId,
  updateData
) => {
  return await Employee.findByIdAndUpdate(
    employeeId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
};

// ==========================================
// ADMIN - UPDATE EMPLOYEE
// ==========================================

const updateEmployee = async (
  employeeId,
  updateData
) => {
  return await Employee.findByIdAndUpdate(
    employeeId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
};

// ==========================================
// UPDATE EMPLOYEE STATUS
// ==========================================

const updateStatus = async (
  employeeId,
  status
) => {
  return await Employee.findByIdAndUpdate(
    employeeId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
};

// ==========================================
// DELETE EMPLOYEE
// ==========================================

const deleteEmployee = async (employeeId) => {
  return await Employee.findByIdAndDelete(
    employeeId
  ).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  findById,
  findAll,
  findByStatus,
  searchEmployees,
  updateProfile,
  updateEmployee,
  updateStatus,
  deleteEmployee,
};