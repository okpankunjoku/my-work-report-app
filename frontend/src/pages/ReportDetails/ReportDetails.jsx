import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardList,
  FaClock,
} from "react-icons/fa";

import Card from "../../components/Card/Card";
import Badge from "../../components/Badge/Badge";

import { getReportById } from "../../services/reportService";

function ReportDetails() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Report By ID
  // ==========================================

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getReportById(id);

        console.log(
          "Report details response:",
          response
        );

        setReport(response?.data || null);
      } catch (error) {
        console.error(
          "Failed to load report:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load report."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    } else {
      setError("Invalid report ID.");
      setLoading(false);
    }
  }, [id]);

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "--";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // Format Date & Time
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) {
      return "--";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">

        <div
          className="
            w-12
            h-12
            border-4
            border-blue-200
            border-t-blue-600
            rounded-full
            animate-spin
          "
        ></div>

        <p className="text-gray-500 mt-4">
          Loading report...
        </p>

      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto">

        <Link
          to="/reports"
          className="
            inline-flex
            items-center
            gap-2
            text-blue-600
            hover:text-blue-800
            mb-6
            font-medium
          "
        >
          <FaArrowLeft />

          Back to Reports
        </Link>

        <Card>

          <div className="text-center py-10">

            <div className="text-red-500 text-4xl mb-4 flex justify-center">
              <FaExclamationTriangle />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Report Not Found
            </h2>

            <p className="text-gray-500 mt-2">
              {error || "The requested report could not be found."}
            </p>

          </div>

        </Card>

      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* ======================================
          Back Button
      ====================================== */}

      <Link
        to="/reports"
        className="
          inline-flex
          items-center
          gap-2
          text-blue-600
          hover:text-blue-800
          mb-6
          font-medium
        "
      >
        <FaArrowLeft />

        Back to Reports
      </Link>

      {/* ======================================
          Header
      ====================================== */}

      <Card>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <FaClipboardList />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-800">
                  Daily Work Report
                </h1>

                <p className="text-gray-500">
                  {formatDate(report.reportDate)}
                </p>

              </div>

            </div>

          </div>

          <Badge status="Submitted" />

        </div>

      </Card>

      {/* ======================================
          Report Information
      ====================================== */}

      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        {/* ======================================
            Work Summary
        ====================================== */}

        <Card>

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <FaClipboardList />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Work Summary
            </h2>

          </div>

          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {report.workSummary ||
              "No work summary provided."}
          </p>

        </Card>

        {/* ======================================
            Tasks Completed
        ====================================== */}

        <Card>

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-green-100
                text-green-600
                flex
                items-center
                justify-center
              "
            >
              <FaCheckCircle />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Tasks Completed
            </h2>

          </div>

          {Array.isArray(report.tasksCompleted) &&
          report.tasksCompleted.length > 0 ? (

            <ul className="space-y-3">

              {report.tasksCompleted.map(
                (task, index) => (

                  <li
                    key={index}
                    className="
                      flex
                      items-start
                      gap-3
                      text-gray-600
                    "
                  >

                    <FaCheckCircle
                      className="
                        text-green-500
                        mt-1
                        flex-shrink-0
                      "
                    />

                    <span>
                      {task}
                    </span>

                  </li>

                )
              )}

            </ul>

          ) : (

            <p className="text-gray-500">
              No tasks recorded.
            </p>

          )}

        </Card>

        {/* ======================================
            Challenges
        ====================================== */}

        <Card>

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-yellow-100
                text-yellow-600
                flex
                items-center
                justify-center
              "
            >
              <FaExclamationTriangle />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Challenges
            </h2>

          </div>

          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {report.challenges ||
              "No challenges reported."}
          </p>

        </Card>

        {/* ======================================
            Tomorrow's Plan
        ====================================== */}

        <Card>

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-purple-100
                text-purple-600
                flex
                items-center
                justify-center
              "
            >
              <FaCalendarAlt />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Plan for Tomorrow
            </h2>

          </div>

          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {report.tomorrowPlan ||
              "No plan provided."}
          </p>

        </Card>

      </div>

      {/* ======================================
          Report Metadata
      ====================================== */}

      <Card className="mt-6">

        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Report Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {/* Report Date */}

          <div className="flex items-center gap-3">

            <FaCalendarAlt className="text-blue-600" />

            <div>

              <p className="text-sm text-gray-500">
                Report Date
              </p>

              <p className="font-medium text-gray-800">
                {formatDate(report.reportDate)}
              </p>

            </div>

          </div>

          {/* Submitted Date */}

          <div className="flex items-center gap-3">

            <FaClock className="text-blue-600" />

            <div>

              <p className="text-sm text-gray-500">
                Submitted
              </p>

              <p className="font-medium text-gray-800">
                {formatDateTime(report.createdAt)}
              </p>

            </div>

          </div>

        </div>

      </Card>

    </div>
  );
}

export default ReportDetails;