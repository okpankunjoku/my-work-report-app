const reportService = require("./report.service");
const successResponse = require("../../utils/successResponse");

// ==========================================
// Submit Report
// ==========================================

const submitReport = async (req, res, next) => {
  try {
    const report = await reportService.submitReport(
      req.user,
      req.body
    );

    return successResponse(
      res,
      "Report submitted successfully.",
      report,
      201
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Today's Report
// ==========================================

const getTodayReport = async (req, res, next) => {
  try {
    const report =
      await reportService.getTodayReport(
        req.user
      );

    return successResponse(
      res,
      "Today's report fetched successfully.",
      report
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Report History
// ==========================================

const getReportHistory = async (req, res, next) => {
  try {
    const reports =
      await reportService.getReportHistory(
        req.user
      );

    return successResponse(
      res,
      "Report history fetched successfully.",
      reports
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Report By ID
// ==========================================

const getReportById = async (req, res, next) => {
  try {
    const report =
      await reportService.getReportById(
        req.user,
        req.params.id
      );

    return successResponse(
      res,
      "Report fetched successfully.",
      report
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  submitReport,
  getTodayReport,
  getReportHistory,
  getReportById,
};