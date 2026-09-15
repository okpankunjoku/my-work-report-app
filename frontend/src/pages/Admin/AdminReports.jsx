import { useEffect, useMemo, useState } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaEye,
  FaCalendarAlt,
  FaBuilding,
  FaUserTie,
  FaSearch,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";

import api from "../../services/api";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  // ==========================================
  // Fetch Reports
  // ==========================================

  const fetchReports = async () => {
    try {
      setError("");

      const response = await api.get("/admin/reports");

      const reportData = response?.data?.data;

      setReports(Array.isArray(reportData) ? reportData : []);
    } catch (err) {
      console.error("Admin Reports Error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load reports. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // Refresh
  // ==========================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
  };

  // ==========================================
  // Statistics
  // ==========================================

  const statistics = useMemo(() => {
    const totalReports = reports.length;

    const employees = new Set(
      reports
        .map((report) => report.employee?._id)
        .filter(Boolean)
    );

    const today = new Date();

    const reportsToday = reports.filter((report) => {
      if (!report.reportDate) return false;

      const reportDate = new Date(report.reportDate);

      return (
        reportDate.getFullYear() === today.getFullYear() &&
        reportDate.getMonth() === today.getMonth() &&
        reportDate.getDate() === today.getDate()
      );
    }).length;

    const reportsWithTasks = reports.filter(
      (report) =>
        Array.isArray(report.tasksCompleted) &&
        report.tasksCompleted.length > 0
    ).length;

    return {
      totalReports,
      uniqueEmployees: employees.size,
      reportsToday,
      reportsWithTasks,
    };
  }, [reports]);

  // ==========================================
  // Search
  // ==========================================

  const filteredReports = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return reports;
    }

    return reports.filter((report) => {
      const employeeName =
        report.employee?.fullName?.toLowerCase() || "";

      const employeeId =
        report.employee?.employeeId?.toLowerCase() || "";

      const department =
        report.employee?.department?.toLowerCase() || "";

      const workSummary =
        report.workSummary?.toLowerCase() || "";

      return (
        employeeName.includes(search) ||
        employeeId.includes(search) ||
        department.includes(search) ||
        workSummary.includes(search)
      );
    });
  }, [reports, searchTerm]);

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =====================================
            Header
        ====================================== */}

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 shadow-xl md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3 text-white backdrop-blur-sm">
                  <FaClipboardList size={22} />
                </div>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-50">
                  Admin Panel
                </span>
              </div>

              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Reports Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-100 md:text-base">
                Monitor and review daily work reports submitted by
                employees across the organization.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSyncAlt
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh Reports"}
            </button>
          </div>
        </div>

        {/* =====================================
            Error
        ====================================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-100 p-4 text-red-700 shadow-sm">
            <FaExclamationCircle className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">
                Unable to load reports
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =====================================
            Statistics
        ====================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Reports */}

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Total Reports
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {statistics.totalReports}
                </h2>

                <p className="mt-2 text-xs text-blue-100">
                  All submitted reports
                </p>
              </div>

              <div className="rounded-xl bg-white/15 p-3">
                <FaClipboardList size={20} />
              </div>
            </div>
          </div>

          {/* Employees */}

          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-100">
                  Employees Reporting
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {statistics.uniqueEmployees}
                </h2>

                <p className="mt-2 text-xs text-indigo-100">
                  Unique employees
                </p>
              </div>

              <div className="rounded-xl bg-white/15 p-3">
                <FaUsers size={20} />
              </div>
            </div>
          </div>

          {/* Today */}

          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-100">
                  Reports Today
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {statistics.reportsToday}
                </h2>

                <p className="mt-2 text-xs text-emerald-100">
                  Submitted today
                </p>
              </div>

              <div className="rounded-xl bg-white/15 p-3">
                <FaCheckCircle size={20} />
              </div>
            </div>
          </div>

          {/* With Tasks */}

          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100">
                  Completed Tasks
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {statistics.reportsWithTasks}
                </h2>

                <p className="mt-2 text-xs text-orange-100">
                  Reports containing tasks
                </p>
              </div>

              <div className="rounded-xl bg-white/15 p-3">
                <FaClock size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            Reports Section
        ====================================== */}

        <div className="overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50 shadow-xl">

          {/* Section Header */}

          <div className="border-b border-blue-200 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-50 p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Employee Reports
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Review reports submitted by your workforce.
                </p>
              </div>

              {/* Search */}

              <div className="relative w-full lg:max-w-sm">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search employee, ID, department..."
                  className="w-full rounded-xl border border-blue-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                <p className="mt-4 text-sm font-medium text-slate-600">
                  Loading reports...
                </p>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
            /* Empty */

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="rounded-2xl bg-blue-100 p-5 text-blue-600">
                <FaClipboardList size={30} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No reports found
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                {searchTerm
                  ? "No reports match your search."
                  : "There are currently no employee reports available."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-slate-800 text-left text-xs uppercase tracking-wider text-slate-200">
                      <th className="px-6 py-4 font-semibold">
                        Employee
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Department
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Report Date
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Work Summary
                      </th>

                      <th className="px-6 py-4 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-blue-100">
                    {filteredReports.map((report) => (
                      <tr
                        key={report._id}
                        className="transition hover:bg-blue-100/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow">
                              {report.employee?.fullName
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {report.employee?.fullName ||
                                  "Unknown Employee"}
                              </p>

                              <p className="text-xs text-blue-600">
                                {report.employee?.employeeId ||
                                  "No ID"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                            <FaBuilding />
                            {report.employee?.department ||
                              "Not assigned"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <FaCalendarAlt className="text-blue-500" />
                            {formatDate(report.reportDate)}
                          </div>
                        </td>

                        <td className="max-w-xs px-6 py-4">
                          <p className="truncate text-sm text-slate-600">
                            {report.workSummary ||
                              "No work summary provided."}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedReport(report)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700 hover:shadow-md"
                          >
                            <FaEye />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}

              <div className="space-y-4 p-4 md:hidden">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow">
                          {report.employee?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>

                        <div>
                          <p className="font-bold text-slate-800">
                            {report.employee?.fullName ||
                              "Unknown Employee"}
                          </p>

                          <p className="text-xs text-blue-600">
                            {report.employee?.employeeId ||
                              "No ID"}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Submitted
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/70 p-3">
                        <p className="text-xs text-slate-500">
                          Department
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {report.employee?.department ||
                            "Not assigned"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/70 p-3">
                        <p className="text-xs text-slate-500">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(report.reportDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-white/70 p-3">
                      <p className="text-xs text-slate-500">
                        Work Summary
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {report.workSummary ||
                          "No work summary provided."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedReport(report)
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                    >
                      <FaEye />
                      View Full Report
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* =====================================
            Report Details Modal
        ====================================== */}

        {selectedReport && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}

              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Employee Report
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      {selectedReport.employee?.fullName ||
                        "Unknown Employee"}
                    </h2>

                    <p className="mt-1 text-sm text-blue-100">
                      {selectedReport.employee?.employeeId ||
                        "No employee ID"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    className="rounded-xl bg-white/15 px-3 py-2 text-white transition hover:bg-white/25"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-6">

                {/* Employee Information */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-200 bg-white/60 p-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <FaUserTie />
                      <span className="text-xs font-semibold uppercase">
                        Employee
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-slate-800">
                      {selectedReport.employee?.fullName ||
                        "Unknown"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-indigo-200 bg-white/60 p-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <FaBuilding />
                      <span className="text-xs font-semibold uppercase">
                        Department
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-slate-800">
                      {selectedReport.employee?.department ||
                        "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-white/60 p-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <FaCalendarAlt />
                      <span className="text-xs font-semibold uppercase">
                        Report Date
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-slate-800">
                      {formatDate(selectedReport.reportDate)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-200 bg-white/60 p-4">
                    <div className="flex items-center gap-2 text-orange-600">
                      <FaCheckCircle />
                      <span className="text-xs font-semibold uppercase">
                        Status
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-emerald-600">
                      Submitted
                    </p>
                  </div>
                </div>

                {/* Work Summary */}

                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-100 p-5">
                  <h3 className="font-bold text-blue-800">
                    Work Summary
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {selectedReport.workSummary ||
                      "No work summary provided."}
                  </p>
                </div>

                {/* Tasks */}

                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-5">
                  <h3 className="font-bold text-emerald-800">
                    Tasks Completed
                  </h3>

                  {Array.isArray(
                    selectedReport.tasksCompleted
                  ) &&
                  selectedReport.tasksCompleted.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {selectedReport.tasksCompleted.map(
                        (task, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 rounded-xl bg-white/60 p-3 text-sm text-slate-700"
                          >
                            <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
                            <span>{task}</span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      No tasks were listed.
                    </p>
                  )}
                </div>

                {/* Challenges */}

                {selectedReport.challenges && (
                  <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-5">
                    <h3 className="font-bold text-orange-800">
                      Challenges
                    </h3>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {selectedReport.challenges}
                    </p>
                  </div>
                )}

                {/* Tomorrow Plan */}

                {selectedReport.tomorrowPlan && (
                  <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-100 p-5">
                    <h3 className="font-bold text-purple-800">
                      Tomorrow's Plan
                    </h3>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {selectedReport.tomorrowPlan}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="w-full rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-900"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;

