import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/Card/Card";
import TextArea from "../../components/TextArea/TextArea";
import Button from "../../components/Button/Button";

import { createReport } from "../../services/reportService";

function CreateReport() {
  const navigate = useNavigate();

  const [report, setReport] = useState({
    workSummary: "",
    tasksCompleted: "",
    challenges: "",
    tomorrowPlan: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate Work Summary
    if (!report.workSummary.trim()) {
      setError("Please enter your work summary.");
      return;
    }

    // Convert tasks from textarea into an array.
    // Each line becomes one task.
    const tasksCompleted = report.tasksCompleted
      .split("\n")
      .map((task) => task.trim())
      .filter((task) => task.length > 0);

    // Validate Tasks
    if (tasksCompleted.length === 0) {
      setError("Please enter at least one completed task.");
      return;
    }

    try {
      setLoading(true);

      // Data that matches the backend validation
      const reportData = {
        workSummary: report.workSummary.trim(),

        tasksCompleted,

        challenges: report.challenges.trim(),

        tomorrowPlan: report.tomorrowPlan.trim(),
      };

      console.log("Submitting report:", reportData);

      const response = await createReport(reportData);

      console.log(
        "Report submitted successfully:",
        response
      );

      alert("Report submitted successfully!");

      navigate("/reports");
    } catch (error) {
      console.error("Submit report error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Create Daily Report
        </h1>

        <p className="text-gray-500 mt-2">
          Fill in today's work report.
        </p>

      </div>

      {/* Report Card */}

      <Card>

        {/* Error Message */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">

            <p className="font-medium">
              {error}
            </p>

          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Work Summary */}

          <TextArea
            label="Work Summary"
            name="workSummary"
            value={report.workSummary}
            onChange={handleChange}
            placeholder="Describe the work you completed today..."
            rows={6}
          />

          {/* Tasks Completed */}

          <TextArea
            label="Tasks Completed"
            name="tasksCompleted"
            value={report.tasksCompleted}
            onChange={handleChange}
            placeholder={
              "Enter one task per line...\nExample:\nFixed login page\nUpdated dashboard\nTested API"
            }
            rows={6}
          />

          <p className="text-sm text-gray-500 -mt-4">
            Enter each completed task on a separate line.
          </p>

          {/* Challenges */}

          <TextArea
            label="Challenges"
            name="challenges"
            value={report.challenges}
            onChange={handleChange}
            placeholder="Describe any challenges you faced today (optional)..."
            rows={4}
          />

          {/* Tomorrow Plan */}

          <TextArea
            label="Plan for Tomorrow"
            name="tomorrowPlan"
            value={report.tomorrowPlan}
            onChange={handleChange}
            placeholder="Describe what you plan to work on tomorrow (optional)..."
            rows={4}
          />

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading
                ? "Submitting..."
                : "Submit Report"}
            </Button>

            <button
              type="button"
              onClick={() => navigate("/reports")}
              disabled={loading}
              className="
                w-full
                sm:w-auto
                px-6
                py-3
                rounded-lg
                border
                border-gray-300
                text-gray-700
                hover:bg-gray-100
                transition
                disabled:opacity-50
              "
            >
              Cancel
            </button>

          </div>

        </form>

      </Card>

    </div>
  );
}

export default CreateReport;