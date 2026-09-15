import { useEffect, useState } from "react";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaLightbulb,
  FaSpinner,
} from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";

import { getReportById } from "../../services/reportService";

function ReportDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Report
  // ==========================================

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReportById(id);

      console.log("Report details response:", response);

      const reportData =
        response?.data?.report ||
        response?.data ||
        response?.report ||
        null;

      setReport(reportData);
    } catch (error) {
      console.error(
        "Failed to fetch report:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load this report."
      );

      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // Format Date & Time
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div
            className="
              w-12
              h-12
              border-4
              border-blue-100
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="text-gray-600 font-medium mt-4">
            Loading report...
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-blue-600
            hover:text-blue-800
            transition
            mb-6
          "
        >
          <FaArrowLeft />

          Back to Reports
        </button>

        <div
          className="
            bg-white
            border
            border-red-200
            rounded-3xl
            shadow-sm
            p-8
            text-center
          "
        >
          <div
            className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-red-50
              text-red-500
              flex
              items-center
              justify-center
            "
          >
            <FaExclamationTriangle className="text-2xl" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Unable to Load Report
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={fetchReport}
              className="
                inline-flex
                items-center
                gap-2
                bg-blue-600
                text-white
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                hover:bg-blue-700
                transition
              "
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => navigate("/reports")}
              className="
                inline-flex
                items-center
                gap-2
                border
                border-gray-200
                text-gray-700
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                hover:bg-gray-50
                transition
              "
            >
              Back to Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Report Not Found
  // ==========================================

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gray-500">
          Report not found.
        </p>

        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="
            mt-5
            inline-flex
            items-center
            gap-2
            bg-blue-600
            text-white
            px-5
            py-2.5
            rounded-xl
            text-sm
            font-semibold
            hover:bg-blue-700
          "
        >
          <FaArrowLeft />

          Back to Reports
        </button>
      </div>
    );
  }

  // ==========================================
  // Tasks
  // ==========================================

  const tasks = Array.isArray(report.tasksCompleted)
    ? report.tasksCompleted
    : report.tasksCompleted
    ? [report.tasksCompleted]
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ==========================================
          Back Button
      ========================================== */}

      <button
        type="button"
        onClick={() => navigate("/reports")}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-blue-600
          hover:text-blue-800
          transition
        "
      >
        <FaArrowLeft />

        Back to Reports
      </button>

      {/* ==========================================
          Header
      ========================================== */}

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-3xl
          shadow-sm
          overflow-hidden
        "
      >
        <div
          className="
            p-6
            sm:p-8
            bg-gradient-to-r
            from-blue-600
            to-blue-700
            text-white
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-5
            "
          >
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-white/15
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaClipboardList className="text-xl" />
                </div>

                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Daily Work Report
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                    Report Details
                  </h1>
                </div>
              </div>
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-white/15
                border
                border-white/20
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                w-fit
              "
            >
              <FaCheckCircle />

              Submitted
            </div>
          </div>
        </div>

        {/* ==========================================
            Report Meta
        ========================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
            p-6
            sm:p-8
            border-b
            border-gray-100
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
              bg-gray-50
              rounded-2xl
              p-4
            "
          >
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <FaCalendarAlt />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Report Date
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {formatDate(
                  report.reportDate ||
                    report.createdAt
                )}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              bg-gray-50
              rounded-2xl
              p-4
            "
          >
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-purple-100
                text-purple-600
                flex
                items-center
                justify-center
              "
            >
              <FaClock />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Submitted
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {formatDateTime(
                  report.createdAt
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            Report Content
        ========================================== */}

        <div className="p-6 sm:p-8 space-y-8">

          {/* Work Summary */}

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
              >
                <FaClipboardList />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Work Summary
                </h2>

                <p className="text-xs text-gray-400">
                  Overview of today's work
                </p>
              </div>
            </div>

            <div
              className="
                bg-gray-50
                border
                border-gray-100
                rounded-2xl
                p-5
              "
            >
              <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                {report.workSummary ||
                  "No work summary provided."}
              </p>
            </div>
          </section>

          {/* Tasks Completed */}

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-green-100
                  text-green-600
                  flex
                  items-center
                  justify-center
                "
              >
                <FaCheckCircle />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Tasks Completed
                </h2>

                <p className="text-xs text-gray-400">
                  Work completed today
                </p>
              </div>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-start
                      gap-3
                      bg-green-50
                      border
                      border-green-100
                      rounded-2xl
                      p-4
                    "
                  >
                    <FaCheckCircle
                      className="
                        text-green-500
                        mt-1
                        flex-shrink-0
                      "
                    />

                    <p className="text-gray-700">
                      {task}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                  bg-gray-50
                  border
                  border-gray-100
                  rounded-2xl
                  p-5
                  text-gray-500
                "
              >
                No tasks recorded.
              </div>
            )}
          </section>

          {/* Challenges */}

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-orange-100
                  text-orange-600
                  flex
                  items-center
                  justify-center
                "
              >
                <FaExclamationTriangle />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Challenges
                </h2>

                <p className="text-xs text-gray-400">
                  Issues encountered during work
                </p>
              </div>
            </div>

            <div
              className="
                bg-orange-50
                border
                border-orange-100
                rounded-2xl
                p-5
              "
            >
              <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                {report.challenges ||
                  "No challenges reported."}
              </p>
            </div>
          </section>

          {/* Tomorrow Plan */}

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                "
              >
                <FaLightbulb />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Tomorrow's Plan
                </h2>

                <p className="text-xs text-gray-400">
                  Planned work for the next day
                </p>
              </div>
            </div>

            <div
              className="
                bg-purple-50
                border
                border-purple-100
                rounded-2xl
                p-5
              "
            >
              <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                {report.tomorrowPlan ||
                  "No plan provided."}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ==========================================
          Bottom Navigation
      ========================================== */}

      <div className="flex justify-between items-center">

        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="
            inline-flex
            items-center
            gap-2
            border
            border-gray-200
            bg-white
            px-5
            py-3
            rounded-xl
            text-sm
            font-semibold
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          <FaArrowLeft />

          Back to Reports
        </button>

        <div className="text-sm text-gray-400 hidden sm:block">
          Report ID: {report._id}
        </div>
      </div>
    </div>
  );
}

export default ReportDetails;