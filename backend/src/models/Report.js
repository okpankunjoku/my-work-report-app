const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    reportDate: {
      type: Date,
      required: true,
    },

    workSummary: {
      type: String,
      required: true,
      trim: true,
    },

    tasksCompleted: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    challenges: {
      type: String,
      default: "",
      trim: true,
    },

    tomorrowPlan: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reports for the same employee on the same day
reportSchema.index(
  {
    employee: 1,
    reportDate: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);