const attendanceRepository = require("../attendance/attendance.repository");
const reportRepository = require("../reports/report.repository");

const getEmployeeDashboard = async (employee) => {
  const employeeId = employee._id;

  // ==========================================
  // TODAY'S DATE
  // ==========================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ==========================================
  // TODAY'S ATTENDANCE
  // ==========================================

  const todayAttendance =
    await attendanceRepository.findTodayAttendance(
      employeeId,
      today
    );

  // ==========================================
  // TODAY'S REPORT
  // ==========================================

  const todayReport =
    await reportRepository.findTodayReport(
      employeeId,
      today
    );

  // ==========================================
  // ATTENDANCE HISTORY
  // ==========================================

  const attendanceHistory =
    await attendanceRepository.getAttendanceHistory(
      employeeId
    );

  // ==========================================
  // REPORT HISTORY
  // ==========================================

  const reportHistory =
    await reportRepository.getReportHistory(
      employeeId
    );

  // ==========================================
  // RECENT ATTENDANCE
  // ==========================================

  const recentAttendance =
    attendanceHistory.slice(0, 5);

  // ==========================================
  // RECENT REPORTS
  // ==========================================

  const recentReports =
    reportHistory.slice(0, 5);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalAttendanceDays =
    attendanceHistory.length;

  const totalReports =
    reportHistory.length;

  // ==========================================
  // TODAY'S ATTENDANCE DATA
  // ==========================================

  const clockIn =
    todayAttendance?.clockIn || null;

  const clockOut =
    todayAttendance?.clockOut || null;

  const workingHours =
    todayAttendance?.workingHours || 0;

  const attendanceStatus =
    todayAttendance?.status || "Not Clocked In";

  // ==========================================
  // TODAY'S REPORT STATUS
  // ==========================================

  const reportSubmitted =
    Boolean(todayReport);

  // ==========================================
  // BUILD RECENT ACTIVITIES
  // ==========================================

  const activities = [];

  // Today's clock-in activity

  if (clockIn) {
    activities.push({
      id: `clock-in-${todayAttendance._id}`,
      type: "attendance",
      title: "Clocked in",
      description: "You clocked in for today's workday.",
      date: clockIn,
      status: "success",
    });
  }

  // Today's clock-out activity

  if (clockOut) {
    activities.push({
      id: `clock-out-${todayAttendance._id}`,
      type: "attendance",
      title: "Clocked out",
      description: `You completed ${workingHours} working hours today.`,
      date: clockOut,
      status: "success",
    });
  }

  // Today's report activity

  if (todayReport) {
    activities.push({
      id: `report-${todayReport._id}`,
      type: "report",
      title: "Daily report submitted",
      description:
        "Your daily work report was submitted successfully.",
      date: todayReport.createdAt,
      status: "success",
    });
  }

  // Recent report activities

  recentReports.forEach((report) => {
    const alreadyAdded = activities.some(
      (activity) =>
        activity.id === `report-${report._id}`
    );

    if (!alreadyAdded) {
      activities.push({
        id: `report-${report._id}`,
        type: "report",
        title: "Work report submitted",
        description:
          report.workSummary ||
          "A daily work report was submitted.",
        date: report.createdAt || report.reportDate,
        status: "success",
      });
    }
  });

  // Recent attendance activities

  recentAttendance.forEach((attendance) => {
    if (attendance.clockIn) {
      const alreadyAdded = activities.some(
        (activity) =>
          activity.id ===
          `clock-in-${attendance._id}`
      );

      if (!alreadyAdded) {
        activities.push({
          id: `clock-in-${attendance._id}`,
          type: "attendance",
          title: "Attendance recorded",
          description:
            "Attendance was recorded successfully.",
          date: attendance.clockIn,
          status: "success",
        });
      }
    }

    if (attendance.clockOut) {
      const alreadyAdded = activities.some(
        (activity) =>
          activity.id ===
          `clock-out-${attendance._id}`
      );

      if (!alreadyAdded) {
        activities.push({
          id: `clock-out-${attendance._id}`,
          type: "attendance",
          title: "Workday completed",
          description: `Worked ${attendance.workingHours || 0} hours.`,
          date: attendance.clockOut,
          status: "success",
        });
      }
    }
  });

  // ==========================================
  // SORT ACTIVITIES BY DATE
  // ==========================================

  activities.sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
  );

  // Only show latest 8 activities

  const recentActivities =
    activities.slice(0, 8);

  // ==========================================
  // DASHBOARD RESPONSE
  // ==========================================

  return {
    // ========================================
    // EMPLOYEE INFORMATION
    // ========================================

    employee: {
      id: employee._id,
      fullName: employee.fullName,
      email: employee.email,
      employeeId: employee.employeeId,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      role: employee.role,
      status: employee.status,
      profileImage: employee.profileImage,
    },

    // ========================================
    // TODAY
    // ========================================

    today: {
      attendance: todayAttendance,

      report: todayReport,

      attendanceStatus,

      reportSubmitted,

      clockIn,

      clockOut,

      workingHours,
    },

    // ========================================
    // STATISTICS
    // ========================================

    statistics: {
      totalAttendanceDays,

      totalReports,

      reportsToday: reportSubmitted ? 1 : 0,

      attendanceToday: todayAttendance ? 1 : 0,

      workingHoursToday: workingHours,
    },

    // ========================================
    // RECENT DATA
    // ========================================

    recentAttendance,

    recentReports,

    // ========================================
    // FRONTEND-FRIENDLY STATS
    // ========================================

    stats: {
      reportsToday: reportSubmitted ? 1 : 0,

      attendance: attendanceStatus,

      totalAttendanceDays,

      totalReports,

      workingHoursToday: workingHours,

      clockedIn: Boolean(clockIn),

      clockedOut: Boolean(clockOut),
    },

    // ========================================
    // RECENT ACTIVITIES
    // ========================================

    activities: recentActivities,
  };
};

module.exports = {
  getEmployeeDashboard,
};