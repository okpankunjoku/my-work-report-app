import { useEffect, useState } from "react";

import {
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaCalendarCheck,
  FaHistory,
} from "react-icons/fa";

import api from "../../services/api";

import AttendanceHeader from "../../components/Attendance/AttendanceHeader";

function Attendance() {
  const [attendance, setAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [clockingIn, setClockingIn] = useState(false);
  const [clockingOut, setClockingOut] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  // ==========================================
  // Load attendance + live clock
  // ==========================================

  useEffect(() => {
    fetchTodayAttendance();
    fetchAttendanceHistory();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // Get Today's Attendance
  // ==========================================

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance/today");

      console.log("Today's Attendance:", response.data);

      setAttendance(response.data?.data || null);
    } catch (err) {
      console.error("Attendance Error:", err);

      setAttendance(null);

      setError(
        err.response?.data?.message ||
          "Unable to load today's attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Get Attendance History
  // ==========================================

  const fetchAttendanceHistory = async () => {
    try {
      setHistoryLoading(true);

      const response = await api.get("/attendance/history");

      console.log("Attendance History:", response.data);

      setAttendanceHistory(response.data?.data || []);
    } catch (err) {
      console.error("Attendance History Error:", err);

      setAttendanceHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ==========================================
  // Clock In
  // ==========================================

  const handleClockIn = async () => {
    try {
      setClockingIn(true);
      setMessage("");
      setError("");

      const response = await api.post("/attendance/clock-in");

      console.log("Clock In Response:", response.data);

      if (response.data?.data) {
        setAttendance(response.data.data);
      } else {
        await fetchTodayAttendance();
      }

      // Refresh history so today's record appears immediately
      await fetchAttendanceHistory();

      setMessage(
        response.data?.message || "Clock in successful."
      );
    } catch (err) {
      console.error("Clock In Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to clock in."
      );
    } finally {
      setClockingIn(false);
    }
  };

  // ==========================================
  // Clock Out
  // ==========================================

  const handleClockOut = async () => {
    try {
      setClockingOut(true);
      setMessage("");
      setError("");

      const response = await api.post("/attendance/clock-out");

      console.log("Clock Out Response:", response.data);

      if (response.data?.data) {
        setAttendance(response.data.data);
      } else {
        await fetchTodayAttendance();
      }

      // Refresh history after clock out
      await fetchAttendanceHistory();

      setMessage(
        response.data?.message || "Clock out successful."
      );
    } catch (err) {
      console.error("Clock Out Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to clock out."
      );
    } finally {
      setClockingOut(false);
    }
  };

  // ==========================================
  // Format Time
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "--:--";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--:--";
    }

    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

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

    return parsedDate.toLocaleDateString([], {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // Short Date
  // ==========================================

  const formatHistoryDate = (date) => {
    if (!date) {
      return "--";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Attendance State
  // ==========================================

  const hasClockedIn = Boolean(attendance?.clockIn);

  const hasClockedOut = Boolean(attendance?.clockOut);

  const workingHours = Number(
    attendance?.workingHours || 0
  );

  const attendanceStatus =
    attendance?.status || "Not Clocked In";

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 font-medium">
            Loading attendance...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="space-y-8">

      {/* Header */}
      <AttendanceHeader />

      {/* Success Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <FaCalendarCheck />

            <span className="font-medium">
              {message}
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="font-bold">
              !
            </span>

            <span className="font-medium">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* ==========================================
          Current Time
      ========================================== */}

      <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Current Time
            </p>

            <h2 className="text-4xl font-bold text-blue-600">
              {currentTime.toLocaleTimeString()}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <FaClock className="text-blue-600" />

            <span>
              {currentTime.toLocaleDateString()}
            </span>
          </div>

        </div>

      </div>

      {/* ==========================================
          Attendance Cards
      ========================================== */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* Clock In */}

        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">

          <div className="flex items-center gap-4 mb-5">

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaSignInAlt className="text-green-600 text-xl" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Clock In
              </p>

              <h3 className="text-xl font-bold text-gray-800">
                {formatTime(attendance?.clockIn)}
              </h3>
            </div>

          </div>

          <button
            onClick={handleClockIn}
            disabled={hasClockedIn || clockingIn}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              hasClockedIn || clockingIn
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {clockingIn
              ? "Clocking In..."
              : hasClockedIn
              ? "Already Clocked In"
              : "Clock In"}
          </button>

        </div>

        {/* Clock Out */}

        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">

          <div className="flex items-center gap-4 mb-5">

            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <FaSignOutAlt className="text-red-600 text-xl" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Clock Out
              </p>

              <h3 className="text-xl font-bold text-gray-800">
                {formatTime(attendance?.clockOut)}
              </h3>
            </div>

          </div>

          <button
            onClick={handleClockOut}
            disabled={
              !hasClockedIn ||
              hasClockedOut ||
              clockingOut
            }
            className={`w-full py-3 rounded-xl font-semibold transition ${
              !hasClockedIn ||
              hasClockedOut ||
              clockingOut
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {clockingOut
              ? "Clocking Out..."
              : hasClockedOut
              ? "Already Clocked Out"
              : !hasClockedIn
              ? "Clock In First"
              : "Clock Out"}
          </button>

        </div>

        {/* Working Hours */}

        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">

          <div className="flex items-center gap-4 mb-5">

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaClock className="text-blue-600 text-xl" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Working Hours
              </p>

              <h3 className="text-xl font-bold text-gray-800">
                {workingHours.toFixed(2)} hrs
              </h3>
            </div>

          </div>

          <div
            className={`w-full py-3 rounded-xl text-center font-semibold ${
              hasClockedOut
                ? "bg-blue-100 text-blue-700"
                : hasClockedIn
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {attendanceStatus}
          </div>

        </div>

      </div>

      {/* ==========================================
          Today's Attendance
      ========================================== */}

      <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FaCalendarCheck className="text-blue-600 text-xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Today's Attendance
            </h2>

            <p className="text-gray-500">
              {formatDate(new Date())}
            </p>
          </div>

        </div>

        {attendance ? (
          <div className="grid md:grid-cols-4 gap-4">

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Clock In
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {formatTime(attendance.clockIn)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Clock Out
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {formatTime(attendance.clockOut)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Working Hours
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {workingHours.toFixed(2)} hrs
              </p>
            </div>

            <div
              className={`rounded-xl p-4 ${
                hasClockedOut
                  ? "bg-blue-50"
                  : "bg-green-50"
              }`}
            >
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p
                className={`font-bold mt-1 ${
                  hasClockedOut
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {attendanceStatus}
              </p>
            </div>

          </div>
        ) : (
          <div className="text-center py-10">

            <FaHistory className="text-gray-300 text-4xl mx-auto mb-4" />

            <p className="text-gray-500">
              You have no attendance record for today.
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Click "Clock In" to start your workday.
            </p>

          </div>
        )}

      </div>

      {/* ==========================================
          Attendance History
      ========================================== */}

      <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <FaHistory className="text-purple-600 text-xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Attendance History
            </h2>

            <p className="text-gray-500">
              Your previous attendance records
            </p>
          </div>

        </div>

        {historyLoading ? (
          <div className="py-10 text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading attendance history...
            </p>
          </div>
        ) : attendanceHistory.length === 0 ? (
          <div className="text-center py-10">

            <FaHistory className="text-gray-300 text-4xl mx-auto mb-4" />

            <p className="text-gray-500">
              No attendance history found.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="border-b border-gray-200 text-left">

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Date
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Clock In
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Clock Out
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Working Hours
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {attendanceHistory.map((record) => {

                  const recordStatus =
                    record.status || "Present";

                  return (
                    <tr
                      key={record._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >

                      <td className="px-4 py-4 font-medium text-gray-800">
                        {formatHistoryDate(
                          record.attendanceDate
                        )}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {formatTime(record.clockIn)}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {formatTime(record.clockOut)}
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-800">
                        {Number(
                          record.workingHours || 0
                        ).toFixed(2)}{" "}
                        hrs
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            recordStatus === "Present"
                              ? "bg-green-100 text-green-700"
                              : recordStatus === "Absent"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {recordStatus}
                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Attendance;