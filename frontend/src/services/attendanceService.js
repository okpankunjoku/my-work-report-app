import api from "./api";

/**
 * Clock In
 */
export const clockIn = async () => {
  const response = await api.post("/attendance/clock-in");

  return response.data;
};

/**
 * Clock Out
 */
export const clockOut = async () => {
  const response = await api.post("/attendance/clock-out");

  return response.data;
};

/**
 * Get Today's Attendance
 */
export const getTodayAttendance = async () => {
  const response = await api.get("/attendance/today");

  return response.data;
};

/**
 * Get Attendance History
 */
export const getAttendanceHistory = async () => {
  const response = await api.get("/attendance/history");

  return response.data;
};