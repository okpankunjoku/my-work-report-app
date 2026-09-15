const AppError = require("../../utils/AppError");

const reportRepository = require("./report.repository");
const notificationService = require("../notifications/notification.service");
const { sendEmail } = require("../../services/email.service");

// ==========================================
// Submit Report
// ==========================================

const submitReport = async (employee, data) => {
  const {
    workSummary,
    tasksCompleted,
    challenges,
    tomorrowPlan,
  } = data;

  const reportDate = new Date();

  reportDate.setHours(0, 0, 0, 0);

  // ==========================================
  // Check Existing Report
  // ==========================================

  const existingReport =
    await reportRepository.findTodayReport(
      employee._id,
      reportDate
    );

  if (existingReport) {
    throw new AppError(
      "You have already submitted today's report.",
      400
    );
  }

  // ==========================================
  // Create Report
  // ==========================================

  const report =
    await reportRepository.createReport({
      employee: employee._id,
      reportDate,
      workSummary,
      tasksCompleted,
      challenges,
      tomorrowPlan,
    });

  // ==========================================
  // Create In-App Notification
  // ==========================================

  try {
    await notificationService.createNotification(
      employee._id,
      {
        title: "Report submitted successfully",
        message:
          "Your daily work report has been submitted successfully.",
        type: "report",
      }
    );

    console.log(
      "Report submission notification created."
    );
  } catch (notificationError) {
    console.error(
      "Report notification error:",
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
        subject:
          "Report Submitted Successfully - ClockIn Pro",

        text: `Hello ${employee.fullName || "Employee"},

Your daily work report has been submitted successfully.

Date: ${reportDate.toLocaleDateString()}

Thank you for keeping your work records up to date.

ClockIn Pro
Workforce Productivity & Daily Reporting System`,

        html: `
          <div style="font-family: Arial, sans-serif; background-color: #eff6ff; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 30px;">

              <h2 style="color: #1d4ed8; margin-top: 0;">
                Report Submitted Successfully
              </h2>

              <p style="color: #1f2937;">
                Hello <strong>${employee.fullName || "Employee"}</strong>,
              </p>

              <p style="color: #374151;">
                Your daily work report has been submitted successfully.
              </p>

              <div style="background-color: #bfdbfe; padding: 15px; border-radius: 8px; margin: 20px 0;">

                <p style="margin: 5px 0;">
                  <strong>Status:</strong>
                  <span style="color: #15803d; font-weight: bold;">
                    Submitted
                  </span>
                </p>

                <p style="margin: 5px 0;">
                  <strong>Date:</strong>
                  ${reportDate.toLocaleDateString()}
                </p>

              </div>

              <p style="color: #374151;">
                Thank you for keeping your work records up to date.
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
        `📧 Report submission email sent successfully to ${employee.email}`
      );
    } else {
      console.log(
        "⚠️ Employee email address not available. Report email skipped."
      );
    }
  } catch (emailError) {
    console.error(
      "❌ Employee report email error:",
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
        subject: `New Daily Report Submitted - ${employee.fullName || "Employee"}`,

        text: `Hello Admin,

An employee has submitted their daily work report.

Employee: ${employee.fullName || "Unknown"}
Employee ID: ${employee.employeeId || employee._id}
Email: ${employee.email || "Not available"}
Department: ${employee.department || "Not specified"}
Position: ${employee.position || "Not specified"}

Report Date: ${reportDate.toLocaleDateString()}

Work Summary:
${workSummary || "No work summary provided."}

Tasks Completed:
${
  Array.isArray(tasksCompleted)
    ? tasksCompleted.join("\n- ")
    : tasksCompleted || "No tasks listed."
}

Challenges:
${challenges || "No challenges reported."}

Tomorrow's Plan:
${tomorrowPlan || "No plan provided."}

ClockIn Pro
Workforce Productivity & Daily Reporting System`,

        html: `
          <div style="font-family: Arial, sans-serif; background-color: #eff6ff; padding: 30px;">
            <div style="max-width: 650px; margin: auto; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 30px;">

              <h2 style="color: #1d4ed8; margin-top: 0;">
                New Daily Report Submitted
              </h2>

              <p style="color: #374151;">
                An employee has submitted their daily work report.
              </p>

              <div style="background-color: #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">

                <h3 style="color: #1d4ed8; margin-top: 0;">
                  Employee Information
                </h3>

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
                  <strong>Report Date:</strong>
                  ${reportDate.toLocaleDateString()}
                </p>

              </div>

              <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">

                <h3 style="color: #1d4ed8;">
                  Work Summary
                </h3>

                <p style="color: #374151;">
                  ${workSummary || "No work summary provided."}
                </p>

                <h3 style="color: #1d4ed8;">
                  Tasks Completed
                </h3>

                ${
                  Array.isArray(tasksCompleted)
                    ? `
                      <ul style="color: #374151;">
                        ${tasksCompleted
                          .map(
                            (task) =>
                              `<li>${task}</li>`
                          )
                          .join("")}
                      </ul>
                    `
                    : `
                      <p style="color: #374151;">
                        ${tasksCompleted || "No tasks listed."}
                      </p>
                    `
                }

                <h3 style="color: #1d4ed8;">
                  Challenges
                </h3>

                <p style="color: #374151;">
                  ${challenges || "No challenges reported."}
                </p>

                <h3 style="color: #1d4ed8;">
                  Tomorrow's Plan
                </h3>

                <p style="color: #374151;">
                  ${tomorrowPlan || "No plan provided."}
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
        `📧 Admin report email sent successfully to ${process.env.ADMIN_EMAIL}`
      );
    } else {
      console.log(
        "⚠️ ADMIN_EMAIL is not configured. Admin report email skipped."
      );
    }
  } catch (emailError) {
    console.error(
      "❌ Admin report email error:",
      emailError.message
    );
  }

  // ==========================================
  // Return Report
  // ==========================================

  return report;
};

// ==========================================
// Get Today's Report
// ==========================================

const getTodayReport = async (employee) => {
  const reportDate = new Date();

  reportDate.setHours(0, 0, 0, 0);

  return await reportRepository.findTodayReport(
    employee._id,
    reportDate
  );
};

// ==========================================
// Get Report History
// ==========================================

const getReportHistory = async (employee) => {
  return await reportRepository.getReportHistory(
    employee._id
  );
};

// ==========================================
// Get Report By ID
// ==========================================

const getReportById = async (
  employee,
  reportId
) => {
  const report =
    await reportRepository.findById(reportId);

  if (!report) {
    throw new AppError(
      "Report not found.",
      404
    );
  }

  if (
    report.employee.toString() !==
    employee._id.toString()
  ) {
    throw new AppError(
      "You are not authorized to view this report.",
      403
    );
  }

  return report;
};

// ==========================================
// Export
// ==========================================

module.exports = {
  submitReport,
  getTodayReport,
  getReportHistory,
  getReportById,
};