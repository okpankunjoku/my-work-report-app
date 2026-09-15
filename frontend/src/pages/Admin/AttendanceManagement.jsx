```jsx
import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaSyncAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import api from "../../services/api";

function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ==========================================
  // FETCH ALL ATTENDANCE
  // ==========================================

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance");

      console.log(
        "ALL ATTENDANCE RESPONSE:",
        response.data
      );

      setAttendance(response.data?.data || []);
    } catch (err) {
      console.error(
        "ATTENDANCE MANAGEMENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load attendance records."
      );

      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString(
      "en-NG",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // ==========================================
  // FILTER ATTENDANCE
  // ==========================================

  const filteredAttendance = attendance.filter(
    (record) => {
      const employeeName =
        record.employee?.fullName || "";

      const employeeId =
        record.employee?.employeeId || "";

      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        employeeName
          .toLowerCase()
          .includes(searchValue) ||
        employeeId
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalRecords = attendance.length;

  const presentRecords = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentRecords = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    if (status === "Present") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Absent") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    if (status === "Present") {
      return <FaUserCheck />;
    }

    if (status === "Absent") {
      return <FaUserTimes />;
    }

    return <FaClock />;
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Attendance Management
              </h1>

              <p className="text-gray-500 mt-2">
                Monitor employee clock-in, clock-out
                and working hours.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAttendance}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
            >
              <FaSyncAlt
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

          </div>
        </div>

        {/* ======================================
            SUMMARY CARDS
        ====================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          {/* Total */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Records
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {totalRecords}
                </h2>

                <p className="text-xs text-gray-500 mt-2">
                  Attendance records
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                <FaUsers />
              </div>

            </div>
          </div>

          {/* Present */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Present
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {presentRecords}
                </h2>

                <p className="text-xs text-gray-500 mt-2">
                  Employees present
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
                <FaUserCheck />
              </div>

            </div>
          </div>

          {/* Absent */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Absent
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {absentRecords}
                </h2>

                <p className="text-xs text-gray-500 mt-2">
                  Employees absent
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl">
                <FaUserTimes />
              </div>

            </div>
          </div>

        </div>

        {/* ======================================
            SEARCH + FILTER
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 mb-6">

          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by employee name or ID..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="md:w-56 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">
                All Status
              </option>

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>
            </select>

          </div>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* ======================================
            RECORD COUNT
        ====================================== */}

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Attendance Records
            </h2>

            <p className="text-sm text-gray-500">
              {filteredAttendance.length} record
              {filteredAttendance.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <FaCalendarAlt />

            {new Date().toLocaleDateString(
              "en-NG",
              {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </div>

        </div>

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

            <FaSyncAlt className="mx-auto text-3xl text-blue-600 animate-spin mb-4" />

            <p className="text-gray-500">
              Loading attendance records...
            </p>

          </div>
        ) : filteredAttendance.length === 0 ? (

          /* ====================================
             EMPTY
          ==================================== */

          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

            <FaClock className="mx-auto text-5xl text-gray-300 mb-4" />

            <h3 className="text-lg font-semibold text-gray-700">
              No attendance records found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or status
              filter.
            </p>

          </div>
        ) : (

          /* ====================================
             TABLE
          ==================================== */

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-gray-50 border-b border-gray-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Employee
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Employee ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Clock In
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Clock Out
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Working Hours
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredAttendance.map(
                    (record) => (

                      <tr
                        key={record._id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* Employee */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                              {record.employee?.fullName
                                ?.charAt(0)
                                ?.toUpperCase() || "E"}

                            </div>

                            <div>

                              <p className="font-semibold text-gray-800">
                                {record.employee?.fullName ||
                                  "Employee"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {record.employee?.department ||
                                  "—"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Employee ID */}

                        <td className="px-6 py-5">

                          <span className="font-medium text-gray-700">
                            {record.employee?.employeeId ||
                              "—"}
                          </span>

                        </td>

                        {/* Date */}

                        <td className="px-6 py-5 text-gray-600">

                          {formatDate(
                            record.attendanceDate
                          )}

                        </td>

                        {/* Clock In */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-gray-700">

                            <FaClock className="text-green-500" />

                            {formatTime(
                              record.clockIn
                            )}

                          </div>

                        </td>

                        {/* Clock Out */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-gray-700">

                            <FaClock className="text-red-500" />

                            {formatTime(
                              record.clockOut
                            )}

                          </div>

                        </td>

                        {/* Working Hours */}

                        <td className="px-6 py-5">

                          <span className="font-medium text-gray-700">
                            {record.workingHours ??
                              0}{" "}
                            hrs
                          </span>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(
                              record.status
                            )}`}
                          >

                            {getStatusIcon(
                              record.status
                            )}

                            {record.status ||
                              "Unknown"}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default AttendanceManagement;
```
