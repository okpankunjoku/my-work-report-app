const dashboardService = require("./dashboard.service");
const successResponse = require("../../utils/successResponse");

const getEmployeeDashboard = async (req, res, next) => {
  try {
    const dashboard =
      await dashboardService.getEmployeeDashboard(
        req.user
      );

    return successResponse(
      res,
      "Dashboard data fetched successfully.",
      dashboard
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployeeDashboard,
};