const mongoose = require("mongoose");
// require("dotenv").config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://work-report-app:0vXP6uoZoUzk3amM@cluster0.idpdyce.mongodb.net/?appName=Cluster0");

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;