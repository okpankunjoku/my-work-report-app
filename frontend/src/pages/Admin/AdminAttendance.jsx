import { useEffect, useMemo, useState } from "react";

import {
  FaClock,
  FaCalendarCheck,
  FaSearch,
  FaSyncAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSignOutAlt,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";

import api from "../../services/api";

function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  // ==========================================
  // UPDATE CURRENT TIME
  // ==========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // FETCH ALL ATTENDANCE
  // ==========================================

  const fetchAttendance = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/attendance/all");

      console.log("ADMIN ATTENDANCE RESPONSE:", response.data);

      const records = response.data?.data;

      setAttendance(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("ADMIN ATTENDANCE ERROR:", err);
      console.error("SERVER RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Unable to load attendance records."
      );

      setAttendance([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ==========================================
  // GET LOCAL DATE STRING
  // ==========================================

  const getLocalDateString = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const year = parsedDate.getFullYear();

    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      parsedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // CHECK IF RECORD IS TODAY
  // ==========================================

  const isToday = (record) => {
    if (!record?.attendanceDate) {
      return false;
    }

    return (
      getLocalDateString(record.attendanceDate) ===
      getLocalDateString(currentTime)
    );
  };

  // ==========================================
  // GET ATTENDANCE STATUS
  // ==========================================

  const getAttendanceStatus = (record) => {
    const hasClockIn = Boolean(record?.clockIn);
    const hasClockOut = Boolean(record?.clockOut);

    if (!hasClockIn) {
      return "Absent";
    }

    if (hasClockIn && hasClockOut) {
      return "Clocked Out";
    }

    if (hasClockIn && !hasClockOut && isToday(record)) {
      return "Working";
    }

    if (hasClockIn && !hasClockOut && !isToday(record)) {
      return "Incomplete";
    }

    return "Incomplete";
  };

  // ==========================================
  // CALCULATE WORKING HOURS
  // ==========================================

  const getWorkingHours = (record) => {
    if (!record) {
      return null;
    }

    const hasClockIn = Boolean(record.clockIn);
    const hasClockOut = Boolean(record.clockOut);

    if (!hasClockIn) {
      return null;
    }

    // Clocked out
    if (hasClockOut) {
      const savedHours = Number(record.workingHours);

      if (
        Number.isFinite(savedHours) &&
        savedHours > 0
      ) {
        return savedHours;
      }

      const clockIn = new Date(record.clockIn);
      const clockOut = new Date(record.clockOut);

      if (
        Number.isNaN(clockIn.getTime()) ||
        Number.isNaN(clockOut.getTime())
      ) {
        return null;
      }

      const hours =
        (clockOut - clockIn) /
        (1000 * 60 * 60);

      if (hours < 0) {
        return null;
      }

      return hours;
    }

    // Currently working today
    if (isToday(record)) {
      const clockIn = new Date(record.clockIn);

      if (Number.isNaN(clockIn.getTime())) {
        return null;
      }

      const hours =
        (currentTime - clockIn) /
        (1000 * 60 * 60);

      if (hours < 0) {
        return 0;
      }

      return hours;
    }

    // Old incomplete record
    return null;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Working":
        return "bg-blue-50 text-blue-700 border border-blue-100";

      case "Clocked Out":
        return "bg-green-50 text-green-700 border border-green-100";

      case "Incomplete":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100";

      case "Absent":
        return "bg-red-50 text-red-700 border border-red-100";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Working":
        return <FaHourglassHalf />;

      case "Clocked Out":
        return <FaSignOutAlt />;

      case "Incomplete":
        return <FaTimesCircle />;

      case "Absent":
        return <FaTimesCircle />;

      default:
        return <FaClock />;
    }
  };

  // ==========================================
  // FILTER ATTENDANCE
  // ==========================================

  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      const employee = record.employee || {};

      const fullName = employee.fullName || "";
      const employeeId = employee.employeeId || "";
      const department = employee.department || "";
      const position = employee.position || "";

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        fullName.toLowerCase().includes(searchValue) ||
        employeeId.toLowerCase().includes(searchValue) ||
        department.toLowerCase().includes(searchValue) ||
        position.toLowerCase().includes(searchValue);

      const recordStatus = getAttendanceStatus(record);

      const matchesStatus =
        statusFilter === "All" ||
        recordStatus === statusFilter;

      const matchesDate =
        !dateFilter ||
        getLocalDateString(record.attendanceDate) ===
          dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    attendance,
    search,
    statusFilter,
    dateFilter,
    currentTime,
  ]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalRecords = attendance.length;

  const workingRecords = attendance.filter(
    (record) =>
      getAttendanceStatus(record) === "Working"
  ).length;

  const clockedOutRecords = attendance.filter(
    (record) =>
      getAttendanceStatus(record) === "Clocked Out"
  ).length;

  const incompleteRecords = attendance.filter(
    (record) =>
      getAttendanceStatus(record) === "Incomplete"
  ).length;

  const absentRecords = attendance.filter(
    (record) =>
      getAttendanceStatus(record) === "Absent"
  ).length;

  const presentRecords = clockedOutRecords;

  // ==========================================
  // TOTAL WORKING HOURS
  // ==========================================

  const totalWorkingHours = attendance.reduce(
    (total, record) => {
      const status = getAttendanceStatus(record);
      const hours = getWorkingHours(record);

      if (
        status === "Clocked Out" ||
        status === "Working"
      ) {
        if (
          hours !== null &&
          Number.isFinite(hours)
        ) {
          return total + hours;
        }
      }

      return total;
    },
    0
  );

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white/90 border border-blue-100 rounded-3xl shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
            <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Loading Attendance
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Please wait while we retrieve attendance records.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50/60 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 shadow-lg shadow-blue-200/50 text-white overflow-hidden relative">
          <div className="absolute -right-16 -top-20 w-52 h-52 rounded-full bg-white/10"></div>
          <div className="absolute right-24 -bottom-24 w-44 h-44 rounded-full bg-white/5"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <FaCalendarCheck />
                Attendance Management
              </div>

              <h1 className="text-2xl md:text-4xl font-bold">
                Admin Attendance
              </h1>

              <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base">
                Monitor employee attendance, working status and daily working hours.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchAttendance(true)}
              disabled={refreshing}
              className={`relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition shadow-sm ${
                refreshing
                  ? "bg-white/10 text-blue-100 cursor-not-allowed border border-white/10"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
            >
              <FaSyncAlt
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaTimesCircle />
              </div>

              <div>
                <p className="font-semibold">
                  Unable to load attendance
                </p>

                <p className="text-sm mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================
            SUMMARY
        ====================================== */}

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Attendance Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current attendance statistics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">

            {/* Total */}

            <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Records
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {totalRecords}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    All attendance records
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FaUsers className="text-blue-600" />
                </div>
              </div>
            </div>

            {/* Present */}

            <div className="bg-white/90 border border-green-100 rounded-2xl shadow-sm p-5 hover:shadow-md hover:border-green-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Present
                  </p>

                  <h2 className="text-3xl font-bold text-green-600 mt-2">
                    {presentRecords}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Completed attendance
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" />
                </div>
              </div>
            </div>

            {/* Working */}

            <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Currently Working
                  </p>

                  <h2 className="text-3xl font-bold text-blue-600 mt-2">
                    {workingRecords}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Clocked in today
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FaHourglassHalf className="text-blue-600" />
                </div>
              </div>
            </div>

            {/* Clocked Out */}

            <div className="bg-white/90 border border-green-100 rounded-2xl shadow-sm p-5 hover:shadow-md hover:border-green-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Clocked Out
                  </p>

                  <h2 className="text-3xl font-bold text-green-600 mt-2">
                    {clockedOutRecords}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Completed workday
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaSignOutAlt className="text-green-600" />
                </div>
              </div>
            </div>

            {/* Incomplete */}

            <div className="bg-white/90 border border-yellow-100 rounded-2xl shadow-sm p-5 hover:shadow-md hover:border-yellow-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Incomplete
                  </p>

                  <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                    {incompleteRecords}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Missing clock-out
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <FaTimesCircle className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================
            WORKING HOURS SUMMARY
        ====================================== */}

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaClock className="text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Recorded Working Hours
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {totalWorkingHours.toFixed(2)} hrs
                </h3>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Includes completed and currently active work sessions
            </div>
          </div>
        </div>

        {/* ======================================
            FILTERS
        ====================================== */}

        <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-blue-100 bg-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaFilter className="text-blue-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Filter Attendance
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Search and filter attendance records
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Search */}

              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employee, ID, department..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status */}

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Working">
                    Working
                  </option>

                  <option value="Clocked Out">
                    Clocked Out
                  </option>

                  <option value="Incomplete">
                    Incomplete
                  </option>

                  <option value="Absent">
                    Absent
                  </option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ▾
                </span>
              </div>

              {/* Date */}

              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value)
                  }
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {(search ||
              statusFilter !== "All" ||
              dateFilter) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-5 border-t border-blue-50">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {filteredAttendance.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {attendance.length}
                  </span>{" "}
                  records
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setDateFilter("");
                  }}
                  className="self-start sm:self-auto text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ======================================
            ATTENDANCE RECORDS
        ====================================== */}

        <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-blue-100 bg-blue-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Attendance Records
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Showing{" "}
                  <span className="font-semibold text-blue-600">
                    {filteredAttendance.length}
                  </span>{" "}
                  records
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaClock className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredAttendance.length === 0 ? (
              <div className="py-16 text-center px-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <FaCalendarCheck className="text-blue-300 text-3xl" />
                </div>

                <h3 className="text-lg font-semibold text-gray-700">
                  No attendance records found
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="bg-blue-50/70 border-b border-blue-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Employee
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Department
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
                      Working Hours
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendance.map((record) => {
                    const employee =
                      record.employee || {};

                    const status =
                      getAttendanceStatus(record);

                    const workingHours =
                      getWorkingHours(record);

                    return (
                      <tr
                        key={record._id}
                        className="border-b border-blue-50 last:border-0 hover:bg-blue-50/40 transition-colors"
                      >
                        {/* Employee */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase flex-shrink-0">
                              {employee.fullName?.charAt(0) ||
                                "E"}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {employee.fullName ||
                                  "Unknown Employee"}
                              </p>

                              <p className="text-xs text-gray-500">
                                {employee.employeeId ||
                                  "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}

                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">
                            {employee.department || "—"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {employee.position || ""}
                          </p>
                        </td>

                        {/* Date */}

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(
                            record.attendanceDate
                          )}
                        </td>

                        {/* Clock In */}

                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                            <FaClock className="text-green-500" />

                            {formatTime(record.clockIn)}
                          </div>
                        </td>

                        {/* Clock Out */}

                        <td className="px-6 py-4">
                          {record.clockOut ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
                              <FaClock className="text-red-500" />

                              {formatTime(record.clockOut)}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              —
                            </span>
                          )}
                        </td>

                        {/* Working Hours */}

                        <td className="px-6 py-4">
                          {workingHours !== null &&
                          Number.isFinite(
                            workingHours
                          ) ? (
                            <div className="flex items-center gap-2">
                              <FaHourglassHalf className="text-blue-400" />

                              <span className="font-semibold text-gray-800">
                                {workingHours.toFixed(2)} hrs
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {getStatusIcon(status)}

                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ======================================
            FOOTER INFORMATION
        ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1 pb-4">
          <p className="text-xs text-gray-400">
            Attendance data is retrieved from the workforce management system.
          </p>

          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;

