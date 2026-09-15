const Employee = require("../../models/Employee");
const Attendance = require("../../models/Attendance");
const Report = require("../../models/Report");

// ==========================================
// Get Employee Statistics
// ==========================================

const getEmployeeStatistics = async () => {
  const totalEmployees =
    await Employee.countDocuments();

  const activeEmployees =
    await Employee.countDocuments({
      status: "Active",
    });

  const inactiveEmployees =
    await Employee.countDocuments({
      status: "Inactive",
    });

  const suspendedEmployees =
    await Employee.countDocuments({
      status: "Suspended",
    });

  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    suspendedEmployees,
  };
};

// ==========================================
// Get Today's Attendance Statistics
// ==========================================

const getTodayAttendanceStatistics = async (
  startOfDay,
  endOfDay
) => {
  const totalActiveEmployees =
    await Employee.countDocuments({
      status: "Active",
    });

  const presentToday =
    await Attendance.countDocuments({
      attendanceDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "Present",
    });

  const absentToday = Math.max(
    totalActiveEmployees - presentToday,
    0
  );

  const attendanceRate =
    totalActiveEmployees > 0
      ? Number(
          (
            (presentToday /
              totalActiveEmployees) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    presentToday,
    absentToday,
    attendanceRate,
  };
};

// ==========================================
// Get Today's Report Statistics
// ==========================================

const getTodayReportStatistics = async (
  startOfDay,
  endOfDay
) => {
  const reportsSubmittedToday =
    await Report.countDocuments({
      reportDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

  const totalActiveEmployees =
    await Employee.countDocuments({
      status: "Active",
    });

  const reportsPendingToday = Math.max(
    totalActiveEmployees -
      reportsSubmittedToday,
    0
  );

  return {
    reportsSubmittedToday,
    reportsPendingToday,
  };
};

// ==========================================
// Get Recent Employees
// ==========================================

const getRecentEmployees = async () => {
  return await Employee.find()
    .select(
      "fullName employeeId email department position role status createdAt"
    )
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
};

// ==========================================
// Get Recent Reports
// ==========================================

const getRecentReports = async () => {
  return await Report.find()
    .populate(
      "employee",
      "fullName employeeId department"
    )
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
};

// ==========================================
// Get All Reports
// ==========================================

const getAllReports = async () => {
  return await Report.find()
    .populate(
      "employee",
      "fullName employeeId email department position"
    )
    .sort({
      reportDate: -1,
      createdAt: -1,
    })
    .lean();
};

// ==========================================
// Get Recent Attendance
// ==========================================

const getRecentAttendance = async () => {
  const attendances = await Attendance.find()
    .populate(
      "employee",
      "fullName employeeId department"
    )
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // ==========================================
  // Nigeria uses UTC+1
  // ==========================================

  const NIGERIA_OFFSET = 60 * 60 * 1000;

  const nigeriaNow = new Date(
    Date.now() + NIGERIA_OFFSET
  );

  const nigeriaYear =
    nigeriaNow.getUTCFullYear();

  const nigeriaMonth =
    nigeriaNow.getUTCMonth();

  const nigeriaDay =
    nigeriaNow.getUTCDate();

  // Start of today in Nigeria
  const todayStart = new Date(
    Date.UTC(
      nigeriaYear,
      nigeriaMonth,
      nigeriaDay
    ) - NIGERIA_OFFSET
  );

  // ==========================================
  // Mark Previous Open Attendance as Incomplete
  // ==========================================

  return attendances.map((attendance) => {
    const attendanceDate = new Date(
      attendance.attendanceDate
    );

    if (
      attendanceDate < todayStart &&
      !attendance.clockOut
    ) {
      attendance.status = "Incomplete";
      attendance.workingHours = 0;
    }

    return attendance;
  });
};

// ==========================================
// Get Recent Admin Activities
// ==========================================

const getRecentActivities = async () => {
  const [
    recentAttendance,
    recentReports,
  ] = await Promise.all([
    Attendance.find()
      .select(
        "employee clockIn clockOut createdAt"
      )
      .populate(
        "employee",
        "fullName employeeId department"
      )
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    Report.find()
      .select(
        "employee reportDate createdAt"
      )
      .populate(
        "employee",
        "fullName employeeId department"
      )
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const activities = [];

  // ==========================================
  // Attendance Activities
  // ==========================================

  recentAttendance.forEach(
    (attendance) => {
      if (!attendance.employee) return;

      // Clock-in
      if (attendance.clockIn) {
        activities.push({
          type: "clock-in",
          employee: attendance.employee,
          message: `${attendance.employee.fullName} clocked in`,
          timestamp: attendance.clockIn,
        });
      }

      // Clock-out
      if (attendance.clockOut) {
        activities.push({
          type: "clock-out",
          employee: attendance.employee,
          message: `${attendance.employee.fullName} clocked out`,
          timestamp: attendance.clockOut,
        });
      }
    }
  );

  // ==========================================
  // Report Activities
  // ==========================================

  recentReports.forEach((report) => {
    if (!report.employee) return;

    activities.push({
      type: "report",
      employee: report.employee,
      message: `${report.employee.fullName} submitted a report`,
      timestamp:
        report.createdAt ||
        report.reportDate,
    });
  });

  // ==========================================
  // Sort Newest First
  // ==========================================

  activities.sort(
    (a, b) =>
      new Date(b.timestamp) -
      new Date(a.timestamp)
  );

  // ==========================================
  // Return Latest 10 Activities
  // ==========================================

  return activities.slice(0, 10);
};

// ==========================================
// Export
// ==========================================

module.exports = {
  getEmployeeStatistics,
  getTodayAttendanceStatistics,
  getTodayReportStatistics,
  getRecentEmployees,
  getRecentReports,
  getAllReports,
  getRecentAttendance,
  getRecentActivities,
};