const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/v1", routes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

module.exports = app;