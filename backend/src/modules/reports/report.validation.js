const { body } = require("express-validator");

const submitReportValidation = [
  body("workSummary")
    .trim()
    .notEmpty()
    .withMessage("Work summary is required."),

  body("tasksCompleted")
    .isArray({ min: 1 })
    .withMessage(
      "Tasks completed must contain at least one task."
    ),

  body("challenges")
    .optional()
    .isString(),

  body("tomorrowPlan")
    .optional()
    .isString(),
];

module.exports = {
  submitReportValidation,
};