import {
  FaCalendarCheck,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaArrowRight,
} from "react-icons/fa";

function AttendanceCard({ attendance = {} }) {
  // ==========================================
  // Format Time
  // ==========================================
  const formatTime = (date) => {
    if (!date) return "-- : --";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-- : --";
    }

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // Format Date
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
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

  const status = attendance?.status ||
    (hasClockedIn ? "Present" : "Not Clocked In");

  // ==========================================
  // Status Styling
  // ==========================================
  const statusStyles = hasClockedIn
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-gray-50 text-gray-600 border-gray-100";

  return (
    <div
      className="
        relative
        overflow-hidden
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-sm
        p-6
        sm:p-8
        transition-all
        duration-300
        hover:shadow-md
      "
    >
      {/* Decorative Background */}
      <div
        className="
          absolute
          -right-12
          -top-12
          w-40
          h-40
          rounded-full
          bg-blue-50
          opacity-70
        "
      ></div>

      {/* ==========================================
          Header
      ========================================== */}
      <div
        className="
          relative
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-8
        "
      >
        <div className="flex items-center gap-4">

          {/* Icon */}
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-blue-50
              border
              border-blue-100
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <FaCalendarCheck className="text-blue-600 text-xl" />
          </div>

          {/* Title */}
          <div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Today's Attendance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your attendance information for today
            </p>

          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            border
            text-sm
            font-semibold
            w-fit
            ${statusStyles}
          `}
        >
          <span
            className={`
              w-2
              h-2
              rounded-full
              ${
                hasClockedIn
                  ? "bg-green-500"
                  : "bg-gray-400"
              }
            `}
          ></span>

          {status}
        </div>
      </div>

      {/* ==========================================
          Attendance Information
      ========================================== */}
      <div
        className="
          relative
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >

        {/* Status */}
        <div
          className="
            group
            rounded-2xl
            bg-gray-50
            border
            border-gray-100
            p-5
            transition-all
            duration-300
            hover:bg-green-50
            hover:border-green-100
          "
        >
          <div className="flex items-center justify-between mb-4">

            <p className="text-sm font-medium text-gray-500">
              Status
            </p>

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-green-100
                text-green-600
                flex
                items-center
                justify-center
              "
            >
              <FaCalendarCheck />
            </div>

          </div>

          <p
            className={`
              text-xl
              font-bold
              ${
                hasClockedIn
                  ? "text-green-600"
                  : "text-gray-500"
              }
            `}
          >
            {status}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Today's attendance
          </p>
        </div>

        {/* Clock In */}
        <div
          className="
            group
            rounded-2xl
            bg-gray-50
            border
            border-gray-100
            p-5
            transition-all
            duration-300
            hover:bg-green-50
            hover:border-green-100
          "
        >
          <div className="flex items-center justify-between mb-4">

            <p className="text-sm font-medium text-gray-500">
              Clock In
            </p>

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-green-100
                text-green-600
                flex
                items-center
                justify-center
              "
            >
              <FaSignInAlt />
            </div>

          </div>

          <p className="text-xl font-bold text-gray-800">
            {formatTime(attendance?.clockIn)}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Start of work
          </p>
        </div>

        {/* Clock Out */}
        <div
          className="
            group
            rounded-2xl
            bg-gray-50
            border
            border-gray-100
            p-5
            transition-all
            duration-300
            hover:bg-red-50
            hover:border-red-100
          "
        >
          <div className="flex items-center justify-between mb-4">

            <p className="text-sm font-medium text-gray-500">
              Clock Out
            </p>

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-red-100
                text-red-500
                flex
                items-center
                justify-center
              "
            >
              <FaSignOutAlt />
            </div>

          </div>

          <p className="text-xl font-bold text-gray-800">
            {formatTime(attendance?.clockOut)}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            End of work
          </p>
        </div>

        {/* Working Hours */}
        <div
          className="
            group
            rounded-2xl
            bg-gray-50
            border
            border-gray-100
            p-5
            transition-all
            duration-300
            hover:bg-blue-50
            hover:border-blue-100
          "
        >
          <div className="flex items-center justify-between mb-4">

            <p className="text-sm font-medium text-gray-500">
              Working Hours
            </p>

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <FaClock />
            </div>

          </div>

          <p className="text-xl font-bold text-gray-800">
            {workingHours.toFixed(2)} hrs
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Total today
          </p>
        </div>

      </div>

      {/* ==========================================
          Footer
      ========================================== */}
      <div
        className="
          relative
          mt-6
          pt-5
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
        <p className="text-sm text-gray-500">
          Attendance Date:{" "}
          <span className="font-semibold text-gray-700">
            {formatDate(
              attendance?.attendanceDate ||
                attendance?.date
            )}
          </span>
        </p>

        <a
          href="/attendance"
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
          Manage Attendance

          <FaArrowRight className="text-xs" />
        </a>
      </div>
    </div>
  );
}

export default AttendanceCard;