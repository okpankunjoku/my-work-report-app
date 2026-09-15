import { useEffect, useMemo, useState } from "react";

import {
  FaSearch,
  FaPlus,
  FaEye,
  FaClipboardList,
  FaCalendarAlt,
  FaCheckCircle,
  FaFileAlt,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import { getReports } from "../../services/reportService";

function Reports() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Reports
  // ==========================================

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReports();

      console.log("Reports response:", response);

      setReports(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch reports:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load reports."
      );
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
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Search Reports
  // ==========================================

  const filteredReports = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return reports;
    }

    return reports.filter((report) => {
      const workSummary =
        report?.workSummary?.toLowerCase() || "";

      const challenges =
        report?.challenges?.toLowerCase() || "";

      const tomorrowPlan =
        report?.tomorrowPlan?.toLowerCase() || "";

      const tasksCompleted = Array.isArray(
        report?.tasksCompleted
      )
        ? report.tasksCompleted
            .join(" ")
            .toLowerCase()
        : String(
            report?.tasksCompleted || ""
          ).toLowerCase();

      return (
        workSummary.includes(search) ||
        tasksCompleted.includes(search) ||
        challenges.includes(search) ||
        tomorrowPlan.includes(search)
      );
    });
  }, [reports, searchTerm]);

  // ==========================================
  // Statistics
  // ==========================================

  const totalReports = reports.length;

  const thisMonthReports = reports.filter(
    (report) => {
      if (!report?.reportDate) return false;

      const reportDate = new Date(
        report.reportDate
      );

      const today = new Date();

      return (
        reportDate.getMonth() ===
          today.getMonth() &&
        reportDate.getFullYear() ===
          today.getFullYear()
      );
    }
  ).length;

  const latestReport =
    reports.length > 0
      ? reports[0]
      : null;

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
            Loading your reports...
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Please wait a moment.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
        "
      >

        <div className="flex items-start gap-4">

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-blue-100
              text-blue-600
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <FaClipboardList className="text-2xl" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              My Reports
            </h1>

            <p className="text-gray-500 mt-1">
              View, search and manage your daily work reports.
            </p>

          </div>

        </div>

        <Link
          to="/create-report"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            shadow-sm
            hover:bg-blue-700
            hover:shadow-md
            transition-all
            duration-200
            w-fit
          "
        >
          <FaPlus />

          New Report
        </Link>

      </div>

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div
          className="
            bg-red-50
            border
            border-red-200
            rounded-2xl
            p-5
          "
        >

          <div className="flex items-start gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-red-100
                text-red-600
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <FaFileAlt />
            </div>

            <div className="flex-1">

              <h3 className="font-bold text-red-800">
                Unable to load reports
              </h3>

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchReports}
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-red-700
                  hover:text-red-900
                  underline
                "
              >
                Try Again
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          STATISTICS
      ========================================== */}

      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Total Reports */}

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Total Reports
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {totalReports}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  All submitted reports
                </p>

              </div>

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
                "
              >
                <FaClipboardList />
              </div>

            </div>

          </div>

          {/* This Month */}

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  This Month
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {thisMonthReports}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Reports submitted this month
                </p>

              </div>

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                "
              >
                <FaCalendarAlt />
              </div>

            </div>

          </div>

          {/* Latest Report */}

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition
            "
          >

            <div className="flex items-center justify-between">

              <div className="min-w-0">

                <p className="text-sm font-medium text-gray-500">
                  Latest Report
                </p>

                <h2 className="text-lg font-bold text-gray-900 mt-2 truncate">
                  {latestReport
                    ? formatDate(
                        latestReport.reportDate ||
                          latestReport.createdAt
                      )
                    : "No reports"}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Most recent submission
                </p>

              </div>

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-green-100
                  text-green-600
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <FaCheckCircle />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          REPORTS SECTION
      ========================================== */}

      {!error && (
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

          {/* Section Header */}

          <div
            className="
              p-6
              sm:p-8
              border-b
              border-gray-100
            "
          >

            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-5
              "
            >

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Submitted Reports
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {filteredReports.length}{" "}
                  {filteredReports.length === 1
                    ? "report"
                    : "reports"}{" "}
                  displayed
                </p>

              </div>

              {/* Search */}

              <div className="relative w-full lg:w-96">

                <FaSearch
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search your reports..."
                  className="
                    w-full
                    bg-gray-50
                    border
                    border-gray-200
                    rounded-xl
                    py-3
                    pl-11
                    pr-11
                    text-sm
                    outline-none
                    transition
                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchTerm("")
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-7
                      h-7
                      rounded-lg
                      text-gray-400
                      hover:bg-gray-200
                      hover:text-gray-700
                      flex
                      items-center
                      justify-center
                      transition
                    "
                    title="Clear search"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* ========================================
              Desktop Table
          ======================================== */}

          {filteredReports.length > 0 ? (

            <div className="hidden md:block overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-100">

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Work Summary
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Tasks Completed
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredReports.map(
                    (report, index) => {

                      const tasks =
                        Array.isArray(
                          report?.tasksCompleted
                        )
                          ? report.tasksCompleted.join(
                              ", "
                            )
                          : report?.tasksCompleted ||
                            "No tasks recorded";

                      return (
                        <tr
                          key={
                            report?._id ||
                            index
                          }
                          className="
                            border-b
                            border-gray-100
                            last:border-b-0
                            hover:bg-blue-50/40
                            transition
                          "
                        >

                          {/* Date */}

                          <td className="px-6 py-5 whitespace-nowrap">

                            <div className="flex items-center gap-3">

                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-xl
                                  bg-blue-50
                                  text-blue-600
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <FaCalendarAlt className="text-sm" />
                              </div>

                              <div>

                                <p className="font-semibold text-gray-800">
                                  {formatDate(
                                    report?.reportDate ||
                                      report?.createdAt
                                  )}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  Daily Report
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Summary */}

                          <td className="px-6 py-5">

                            <p className="font-semibold text-gray-800 max-w-xs truncate">
                              {report?.workSummary ||
                                "No summary"}
                            </p>

                            {report?.challenges && (
                              <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                {report.challenges}
                              </p>
                            )}

                          </td>

                          {/* Tasks */}

                          <td className="px-6 py-5">

                            <p className="text-sm text-gray-600 max-w-xs line-clamp-2">
                              {tasks}
                            </p>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-1.5
                                rounded-full
                                bg-green-50
                                border
                                border-green-100
                                text-green-700
                                text-xs
                                font-bold
                              "
                            >

                              <span className="w-2 h-2 rounded-full bg-green-500" />

                              Submitted

                            </span>

                          </td>

                          {/* Action */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end">

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/reports/${report._id}`
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  px-4
                                  py-2
                                  rounded-xl
                                  bg-blue-50
                                  text-blue-600
                                  text-sm
                                  font-semibold
                                  hover:bg-blue-600
                                  hover:text-white
                                  transition-all
                                "
                              >

                                <FaEye />

                                View

                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            /* ======================================
               Empty Search / Empty Reports
            ====================================== */

            <div className="px-6 py-16 text-center">

              <div
                className="
                  w-16
                  h-16
                  mx-auto
                  rounded-2xl
                  bg-gray-100
                  text-gray-400
                  flex
                  items-center
                  justify-center
                "
              >
                <FaClipboardList className="text-2xl" />
              </div>

              <h3 className="text-lg font-bold text-gray-800 mt-5">
                {searchTerm
                  ? "No reports found"
                  : "No reports yet"}
              </h3>

              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                {searchTerm
                  ? "Try using a different search term."
                  : "Submit your first daily work report and it will appear here."}
              </p>

              {searchTerm ? (

                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mt-5
                    border
                    border-gray-200
                    px-4
                    py-2.5
                    rounded-xl
                    text-sm
                    font-semibold
                    text-gray-700
                    hover:bg-gray-50
                    transition
                  "
                >
                  <FaTimes />

                  Clear Search
                </button>

              ) : (

                <Link
                  to="/create-report"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mt-5
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
                  <FaPlus />

                  Create Report
                </Link>

              )}

            </div>
          )}

          {/* ========================================
              Mobile Report Cards
          ======================================== */}

          {filteredReports.length > 0 && (
            <div className="md:hidden divide-y divide-gray-100">

              {filteredReports.map(
                (report, index) => {

                  const tasks =
                    Array.isArray(
                      report?.tasksCompleted
                    )
                      ? report.tasksCompleted.join(
                          ", "
                        )
                      : report?.tasksCompleted ||
                        "No tasks recorded";

                  return (
                    <div
                      key={
                        report?._id ||
                        index
                      }
                      className="p-5"
                    >

                      {/* Top */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">

                          <div
                            className="
                              w-11
                              h-11
                              rounded-xl
                              bg-blue-50
                              text-blue-600
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                            "
                          >
                            <FaCalendarAlt />
                          </div>

                          <div className="min-w-0">

                            <p className="font-bold text-gray-800">
                              {formatDate(
                                report?.reportDate ||
                                  report?.createdAt
                              )}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Daily Report
                            </p>

                          </div>

                        </div>

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            px-2.5
                            py-1
                            rounded-full
                            bg-green-50
                            text-green-700
                            text-xs
                            font-semibold
                            flex-shrink-0
                          "
                        >
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />

                          Submitted
                        </span>

                      </div>

                      {/* Summary */}

                      <div className="mt-5">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Work Summary
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                          {report?.workSummary ||
                            "No summary"}
                        </p>

                      </div>

                      {/* Tasks */}

                      <div className="mt-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Tasks Completed
                        </p>

                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {tasks}
                        </p>

                      </div>

                      {/* View */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/reports/${report._id}`
                          )
                        }
                        className="
                          w-full
                          mt-5
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          bg-blue-50
                          text-blue-600
                          py-3
                          rounded-xl
                          text-sm
                          font-semibold
                          hover:bg-blue-600
                          hover:text-white
                          transition
                        "
                      >

                        <FaEye />

                        View Report

                        <FaArrowRight className="text-xs" />

                      </button>

                    </div>
                  );
                }
              )}

            </div>
          )}

          {/* ========================================
              Footer
          ======================================== */}

          {filteredReports.length > 0 && (
            <div
              className="
                px-6
                py-4
                bg-gray-50
                border-t
                border-gray-100
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
              "
            >

              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredReports.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {reports.length}
                </span>{" "}
                reports
              </p>

              <Link
                to="/create-report"
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
                Create another report

                <FaArrowRight className="text-xs" />
              </Link>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Reports;