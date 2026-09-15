const adminService = require("./admin.service");
const successResponse = require("../../utils/successResponse");

// ==========================================
// Get Admin Dashboard
// ==========================================

// ==========================================
// Get All Reports
// ==========================================

const getAllReports = async (
  req,
  res,
  next
) => {
  try {
    const reports =
      await adminService.getAllReports();

    return successResponse(
      res,
      "Admin reports retrieved successfully.",
      reports
    );
  } catch (error) {
    next(error);
  }
};

const getAdminDashboard = async (
  req,
  res,
  next
) => {
  try {
    const dashboard =
      await adminService.getAdminDashboard();

    return successResponse(
      res,
      "Admin dashboard data retrieved successfully.",
      dashboard
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  getAdminDashboard,
  getAllReports,
};