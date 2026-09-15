const attendanceService = require("./attendance.service");
const successResponse = require("../../utils/successResponse");

// ==========================================
// EMPLOYEE - CLOCK IN
// ==========================================

const clockIn = async (req, res, next) => {
  try {
    const attendance =
      await attendanceService.clockIn(req.user);

    return successResponse(
      res,
      "Clock in successful.",
      attendance,
      201
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EMPLOYEE - CLOCK OUT
// ==========================================

const clockOut = async (req, res, next) => {
  try {
    const attendance =
      await attendanceService.clockOut(req.user);

    return successResponse(
      res,
      "Clock out successful.",
      attendance
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EMPLOYEE - GET TODAY'S ATTENDANCE
// ==========================================

const getTodayAttendance = async (
  req,
  res,
  next
) => {
  try {
    const attendance =
      await attendanceService.getTodayAttendance(
        req.user
      );

    return successResponse(
      res,
      "Today's attendance fetched successfully.",
      attendance
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EMPLOYEE - GET ATTENDANCE HISTORY
// ==========================================

const getAttendanceHistory = async (
  req,
  res,
  next
) => {
  try {
    const attendance =
      await attendanceService.getAttendanceHistory(
        req.user
      );

    return successResponse(
      res,
      "Attendance history fetched successfully.",
      attendance
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN - GET ALL ATTENDANCE
// ==========================================

const getAllAttendance = async (
  req,
  res,
  next
) => {
  try {
    const attendance =
      await attendanceService.getAllAttendance();

    return successResponse(
      res,
      "All attendance records fetched successfully.",
      attendance
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  clockIn,
  clockOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAllAttendance,
};