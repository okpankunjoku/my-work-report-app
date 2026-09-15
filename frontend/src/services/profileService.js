import api from "./api";

// ==========================================
// Get logged-in employee profile
// ==========================================
export const getProfile = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};


// ==========================================
// Update logged-in employee profile
// ==========================================
export const updateProfile = async (profileData) => {
  const response = await api.put(
    "/employees/profile",
    profileData
  );

  return response.data;
};