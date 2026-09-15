import {
  FaCalendarCheck,
  FaArrowLeft,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function AttendanceHeader() {
  const today = new Date().toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-8">

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
      >
        <FaArrowLeft />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <FaCalendarCheck className="text-blue-600 text-2xl" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Attendance
            </h1>

            <p className="text-gray-500 mt-1">
              Track your working hours and attendance.
            </p>

          </div>

        </div>

        <div className="text-left md:text-right">

          <p className="text-sm text-gray-500">
            Today
          </p>

          <p className="font-semibold text-gray-800">
            {today}
          </p>

        </div>

      </div>

    </div>
  );
}

export default AttendanceHeader;