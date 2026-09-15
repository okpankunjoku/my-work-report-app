import api from "./api";

// ==========================================
// Get Admin Dashboard
// ==========================================

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};