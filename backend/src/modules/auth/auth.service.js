const crypto = require("crypto");

const AppError = require("../../utils/AppError");

const authRepository = require("./auth.repository");

const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("./auth.utils");

const {
  sendEmail,
} = require("../../services/email.service");

// ==========================================
// Register
// ==========================================

const register = async (data) => {
  const {
    fullName,
    employeeId,
    email,
    password,
    phone,
    department,
    position,
  } = data;

  // ==========================================
  // Check Existing Email
  // ==========================================

  const existingEmail =
    await authRepository.findByEmail(email);

  if (existingEmail) {
    throw new AppError(
      "Email already exists.",
      409
    );
  }

  // ==========================================
  // Check Existing Employee ID
  // ==========================================

  const existingEmployee =
    await authRepository.findByEmployeeId(
      employeeId
    );

  if (existingEmployee) {
    throw new AppError(
      "Employee ID already exists.",
      409
    );
  }

  // ==========================================
  // Hash Password
  // ==========================================

  const hashedPassword =
    await hashPassword(password);

  // ==========================================
  // Create Employee
  // ==========================================

  const employee =
    await authRepository.createEmployee({
      fullName,
      employeeId,
      email,
      password: hashedPassword,
      phone,
      department,
      position,

      // IMPORTANT:
      // Public registration can only create
      // normal Employees.
      role: "Employee",

      status: "Active",
    });

  // ==========================================
  // Generate Token
  // ==========================================

  const token = generateToken(employee);

  // ==========================================
  // Return
  // ==========================================

  return {
    employee,
    token,
  };
};

// ==========================================
// Login
// ==========================================

const login = async (email, password) => {
  const employee =
    await authRepository.findByEmail(email);

  if (!employee) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  // ==========================================
  // Check Account Status
  // ==========================================

  if (employee.status !== "Active") {
    throw new AppError(
      `Your account is ${employee.status.toLowerCase()}. Please contact the administrator.`,
      403
    );
  }

  // ==========================================
  // Compare Password
  // ==========================================

  const isMatch =
    await comparePassword(
      password,
      employee.password
    );

  if (!isMatch) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  // ==========================================
  // Update Last Login
  // ==========================================

  await authRepository.updateLastLogin(
    employee._id
  );

  // ==========================================
  // Generate Token
  // ==========================================

  const token = generateToken(employee);

  // ==========================================
  // Remove Password From Response
  // ==========================================

  employee.password = undefined;

  // ==========================================
  // Return Login Data
  // ==========================================

  return {
    employee,
    token,
  };
};

// ==========================================
// Forgot Password
// ==========================================

const forgotPassword = async (email) => {
  const normalizedEmail =
    email.toLowerCase().trim();

  // ==========================================
  // Find Employee
  // ==========================================

  const employee =
    await authRepository.findByEmail(
      normalizedEmail
    );

  // ==========================================
  // Do Not Reveal Whether Account Exists
  // ==========================================

  if (!employee) {
    return;
  }

  // ==========================================
  // Generate Secure Reset Token
  // ==========================================

  const resetToken =
    crypto.randomBytes(32).toString("hex");

  // ==========================================
  // Hash Token Before Storing
  // ==========================================

  const hashedResetToken =
    crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

  // ==========================================
  // Token Expiry
  // 30 Minutes
  // ==========================================

  const resetPasswordExpires =
    new Date(
      Date.now() + 30 * 60 * 1000
    );

  // ==========================================
  // Save Hashed Token
  // ==========================================

  await authRepository.saveResetPasswordToken(
    employee._id,
    hashedResetToken,
    resetPasswordExpires
  );

  // ==========================================
  // Frontend Reset URL
  // ==========================================

  const frontendUrl =
    process.env.FRONTEND_URL ||
    "https://my-work-report-app.vercel.app";

  const resetUrl =
    `${frontendUrl}/reset-password/${resetToken}`;

  // ==========================================
  // Email Content
  // ==========================================

  const subject =
    "ClockIn Pro - Password Reset Request";

  const text = `
Hello ${employee.fullName},

We received a request to reset your ClockIn Pro password.

Click the link below to create a new password:

${resetUrl}

This password reset link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
ClockIn Pro
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8fafc;">

      <div style="background-color: #2563eb; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">
          ClockIn Pro
        </h1>
      </div>

      <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px;">

        <h2 style="color: #1f2937;">
          Password Reset Request
        </h2>

        <p style="color: #4b5563; line-height: 1.6;">
          Hello ${employee.fullName},
        </p>

        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset your ClockIn Pro password.
        </p>

        <div style="text-align: center; margin: 30px 0;">

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              padding: 14px 24px;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Reset My Password
          </a>

        </div>

        <p style="color: #6b7280; line-height: 1.6;">
          This password reset link will expire in
          <strong>30 minutes</strong>.
        </p>

        <p style="color: #6b7280; line-height: 1.6;">
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

        <p style="color: #9ca3af; font-size: 13px;">
          ClockIn Pro - Workforce Productivity & Daily Reporting System
        </p>

      </div>

    </div>
  `;

  // ==========================================
  // Send Email
  // ==========================================

  await sendEmail({
    to: normalizedEmail,
    subject,
    text,
    html,
  });
};

// ==========================================
// Reset Password
// ==========================================

const resetPassword = async (
  resetToken,
  newPassword
) => {
  // ==========================================
  // Hash Token From URL
  // ==========================================

  const hashedResetToken =
    crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

  // ==========================================
  // Find Valid Token
  // ==========================================

  const employee =
    await authRepository.findByResetPasswordToken(
      hashedResetToken
    );

  if (!employee) {
    throw new AppError(
      "Password reset link is invalid or has expired.",
      400
    );
  }

  // ==========================================
  // Hash New Password
  // ==========================================

  const hashedPassword =
    await hashPassword(newPassword);

  // ==========================================
  // Update Password
  // ==========================================

  await authRepository.updatePasswordAndClearResetToken(
    employee._id,
    hashedPassword
  );

  // ==========================================
  // Return
  // ==========================================

  return {
    message:
      "Password reset successful. You can now log in with your new password.",
  };
};

// ==========================================
// Get Current Employee
// ==========================================

const getMe = async (id) => {
  const employee =
    await authRepository.findById(id);

  if (!employee) {
    throw new AppError(
      "Employee not found.",
      404
    );
  }

  return employee;
};

// ==========================================
// Export
// ==========================================

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
};