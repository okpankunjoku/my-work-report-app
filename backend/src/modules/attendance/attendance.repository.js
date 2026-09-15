const Attendance = require("../../models/Attendance");

// ==========================================
// Create Attendance
// ==========================================

const createAttendance = async (data) => {
  return await Attendance.create(data);
};

// ==========================================
// Get Today's Attendance
// ==========================================

const findTodayAttendance = async (
  employeeId,
  attendanceDate
) => {
  const startOfDay = new Date(attendanceDate);

  const endOfDay = new Date(attendanceDate);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return await Attendance.findOne({
    employee: employeeId,
    attendanceDate: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });
};

// ==========================================
// Update Attendance
// ==========================================

const updateAttendance = async (
  attendanceId,
  data
) => {
  return await Attendance.findByIdAndUpdate(
    attendanceId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// Attendance History
// ==========================================

const getAttendanceHistory = async (employeeId) => {
  const attendances = await Attendance.find({
    employee: employeeId,
  })
    .populate(
      "employee",
      "fullName employeeId department position"
    )
    .sort({
      attendanceDate: -1,
    });

  return processIncompleteAttendance(attendances);
};

// ==========================================
// Get All Attendance
// Admin / Management
// ==========================================

const getAllAttendance = async () => {
  const attendances = await Attendance.find()
    .populate(
      "employee",
      "fullName employeeId department position"
    )
    .sort({
      attendanceDate: -1,
    });

  return processIncompleteAttendance(attendances);
};

// ==========================================
// Mark Old Open Attendance as Incomplete
// ==========================================

const processIncompleteAttendance = (attendances) => {
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return attendances.map((attendance) => {
    const attendanceDate = new Date(
      attendance.attendanceDate
    );

    const attendanceDayStart = new Date(
      attendanceDate.getFullYear(),
      attendanceDate.getMonth(),
      attendanceDate.getDate()
    );

    // Previous day with no clock-out
    if (
      attendanceDayStart < todayStart &&
      !attendance.clockOut
    ) {
      attendance.status = "Incomplete";
      attendance.workingHours = 0;
    }

    return attendance;
  });
};

// ==========================================
// Export
// ==========================================

module.exports = {
  createAttendance,
  findTodayAttendance,
  updateAttendance,
  getAttendanceHistory,
  getAllAttendance,
};