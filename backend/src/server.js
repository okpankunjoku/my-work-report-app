// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

require("dotenv").config();

// ==========================================
// IMPORTS
// ==========================================

const app = require("./app");
const connectDB = require("./config/database");

const {
  verifyEmailConnection,
} = require("./services/email.service");

// ==========================================
// SERVER CONFIGURATION
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// CONNECT TO DATABASE
// ==========================================

connectDB();

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Verify email service
  verifyEmailConnection();
});

