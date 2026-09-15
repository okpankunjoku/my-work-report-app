import { useState } from "react";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import {
  clockIn,
  clockOut,
} from "../../services/attendanceService";

function ClockInCard({ attendance, onAttendanceUpdate }) {
  const [actionLoading, setActionLoading] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasClockedIn = Boolean(attendance?.clockIn);
  const hasClockedOut = Boolean(attendance?.clockOut);

  const handleClockIn = async () => {
    try {
      setActionLoading("clockIn");
      setMessage("");
      setError("");

      const response = await clockIn();

      setMessage(
        response?.message || "Clock in successful."
      );

      if (onAttendanceUpdate) {
        await onAttendanceUpdate();
      }
    } catch (error) {
      console.error("Clock in error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to clock in. Please try again."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleClockOut = async () => {
    try {
      setActionLoading("clockOut");
      setMessage("");
      setError("");

      const response = await clockOut();

      setMessage(
        response?.message || "Clock out successful."
      );

      if (onAttendanceUpdate) {
        await onAttendanceUpdate();
      }
    } catch (error) {
      console.error("Clock out error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to clock out. Please try again."
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">

        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
          <FaClock className="text-blue-600 text-2xl" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Today's Attendance
          </h2>

          <p className="text-sm text-gray-500">
            Record your working hours
          </p>
        </div>

      </div>

      {/* Status */}
      <div className="bg-slate-50 rounded-xl p-5 mb-6">

        <div className="flex items-center justify-between mb-4">

          <span className="text-sm font-medium text-gray-500">
            Status
          </span>

          {hasClockedOut ? (
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <FaCheckCircle />
              Completed
            </span>
          ) : hasClockedIn ? (
            <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Working
            </span>
          ) : (
            <span className="text-sm font-semibold text-gray-500">
              Not Clocked In
            </span>
          )}

        </div>

        {/* Attendance Times */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Clock In
            </p>

            <p className="text-lg font-bold text-gray-800 mt-1">
              {attendance?.clockIn
                ? new Date(attendance.clockIn).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "--:--"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Clock Out
            </p>

            <p className="text-lg font-bold text-gray-800 mt-1">
              {attendance?.clockOut
                ? new Date(attendance.clockOut).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "--:--"}
            </p>
          </div>

        </div>

      </div>

      {/* Working Hours */}
      {attendance?.workingHours !== undefined &&
        attendance?.workingHours !== null && (
          <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 p-4">

            <p className="text-sm text-gray-500">
              Working Hours
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-1">
              {attendance.workingHours} hrs
            </p>

          </div>
        )}

      {/* Success Message */}
      {message && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Clock In */}
        <button
          type="button"
          onClick={handleClockIn}
          disabled={
            actionLoading !== "" ||
            hasClockedIn
          }
          className="
            flex
            items-center
            justify-center
            gap-3
            px-5
            py-3
            rounded-xl
            font-semibold
            text-white
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-gray-300
            disabled:cursor-not-allowed
            transition
          "
        >
          <FaSignInAlt />

          {actionLoading === "clockIn"
            ? "Clocking In..."
            : hasClockedIn
            ? "Clocked In"
            : "Clock In"}
        </button>

        {/* Clock Out */}
        <button
          type="button"
          onClick={handleClockOut}
          disabled={
            actionLoading !== "" ||
            !hasClockedIn ||
            hasClockedOut
          }
          className="
            flex
            items-center
            justify-center
            gap-3
            px-5
            py-3
            rounded-xl
            font-semibold
            text-white
            bg-gray-700
            hover:bg-gray-800
            disabled:bg-gray-300
            disabled:cursor-not-allowed
            transition
          "
        >
          <FaSignOutAlt />

          {actionLoading === "clockOut"
            ? "Clocking Out..."
            : hasClockedOut
            ? "Clocked Out"
            : "Clock Out"}
        </button>

      </div>

    </div>
  );
}

export default ClockInCard;