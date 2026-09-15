const adminRepository = require("./admin.repository");

// ==========================================
// Get Nigeria Today's Date Range
// ==========================================

const getNigeriaDayRange = () => {
  // Nigeria uses UTC+1
  const NIGERIA_OFFSET = 60 * 60 * 1000;

  // Get current time in Nigeria
  const nigeriaNow = new Date(
    Date.now() + NIGERIA_OFFSET
  );

  // Get Nigeria calendar date
  const year = nigeriaNow.getUTCFullYear();
  const month = nigeriaNow.getUTCMonth();
  const day = nigeriaNow.getUTCDate();

  // Start of day in Nigeria
  const startOfDay = new Date(
    Date.UTC(
      year,
      month,
      day
    ) - NIGERIA_OFFSET
  );

  // Start of next day in Nigeria
  const endOfDay = new Date(
    Date.UTC(
      year,
      month,
      day + 1
    ) - NIGERIA_OFFSET
  );

  return {
    startOfDay,
    endOfDay,
  };
};

// ==========================================
// Get All Reports
// ==========================================

const getAllReports = async () => {
  return await adminRepository.getAllReports();
};

// ==========================================
// Get Admin Dashboard
// ==========================================

const getAdminDashboard = async () => {
  // ==========================================
  // Get Today's Nigeria Date Range
  // ==========================================

  const {
    startOfDay,
    endOfDay,
  } = getNigeriaDayRange();

  console.log("==================================");
  console.log("ADMIN DASHBOARD");
  console.log("Nigeria Start Of Day:", startOfDay);
  console.log("Nigeria End Of Day:", endOfDay);
  console.log("==================================");

  // ==========================================
  // Fetch Dashboard Data
  // ==========================================

  const [
    employeeStatistics,
    attendanceStatistics,
    reportStatistics,
    recentEmployees,
    recentReports,
    recentAttendance,
    recentActivities,
  ] = await Promise.all([
    adminRepository.getEmployeeStatistics(),

    adminRepository.getTodayAttendanceStatistics(
      startOfDay,
      endOfDay
    ),

    adminRepository.getTodayReportStatistics(
      startOfDay,
      endOfDay
    ),

    adminRepository.getRecentEmployees(),

    adminRepository.getRecentReports(),

    adminRepository.getRecentAttendance(),

    adminRepository.getRecentActivities(),
  ]);

  // ==========================================
  // Return Dashboard
  // ==========================================

  return {
    employees: employeeStatistics,

    attendance: attendanceStatistics,

    reports: reportStatistics,

    recentEmployees,

    recentReports,

    recentAttendance,

    recentActivities,
  };
};

// ==========================================
// Export
// ==========================================

module.exports = {
  getAdminDashboard,
  getAllReports,
};