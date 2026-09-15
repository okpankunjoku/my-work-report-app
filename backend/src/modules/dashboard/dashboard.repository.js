const Employee = require("../../models/Employee");
const Attendance = require("../../models/Attendance");
const Report = require("../../models/Report");

const getEmployeeById = async (id) => {
  return await Employee.findById(id).select("-password");
};

const getTodayAttendance = async (employeeId, attendanceDate) => {
  return await Attendance.findOne({
    employee: employeeId,
    attendanceDate,
  });
};

const getTodayReport = async (employeeId, reportDate) => {
  return await Report.findOne({
    employee: employeeId,
    reportDate,
  });
};

const getAttendanceCount = async (employeeId) => {
  return await Attendance.countDocuments({
    employee: employeeId,
  });
};

const getReportCount = async (employeeId) => {
  return await Report.countDocuments({
    employee: employeeId,
  });
};

module.exports = {
  getEmployeeById,
  getTodayAttendance,
  getTodayReport,
  getAttendanceCount,
  getReportCount,
};