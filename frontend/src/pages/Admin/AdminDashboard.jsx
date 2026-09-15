import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaCalendarCheck,
  FaFileAlt,
  FaClipboardList,
  FaChartLine,
  FaClock,
  FaCalendarAlt,
  FaArrowRight,
  FaUserSlash,
  FaSignInAlt,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCircle,
} from "react-icons/fa";

import api from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ADMIN DASHBOARD
  // ==========================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching admin dashboard...");

      const response = await api.get("/admin/dashboard");

      console.log("Admin dashboard response:", response.data);

      const dashboardData = response.data?.data;

      if (!dashboardData) {
        throw new Error("Invalid dashboard response from server.");
      }

      setDashboard(dashboardData);
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50/60 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-sm p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>

            <div className="animate-pulse">
              <div className="h-7 bg-blue-100 rounded-lg w-56 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-100 rounded-lg w-80 max-w-full mx-auto"></div>
            </div>

            <p className="text-blue-600 font-medium mt-6">
              Loading Admin Dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50/60 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 rounded-3xl border border-red-100 shadow-sm p-8 md:p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-red-500 text-2xl font-bold border border-red-100">
              !
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-5">
              Unable to Load Dashboard
            </h2>

            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboard}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition font-semibold shadow-sm shadow-blue-200"
            >
              Try Again
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // BACKEND DASHBOARD DATA
  // ==========================================

  const employees = dashboard?.employees || {};
  const attendance = dashboard?.attendance || {};
  const reports = dashboard?.reports || {};
  const recentActivities = dashboard?.recentActivities || [];

  // ==========================================
  // EMPLOYEE STATISTICS
  // ==========================================

  const totalEmployees = employees.totalEmployees ?? 0;
  const activeEmployees = employees.activeEmployees ?? 0;
  const inactiveEmployees = employees.inactiveEmployees ?? 0;
  const suspendedEmployees = employees.suspendedEmployees ?? 0;

  // ==========================================
  // ATTENDANCE STATISTICS
  // ==========================================

  const presentToday = attendance.presentToday ?? 0;
  const absentToday = attendance.absentToday ?? 0;
  const attendanceRate = attendance.attendanceRate ?? 0;

  // ==========================================
  // REPORT STATISTICS
  // ==========================================

  const reportsSubmitted = reports.reportsSubmittedToday ?? 0;
  const reportsPending = reports.reportsPendingToday ?? 0;

  const reportCompletion =
    totalEmployees > 0
      ? Math.round((reportsSubmitted / totalEmployees) * 100)
      : 0;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // FORMAT ACTIVITY DATE/TIME
  // ==========================================

  const formatActivityTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // FORMAT WORKING HOURS
  // ==========================================

  const formatWorkingHours = (hours, status, clockOut) => {
    // Employee is still working.
    if (!clockOut && status === "Active") {
      return "Working";
    }

    // Previous incomplete attendance.
    if (!clockOut && status === "Incomplete") {
      return "—";
    }

    if (!hours || Number(hours) <= 0) {
      return "—";
    }

    const totalMinutes = Math.round(Number(hours) * 60);

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h === 0) {
      return `${m} min`;
    }

    if (m === 0) {
      return `${h} hr${h !== 1 ? "s" : ""}`;
    }

    return `${h}h ${m}m`;
  };

  // ==========================================
  // GET ATTENDANCE STATUS
  // ==========================================

  const getAttendanceStatus = (record) => {
    /*
      ACTIVE
      Employee clocked in but has not clocked out.
    */
    if (record.clockIn && !record.clockOut) {
      /*
        If backend already marked an older record as
        Incomplete, preserve that status.
      */
      if (record.status === "Incomplete") {
        return "Incomplete";
      }

      return "Active";
    }

    /*
      COMPLETE
      Employee successfully clocked in and clocked out.
    */
    if (record.clockIn && record.clockOut) {
      return "Complete";
    }

    /*
      ABSENT
      No clock-in record.
    */
    if (!record.clockIn) {
      return "Absent";
    }

    return record.status || "Unknown";
  };

  // ==========================================
  // ATTENDANCE STATUS STYLE
  // ==========================================

  const getAttendanceStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return {
          wrapper:
            "bg-green-50 text-green-700 border border-green-200",
          dot: "bg-green-500",
          icon: <FaCircle className="text-[8px]" />,
        };

      case "Complete":
        return {
          wrapper:
            "bg-blue-50 text-blue-700 border border-blue-200",
          dot: "bg-blue-500",
          icon: <FaCheckCircle />,
        };

      case "Incomplete":
        return {
          wrapper:
            "bg-amber-50 text-amber-700 border border-amber-200",
          dot: "bg-amber-500",
          icon: <FaExclamationTriangle />,
        };

      case "Absent":
        return {
          wrapper:
            "bg-red-50 text-red-700 border border-red-200",
          dot: "bg-red-500",
          icon: <FaUserTimes />,
        };

      default:
        return {
          wrapper:
            "bg-gray-50 text-gray-600 border border-gray-200",
          dot: "bg-gray-400",
          icon: <FaCircle className="text-[8px]" />,
        };
    }
  };

  // ==========================================
  // EMPLOYEE STATUS STYLE
  // ==========================================

  const getEmployeeStatusStyle = (status) => {
    switch (status) {
      case "Suspended":
        return "bg-red-50 text-red-700 border border-red-100";

      case "Inactive":
        return "bg-gray-100 text-gray-700 border border-gray-200";

      case "Active":
      default:
        return "bg-green-50 text-green-700 border border-green-100";
    }
  };

  // ==========================================
  // ACTIVITY STYLE
  // ==========================================

  const getActivityStyle = (type) => {
    switch (type) {
      case "clock-in":
        return {
          icon: <FaSignInAlt />,
          wrapper:
            "bg-green-50 text-green-600 border border-green-100",
          dot: "bg-green-500",
        };

      case "clock-out":
        return {
          icon: <FaSignOutAlt />,
          wrapper:
            "bg-blue-50 text-blue-600 border border-blue-100",
          dot: "bg-blue-500",
        };

      case "report":
        return {
          icon: <FaFileAlt />,
          wrapper:
            "bg-purple-50 text-purple-600 border border-purple-100",
          dot: "bg-purple-500",
        };

      default:
        return {
          icon: <FaChartLine />,
          wrapper:
            "bg-blue-50 text-blue-600 border border-blue-100",
          dot: "bg-blue-500",
        };
    }
  };

  // ==========================================
  // STATISTIC CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon,
    description,
    accent = "blue",
  }) => {
    const accentStyles = {
      blue: {
        wrapper: "hover:border-blue-200",
        icon: "bg-blue-100 text-blue-600",
        value: "text-gray-900",
      },
      green: {
        wrapper: "hover:border-green-200",
        icon: "bg-green-100 text-green-600",
        value: "text-gray-900",
      },
      red: {
        wrapper: "hover:border-red-200",
        icon: "bg-red-100 text-red-600",
        value: "text-gray-900",
      },
      purple: {
        wrapper: "hover:border-purple-200",
        icon: "bg-purple-100 text-purple-600",
        value: "text-gray-900",
      },
    };

    const style = accentStyles[accent] || accentStyles.blue;

    return (
      <div
        className={`group relative overflow-hidden bg-white/90 rounded-2xl border border-blue-100 shadow-sm p-5 md:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.wrapper}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${style.value}`}
            >
              {value}
            </h2>

            {description && (
              <p className="text-xs text-gray-500 mt-2">
                {description}
              </p>
            )}
          </div>

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${style.icon}`}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // SECTION HEADER
  // ==========================================

  const SectionHeader = ({
    title,
    actionText,
    onAction,
  }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          {title}
        </h2>

        {actionText && (
          <button
            type="button"
            onClick={onAction}
            className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            {actionText}
            <FaArrowRight className="text-xs" />
          </button>
        )}
      </div>
    );
  };

  // ==========================================
  // GO TO EMPLOYEE MANAGEMENT
  // ==========================================

  const handleManageEmployees = () => {
    navigate("/employees");
  };

  // ==========================================
  // GO TO ATTENDANCE
  // ==========================================

  const handleViewAttendance = () => {
    navigate("/attendance");
  };

  // ==========================================
  // GO TO REPORTS
  // ==========================================

  const handleViewReports = () => {
    navigate("/reports");
  };

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50/60 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 shadow-lg shadow-blue-200/50 text-white overflow-hidden relative">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="absolute right-20 -bottom-20 w-40 h-40 rounded-full bg-white/5"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                  <FaChartLine />
                  Workforce Overview
                </div>

                <h1 className="text-2xl md:text-4xl font-bold">
                  Admin Dashboard
                </h1>

                <p className="text-blue-100 mt-2 max-w-xl text-sm md:text-base">
                  Monitor employees, attendance and daily work reports from one place.
                </p>
              </div>

              <div className="inline-flex self-start lg:self-auto items-center gap-3 bg-white/10 border border-white/20 px-4 py-3 rounded-2xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <FaCalendarAlt />
                </div>

                <div>
                  <p className="text-xs text-blue-100">
                    Today
                  </p>

                  <span className="text-sm font-semibold">
                    {new Date().toLocaleDateString("en-NG", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================
            EMPLOYEE OVERVIEW
        ====================================== */}

        <div className="mb-8">
          <SectionHeader
            title="Employee Overview"
            actionText="Manage Employees"
            onAction={handleManageEmployees}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={<FaUsers />}
              description="Registered employees"
              accent="blue"
            />

            <StatCard
              title="Active Employees"
              value={activeEmployees}
              icon={<FaUserCheck />}
              description="Currently active"
              accent="green"
            />

            <StatCard
              title="Inactive Employees"
              value={inactiveEmployees}
              icon={<FaUserTimes />}
              description="Inactive accounts"
              accent="purple"
            />

            <StatCard
              title="Suspended Employees"
              value={suspendedEmployees}
              icon={<FaUserSlash />}
              description="Suspended accounts"
              accent="red"
            />
          </div>
        </div>

        {/* ======================================
            TODAY'S ATTENDANCE
        ====================================== */}

        <div className="mb-8">
          <SectionHeader
            title="Today's Attendance"
            actionText="View Attendance"
            onAction={handleViewAttendance}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <StatCard
              title="Present Today"
              value={presentToday}
              icon={<FaCalendarCheck />}
              description="Employees present"
              accent="green"
            />

            <StatCard
              title="Absent Today"
              value={absentToday}
              icon={<FaUserTimes />}
              description="Employees absent"
              accent="red"
            />

            <StatCard
              title="Attendance Rate"
              value={`${attendanceRate}%`}
              icon={<FaChartLine />}
              description="Today's attendance"
              accent="blue"
            />

            <StatCard
              title="Reports Submitted"
              value={reportsSubmitted}
              icon={<FaFileAlt />}
              description="Reports submitted today"
              accent="purple"
            />
          </div>
        </div>

        {/* ======================================
            DAILY REPORTS
        ====================================== */}

        <div className="mb-8">
          <SectionHeader
            title="Daily Reports"
            actionText="View Reports"
            onAction={handleViewReports}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <StatCard
              title="Reports Submitted"
              value={reportsSubmitted}
              icon={<FaFileAlt />}
              description="Completed reports"
              accent="green"
            />

            <StatCard
              title="Reports Pending"
              value={reportsPending}
              icon={<FaClipboardList />}
              description="Employees yet to submit"
              accent="red"
            />

            <StatCard
              title="Report Completion"
              value={`${reportCompletion}%`}
              icon={<FaChartLine />}
              description="Daily completion rate"
              accent="blue"
            />
          </div>
        </div>

        {/* ======================================
            RECENT EMPLOYEES & REPORTS
        ====================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mb-8">

          {/* ====================================
              RECENT EMPLOYEES
          ==================================== */}

          <div className="bg-white/90 rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-blue-100 bg-blue-50/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Recent Employees
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Recently registered employees
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleManageEmployees}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition whitespace-nowrap"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {dashboard?.recentEmployees?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.recentEmployees.map((employee) => (
                    <div
                      key={employee._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-50 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {employee.profileImage ? (
                          <img
                            src={employee.profileImage}
                            alt={employee.fullName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase flex-shrink-0">
                            {employee.fullName?.charAt(0) || "E"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {employee.fullName}
                          </p>

                          <p className="text-sm text-gray-500 truncate">
                            {employee.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium ${getEmployeeStatusStyle(
                            employee.status
                          )}`}
                        >
                          {employee.status || "Active"}
                        </span>

                        <button
                          type="button"
                          onClick={handleManageEmployees}
                          title="Manage Employee"
                          className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs font-semibold border border-blue-100"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                    <FaUsers className="text-blue-300 text-2xl" />
                  </div>

                  <p className="text-gray-500 text-sm">
                    No recent employees found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ====================================
              RECENT REPORTS
          ==================================== */}

          <div className="bg-white/90 rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-blue-100 bg-blue-50/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Recent Reports
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Latest employee work reports
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleViewReports}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition whitespace-nowrap"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {dashboard?.recentReports?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.recentReports.map((report) => (
                    <div
                      key={report._id}
                      className="border-b border-blue-50 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <FaFileAlt />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800">
                            {report.employee?.fullName || "Employee"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {report.workSummary ||
                              "Work report submitted"}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <FaCalendarAlt className="text-blue-400 text-xs" />

                            <p className="text-xs text-gray-400">
                              {formatDate(report.reportDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                    <FaFileAlt className="text-blue-300 text-2xl" />
                  </div>

                  <p className="text-gray-500 text-sm">
                    No recent reports found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================
            RECENT ATTENDANCE
        ====================================== */}

        <div className="bg-white/90 rounded-2xl border border-blue-100 shadow-sm overflow-hidden mb-8">
          <div className="p-5 md:p-6 border-b border-blue-100 bg-blue-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <FaClock />
                  </div>

                  <h2 className="text-lg font-bold text-gray-800">
                    Recent Attendance
                  </h2>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Latest employee attendance records
                </p>
              </div>

              <button
                type="button"
                onClick={handleViewAttendance}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-semibold shadow-sm shadow-blue-200"
              >
                View Attendance
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {dashboard?.recentAttendance?.length > 0 ? (
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-blue-50/70 border-b border-blue-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Employee
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Clock In
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Clock Out
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Working Time
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentAttendance.map((record) => {
                    const attendanceStatus =
                      getAttendanceStatus(record);

                    const statusStyle =
                      getAttendanceStatusStyle(
                        attendanceStatus
                      );

                    return (
                      <tr
                        key={record._id}
                        className="border-b border-blue-50 last:border-0 hover:bg-blue-50/40 transition-colors"
                      >
                        {/* EMPLOYEE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                {record.employee?.fullName?.charAt(0) ||
                                  "E"}
                              </div>

                              {attendanceStatus === "Active" && (
                                <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white animate-pulse"></span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {record.employee?.fullName ||
                                  "Employee"}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                <span className="text-xs text-blue-600 font-medium">
                                  {record.employee?.employeeId || "—"}
                                </span>

                                {record.employee?.department && (
                                  <>
                                    <span className="text-gray-300">
                                      •
                                    </span>

                                    <span className="text-xs text-gray-500">
                                      {record.employee.department}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-400 text-xs" />

                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {formatDate(record.attendanceDate)}
                            </span>
                          </div>
                        </td>

                        {/* CLOCK IN */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                              <FaSignInAlt className="text-xs" />
                            </div>

                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                              {formatTime(record.clockIn)}
                            </span>
                          </div>
                        </td>

                        {/* CLOCK OUT */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                record.clockOut
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <FaSignOutAlt className="text-xs" />
                            </div>

                            <span
                              className={`text-sm font-medium whitespace-nowrap ${
                                record.clockOut
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }`}
                            >
                              {formatTime(record.clockOut)}
                            </span>
                          </div>
                        </td>

                        {/* WORKING TIME */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                attendanceStatus === "Active"
                                  ? "bg-green-50 text-green-600"
                                  : attendanceStatus === "Complete"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <FaClock className="text-xs" />
                            </div>

                            <div>
                              <p
                                className={`text-sm font-semibold ${
                                  attendanceStatus === "Active"
                                    ? "text-green-600"
                                    : "text-gray-700"
                                }`}
                              >
                                {formatWorkingHours(
                                  record.workingHours,
                                  attendanceStatus,
                                  record.clockOut
                                )}
                              </p>

                              {attendanceStatus === "Active" && (
                                <p className="text-[11px] text-green-500 font-medium">
                                  Currently working
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle.wrapper}`}
                          >
                            {attendanceStatus === "Active" ? (
                              <span
                                className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}
                              ></span>
                            ) : (
                              <span className="text-xs">
                                {statusStyle.icon}
                              </span>
                            )}

                            {attendanceStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                  <FaClock className="text-blue-300 text-2xl" />
                </div>

                <p className="text-gray-500 text-sm">
                  No recent attendance records found.
                </p>
              </div>
            )}
          </div>

          {/* STATUS LEGEND */}

          {dashboard?.recentAttendance?.length > 0 && (
            <div className="px-5 md:px-6 py-4 bg-blue-50/40 border-t border-blue-100">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-xs font-semibold text-gray-500">
                  Status:
                </span>

                <span className="inline-flex items-center gap-2 text-xs text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active
                </span>

                <span className="inline-flex items-center gap-2 text-xs text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Complete
                </span>

                <span className="inline-flex items-center gap-2 text-xs text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Incomplete
                </span>

                <span className="inline-flex items-center gap-2 text-xs text-red-700">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Absent
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ======================================
            RECENT ACTIVITY
        ====================================== */}

        <div className="bg-white/90 rounded-2xl border border-blue-100 shadow-sm overflow-hidden mb-8">
          <div className="p-5 md:p-6 border-b border-blue-100 bg-blue-50/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Activity
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest employee activity across ClockIn Pro
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                <FaChartLine />
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const style = getActivityStyle(activity.type);

                  return (
                    <div
                      key={`${activity.type}-${activity.timestamp}-${index}`}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-blue-50 bg-blue-50/30 hover:bg-blue-50/60 transition-colors"
                    >
                      {/* Activity Icon */}

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${style.wrapper}`}
                      >
                        {style.icon}
                      </div>

                      {/* Activity Details */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                          <p className="font-semibold text-gray-800">
                            {activity.message || "Employee activity"}
                          </p>

                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatActivityTime(
                              activity.timestamp
                            )}
                          </span>
                        </div>

                        {activity.employee && (
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                            <span className="text-xs text-blue-600 font-medium">
                              {activity.employee.employeeId || "—"}
                            </span>

                            {activity.employee.department && (
                              <span className="text-xs text-gray-500">
                                {activity.employee.department}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                          ></span>

                          <span className="text-xs text-gray-400 capitalize">
                            {activity.type?.replace("-", " ") ||
                              "Activity"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                  <FaChartLine className="text-blue-300 text-2xl" />
                </div>

                <p className="text-gray-500 text-sm">
                  No recent activity found.
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Employee clock-ins, clock-outs and report submissions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;