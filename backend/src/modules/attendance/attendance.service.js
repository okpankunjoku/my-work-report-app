const AppError = require("../../utils/AppError");
const attendanceRepository = require("./attendance.repository");
const notificationService = require("../notifications/notification.service");
const { sendEmail } = require("../../services/email.service");

// ==========================================
// CLOCK IN
// ==========================================

const clockIn = async (employee) => {
  const attendanceDate = new Date();

  attendanceDate.setHours(0, 0, 0, 0);

  console.log("==================================");
  console.log("Clock In Request");
  console.log("Employee ID:", employee._id);
  console.log("Attendance Date:", attendanceDate);

  // ==========================================
  // CHECK EXISTING ATTENDANCE
  // ==========================================

  const existingAttendance =
    await attendanceRepository.findTodayAttendance(
      employee._id,
      attendanceDate
    );

  console.log(
    "Existing Attendance:",
    existingAttendance
  );

  if (existingAttendance) {
    throw new AppError(
      "You have already clocked in today.",
      400
    );
  }

  // ==========================================
  // CREATE ATTENDANCE
  // ==========================================

  const clockInTime = new Date();

  const attendance =
    await attendanceRepository.createAttendance({
      employee: employee._id,
      attendanceDate,
      clockIn: clockInTime,
      status: "Present",
    });

  console.log(
    "Attendance Created:",
    attendance
  );

  // ==========================================
  // CREATE IN-APP NOTIFICATION
  // ==========================================

  try {
    await notificationService.createNotification(
      employee._id,
      {
        title: "Clock-in successful",
        message:
          "Your attendance has been recorded successfully. Have a productive workday!",
        type: "attendance",
      }
    );

    console.log(
      "Clock-in notification created."
    );
  } catch (notificationError) {
    console.error(
      "Clock-in notification error:",
      notificationError.message
    );
  }

  // ==========================================
  // SEND EMAIL TO EMPLOYEE
  // ==========================================

  try {
    if (employee.email) {
      await sendEmail({
        to: employee.email,
        subject: "Clock-in Successful - ClockIn Pro",

        text: `Hello ${employee.fullName || "Employee"},

Your clock-in has been recorded successfully.

Date: ${clockInTime.toLocaleDateString()}
Time: ${clockInTime.toLocaleTimeString()}
Status: Present

Have a productive workday!

ClockIn Pro
Workforce Productivity & Daily Reporting System`,

        html: `
          <div style="font-family: Arial, sans-serif; background-color: #eff6ff; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 30px;">

              <h2 style="color: #1d4ed8; margin-top: 0;">
                Clock-in Successful
              </h2>

              <p style="color: #1f2937;">
                Hello <strong>${employee.fullName || "Employee"}</strong>,
              </p>

              <p style="color: #374151;">
                Your clock-in has been recorded successfully.
              </p>

              <div style="background-color: #bfdbfe; padding: 15px; border-radius: 8px; margin: 20px 0;">

                <p style="margin: 5px 0;">
                  <strong>Date:</strong>
                  ${clockInTime.toLocaleDateString()}
                </p>

                <p style="margin: 5px 0;">
                  <strong>Time:</strong>
                  ${clockInTime.toLocaleTimeString()}
                </p>

                <p style="margin: 5px 0;">
                  <strong>Status:</strong>
                  <span style="color: #15803d; font-weight: bold;">
                    Present
                  </span>
                </p>

              </div>

              <p style="color: #374151;">
                Have a productive workday!
              </p>

              <p style="color: #1d4ed8; font-weight: bold;">
                ClockIn Pro
              </p>

              <p style="color: #6b7280; font-size: 12px;">
                Workforce Productivity & Daily Reporting System
              </p>

            </div>
          </div>
        `,
      });

      console.log(
        `📧 Clock-in email sent successfully to ${employee.email}`
      );
    } else {
      console.log(
        "⚠️ Employee email address not available. Clock-in email skipped."
      );
    }
  } catch (emailError) {
    console.error(
      "❌ Employee clock-in email error:",
      emailError.message
    );
  }

  // ==========================================
  // SEND EMAIL TO ADMIN
  // ==========================================

  try {
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Employee Clocked In - ${employee.fullName || "Employee"}`,

        text: `Hello Admin,

An employee has clocked in.

Employee: ${employee.fullName || "Unknown"}
Employee ID: ${employee.employeeId || employee._id}
Email: ${employee.email || "Not available"}
Department: ${employee.department || "Not specified"}
Position: ${employee.position || "Not specified"}

Date: ${clockInTime.toLocaleDateString()}
Time: ${clockInTime.toLocaleTimeString()}
Status: Present

ClockIn Pro
Workforce Productivity & Daily Reporting System`,

        html: `
          <div style="font-family: Arial, sans-serif; background-color: #eff6ff; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 30px;">

              <h2 style="color: #1d4ed8; margin-top: 0;">
                Employee Clocked In
              </h2>

              <p style="color: #374151;">
                An employee has successfully clocked in.
              </p>

              <div style="background-color: #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">

                <p style="margin: 7px 0;">
                  <strong>Employee:</strong>
                  ${employee.fullName || "Unknown"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Employee ID:</strong>
                  ${employee.employeeId || employee._id}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Email:</strong>
                  ${employee.email || "Not available"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Department:</strong>
                  ${employee.department || "Not specified"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Position:</strong>
                  ${employee.position || "Not specified"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Date:</strong>
                  ${clockInTime.toLocaleDateString()}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Clock-in Time:</strong>
                  ${clockInTime.toLocaleTimeString()}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Status:</strong>
                  <span style="color: #15803d; font-weight: bold;">
                    Present
                  </span>
                </p>

              </div>

              <p style="color: #1d4ed8; font-weight: bold;">
                ClockIn Pro
              </p>

              <p style="color: #6b7280; font-size: 12px;">
                Workforce Productivity & Daily Reporting System
              </p>

            </div>
          </div>
        `,
      });

      console.log(
        `📧 Admin clock-in email sent successfully to ${process.env.ADMIN_EMAIL}`
      );
    } else {
      console.log(
        "⚠️ ADMIN_EMAIL is not configured. Admin clock-in email skipped."
      );
    }
  } catch (emailError) {
    console.error(
      "❌ Admin clock-in email error:",
      emailError.message
    );
  }

  console.log("==================================");

  return attendance;
};

// ==========================================
// CLOCK OUT
// ==========================================

const clockOut = async (employee) => {
  const attendanceDate = new Date();

  attendanceDate.setHours(0, 0, 0, 0);

  console.log("==================================");
  console.log("Clock Out Request");
  console.log("Employee ID:", employee._id);
  console.log("Attendance Date:", attendanceDate);

  // ==========================================
  // FIND TODAY'S ATTENDANCE
  // ==========================================

  const attendance =
    await attendanceRepository.findTodayAttendance(
      employee._id,
      attendanceDate
    );

  console.log(
    "Today's Attendance:",
    attendance
  );

  if (!attendance) {
    throw new AppError(
      "You have not clocked in today.",
      400
    );
  }

  if (attendance.clockOut) {
    throw new AppError(
      "You have already clocked out today.",
      400
    );
  }

  // ==========================================
  // CALCULATE WORKING HOURS
  // ==========================================

  const clockOutTime = new Date();

  const workingHours =
    (clockOutTime - attendance.clockIn) /
    (1000 * 60 * 60);

  const formattedWorkingHours = Number(
    workingHours.toFixed(2)
  );

  // ==========================================
  // UPDATE ATTENDANCE
  // ==========================================

  const updatedAttendance =
    await attendanceRepository.updateAttendance(
      attendance._id,
      {
        clockOut: clockOutTime,
        workingHours: formattedWorkingHours,
      }
    );

  console.log(
    "Updated Attendance:",
    updatedAttendance
  );

  // ==========================================
  // CREATE IN-APP NOTIFICATION
  // ==========================================

  try {
    await notificationService.createNotification(
      employee._id,
      {
        title: "Clock-out successful",
        message: `Your workday has ended. You worked for ${formattedWorkingHours} hours today.`,
        type: "attendance",
      }
    );

    console.log(
      "Clock-out notification created."
    );
  } catch (notificationError) {
    console.error(
      "Clock-out notification error:",
      notificationError.message
    );
  }

  // ==========================================
  // SEND EMAIL TO EMPLOYEE
  // ==========================================

  try {
    if (employee.email) {
      await sendEmail({
        to: employee.email,
        subject: "Clock-out Successful - ClockIn Pro",

        text: `Hello ${employee.fullName || "Employee"},

Your clock-out has been recorded successfully.

Date: ${clockOutTime.toLocaleDateString()}
Clock-out Time: ${clockOutTime.toLocaleTimeString()}
Working Hours: ${formattedWorkingHours} hours

Thank you for your work today.

ClockIn Pro
Workforce Productivity & Daily Reporting System`,

        html: `
          <div style="font-family: Arial, sans-serif; background-color: #eff6ff; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 30px;">

              <h2 style="color: #1d4ed8; margin-top: 0;">
                Clock-out Successful
              </h2>

              <p style="color: #1f2937;">
                Hello <strong>${employee.fullName || "Employee"}</strong>,
              </p>

              <p style="color: #374151;">
                Your clock-out has been recorded successfully.
              </p>

              <div style="background-color: #bfdbfe; padding: 15px; border-radius: 8px; margin: 20px 0;">

                <p style="margin: 5px 0;">
                  <strong>Date:</strong>
                  ${clockOutTime.toLocaleDateString()}
                </p>

                <p style="margin: 5px 0;">
                  <strong>Clock-out Time:</strong>
                  ${clockOutTime.toLocaleTimeString()}
                </p>

                <p style="margin: 5px 0;">
                  <strong>Working Hours:</strong>
                  ${formattedWorkingHours} hours
                </p>

              </div>

              <p style="color: #374151;">
                Thank you for your work today.
              </p>

              <p style="color: #1d4ed8; font-weight: bold;">
                ClockIn Pro
              </p>

              <p style="color: #6b7280; font-size: 12px;">
                Workforce Productivity & Daily Reporting System
              </p>

            </div>
          </div>
        `,
      });

      console.log(
        `📧 Clock-out email sent successfully to ${employee.email}`
      );
    } else {
      console.log(
        "⚠️ Employee email address not available. Clock-out email skipped."
      );
    }
  } catch (emailError) {
    console.error(
      "❌ Employee clock-out email error:",
      emailError.message
    );
  }

  // ==========================================
  // SEND EMAIL TO ADMIN
  // ==========================================

  try {
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Employee Clocked Out - ${employee.fullName || "Employee"}`,

        text: `Hello Admin,

An employee has clocked out.

Employee: ${employee.fullName || "Unknown"}
Employee ID: ${employee.employeeId || employee._id}
Email: ${employee.email || "Not available"}
Department: ${employee.department || "Not specified"}
Position: ${employee.position || "Not specified"}

Date: ${clockOutTime.toLocaleDateString()}
Clock-out Time: ${clockOutTime.toLocaleTimeString()}
Working Hours: ${formattedWorkingHours} hours

ClockIn Pro
Workforce Productivity & Daily Reporting System`,

        html: `
          <div style="font-family: Arial, sans-serif; background-color: #eff6ff; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 30px;">

              <h2 style="color: #1d4ed8; margin-top: 0;">
                Employee Clocked Out
              </h2>

              <p style="color: #374151;">
                An employee has successfully clocked out.
              </p>

              <div style="background-color: #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">

                <p style="margin: 7px 0;">
                  <strong>Employee:</strong>
                  ${employee.fullName || "Unknown"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Employee ID:</strong>
                  ${employee.employeeId || employee._id}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Email:</strong>
                  ${employee.email || "Not available"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Department:</strong>
                  ${employee.department || "Not specified"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Position:</strong>
                  ${employee.position || "Not specified"}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Date:</strong>
                  ${clockOutTime.toLocaleDateString()}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Clock-out Time:</strong>
                  ${clockOutTime.toLocaleTimeString()}
                </p>

                <p style="margin: 7px 0;">
                  <strong>Working Hours:</strong>
                  ${formattedWorkingHours} hours
                </p>

              </div>

              <p style="color: #1d4ed8; font-weight: bold;">
                ClockIn Pro
              </p>

              <p style="color: #6b7280; font-size: 12px;">
                Workforce Productivity & Daily Reporting System
              </p>

            </div>
          </div>
        `,
      });

      console.log(
        `📧 Admin clock-out email sent successfully to ${process.env.ADMIN_EMAIL}`
      );
    } else {
      console.log(
        "⚠️ ADMIN_EMAIL is not configured. Admin clock-out email skipped."
      );
    }
  } catch (emailError) {
    console.error(
      "❌ Admin clock-out email error:",
      emailError.message
    );
  }

  console.log("==================================");

  return updatedAttendance;
};

// ==========================================
// GET TODAY'S ATTENDANCE
// ==========================================

const getTodayAttendance = async (employee) => {
  const attendanceDate = new Date();

  attendanceDate.setHours(0, 0, 0, 0);

  return await attendanceRepository.findTodayAttendance(
    employee._id,
    attendanceDate
  );
};

// ==========================================
// GET ATTENDANCE HISTORY
// ==========================================

const getAttendanceHistory = async (employee) => {
  return await attendanceRepository.getAttendanceHistory(
    employee._id
  );
};

// ==========================================
// ADMIN - GET ALL ATTENDANCE
// ==========================================

const getAllAttendance = async () => {
  return await attendanceRepository.getAllAttendance();
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