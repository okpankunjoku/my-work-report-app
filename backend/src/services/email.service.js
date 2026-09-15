const nodemailer = require("nodemailer");

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ==========================================
// VERIFY EMAIL CONNECTION
// ==========================================

const verifyEmailConnection = async () => {
  try {
    await transporter.verify();

    console.log("✅ Email service connected successfully.");
  } catch (error) {
    console.error(
      "❌ Email service connection failed:",
      error.message
    );
  }
};

// ==========================================
// SEND EMAIL
// ==========================================

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!to) {
      throw new Error("Recipient email address is required.");
    }

    const mailOptions = {
      from: `"ClockIn Pro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 Email sent successfully to ${to}`);
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  transporter,
  verifyEmailConnection,
  sendEmail,
};