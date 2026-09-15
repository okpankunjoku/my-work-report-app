import api from "./api";

// ==========================================
// Create Report
// ==========================================

export const createReport = async (report) => {
  const response = await api.post(
    "/reports",
    report
  );

  return response.data;
};

// ==========================================
// Get Report History
// ==========================================

export const getReports = async () => {
  const response = await api.get(
    "/reports/history"
  );

  return response.data;
};

// ==========================================
// Get Today's Report
// ==========================================

export const getTodayReport = async () => {
  const response = await api.get(
    "/reports/today"
  );

  return response.data;
};

// ==========================================
// Get Report By ID
// ==========================================

export const getReportById = async (id) => {
  const response = await api.get(
    `/reports/${id}`
  );

  return response.data;
};