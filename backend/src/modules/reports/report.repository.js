const Report = require("../../models/Report");

// ==========================================
// Create Report
// ==========================================

const createReport = async (reportData) => {
  return await Report.create(reportData);
};

// ==========================================
// Find Today's Report
// ==========================================

const findTodayReport = async (employeeId, reportDate) => {
  const startOfDay = new Date(reportDate);

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(reportDate);

  endOfDay.setHours(23, 59, 59, 999);

  return await Report.findOne({
    employee: employeeId,
    reportDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
};

// ==========================================
// Find Report By ID
// ==========================================

const findById = async (id) => {
  return await Report.findById(id);
};

// ==========================================
// Update Report
// ==========================================

const updateReport = async (id, data) => {
  return await Report.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// Delete Report
// ==========================================

const deleteReport = async (id) => {
  return await Report.findByIdAndDelete(id);
};

// ==========================================
// Report History
// ==========================================

const getReportHistory = async (employeeId) => {
  return await Report.find({
    employee: employeeId,
  }).sort({
    reportDate: -1,
  });
};

// ==========================================
// Export
// ==========================================

module.exports = {
  createReport,
  findTodayReport,
  findById,
  updateReport,
  deleteReport,
  getReportHistory,
};