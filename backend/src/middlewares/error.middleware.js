const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ==========================================
  // Mongoose Validation Error
  // ==========================================

  if (err.name === "ValidationError") {
    statusCode = 400;

    const messages = Object.values(err.errors).map(
      (error) => error.message
    );

    message = messages.join(", ");
  }

  // ==========================================
  // Mongoose Duplicate Key Error
  // ==========================================

  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue || {})[0];

    message = field
      ? `${field} already exists.`
      : "Duplicate value already exists.";
  }

  // ==========================================
  // Mongoose Invalid ObjectId
  // ==========================================

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID.";
  }

  // ==========================================
  // JWT Errors
  // ==========================================

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

  // ==========================================
  // Response
  // ==========================================

  const response = {
    success: false,
    message,
  };

  // Only show stack trace during development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;