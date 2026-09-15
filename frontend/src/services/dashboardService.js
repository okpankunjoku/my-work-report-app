import api from "./api";


// ==========================================
// Get Employee Dashboard
// ==========================================
export const getDashboard = async () => {
  const response = await api.get(
    "/dashboard/employee"
  );

  return response.data;
};