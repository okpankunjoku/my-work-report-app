const { Resend } = require("resend");

// ==========================================
// RESEND EMAIL SERVICE
// ==========================================

const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// VERIFY EMAIL CONNECTION
// ==========================================

const verifyEmailConnection = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    console.log("✅ Resend email service configured successfully.");
  } catch (error) {
    console.error(
      "❌ Email service configuration failed:",
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

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    const { data, error } = await resend.emails.send({
      from: "ClockIn Pro <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error(
        "❌ Resend email error:",
        error.message || error
      );

      throw new Error(
        error.message || "Failed to send email."
      );
    }

    console.log(`📧 Email sent successfully to ${to}`);
    console.log("Message ID:", data?.id);

    return data;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  resend,
  verifyEmailConnection,
  sendEmail,
};