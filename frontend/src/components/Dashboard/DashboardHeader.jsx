import {
  FaBell,
  FaCalendarAlt,
} from "react-icons/fa";

function DashboardHeader({ employee = {} }) {
  const storedEmployee =
    JSON.parse(localStorage.getItem("employee")) || {};

  const currentEmployee =
    Object.keys(employee).length > 0
      ? employee
      : storedEmployee;

  const fullName =
    currentEmployee?.fullName ||
    currentEmployee?.name ||
    "Employee";

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

      {/* ==========================================
          Left Side
      ========================================== */}

      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">

          <FaCalendarAlt className="text-blue-600" />

          <span>
            {formattedDate}
          </span>

        </div>

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-900
            tracking-tight
          "
        >
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Here's an overview of your workday.
        </p>
      </div>

      {/* ==========================================
          Right Side
      ========================================== */}

      <div className="flex items-center gap-3">

        {/* Notification */}

        <button
          type="button"
          className="
            relative
            w-11
            h-11
            rounded-xl
            bg-white
            border
            border-gray-200
            flex
            items-center
            justify-center
            text-gray-500
            hover:text-blue-600
            hover:border-blue-200
            hover:bg-blue-50
            transition
            shadow-sm
          "
          title="Notifications"
        >
          <FaBell />

          <span
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              rounded-full
              bg-red-500
              border-2
              border-white
            "
          />
        </button>

        {/* Employee */}

        <div
          className="
            hidden
            sm:flex
            items-center
            gap-3
            bg-white
            border
            border-gray-200
            rounded-xl
            px-3
            py-2
            shadow-sm
          "
        >

          {/* Avatar */}

          <div
            className="
              w-9
              h-9
              rounded-lg
              bg-gradient-to-br
              from-blue-600
              to-indigo-700
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-sm
            "
          >
            {fullName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="leading-tight">

            <p className="text-sm font-semibold text-gray-800">
              {fullName}
            </p>

            <p className="text-xs text-gray-400">
              Employee
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardHeader;