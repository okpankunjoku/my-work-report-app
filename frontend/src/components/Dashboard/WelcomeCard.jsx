import {
  FaBriefcase,
  FaCalendarCheck,
  FaArrowRight,
} from "react-icons/fa";

function WelcomeCard({ employee = {} }) {
  // ==========================================
  // Employee Information
  // ==========================================
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

  const position =
    currentEmployee?.position ||
    currentEmployee?.jobTitle ||
    "Team Member";

  const department =
    currentEmployee?.department ||
    "Workforce Team";

  const firstName = fullName.split(" ")[0];

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-blue-600
        via-blue-700
        to-indigo-800
        text-white
        shadow-xl
      "
    >
      {/* ==========================================
          Decorative Background
      ========================================== */}

      <div
        className="
          absolute
          -right-20
          -top-20
          w-72
          h-72
          rounded-full
          bg-white/10
          blur-2xl
        "
      />

      <div
        className="
          absolute
          -bottom-24
          right-24
          w-64
          h-64
          rounded-full
          bg-indigo-400/10
          blur-3xl
        "
      />

      {/* ==========================================
          Content
      ========================================== */}

      <div
        className="
          relative
          z-10
          p-6
          sm:p-8
          lg:p-10
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-8
          "
        >

          {/* ========================================
              Left Content
          ======================================== */}

          <div className="max-w-2xl">

            {/* Small Label */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                bg-white/10
                border
                border-white/20
                text-blue-100
                text-xs
                font-semibold
                mb-5
              "
            >
              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-400
                  animate-pulse
                "
              />

              Workforce Dashboard
            </div>

            {/* Greeting */}

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                tracking-tight
              "
            >
              Welcome back,
              <span className="block text-blue-100 mt-1">
                {firstName} 👋
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mt-5
                text-blue-100
                text-sm
                sm:text-base
                leading-7
                max-w-xl
              "
            >
              Stay on top of your workday. Manage your
              attendance, submit daily reports and keep
              track of your workplace activities from one
              central dashboard.
            </p>

            {/* Employee Information */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
                mt-7
              "
            >

              {/* Position */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                "
              >

                <FaBriefcase className="text-blue-200" />

                <span className="text-sm font-medium">
                  {position}
                </span>

              </div>

              {/* Department */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                "
              >

                <FaCalendarCheck className="text-blue-200" />

                <span className="text-sm font-medium">
                  {department}
                </span>

              </div>

            </div>

          </div>

          {/* ========================================
              Right Side
          ======================================== */}

          <div className="flex-shrink-0">

            <div
              className="
                w-full
                lg:w-64
                rounded-2xl
                bg-white/10
                border
                border-white/15
                backdrop-blur-sm
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-blue-200">
                    Today's Focus
                  </p>

                  <p className="text-lg font-bold mt-1">
                    Stay Productive
                  </p>

                </div>

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaCalendarCheck className="text-xl" />
                </div>

              </div>

              <div className="mt-5">

                <div
                  className="
                    h-2
                    rounded-full
                    bg-white/10
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      h-full
                      w-3/4
                      rounded-full
                      bg-white
                    "
                  />
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mt-2
                    text-xs
                    text-blue-200
                  "
                >
                  <span>
                    Keep going
                  </span>

                  <span>
                    75%
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/attendance";
                }}
                className="
                  w-full
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-white
                  text-blue-700
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  font-bold
                  hover:bg-blue-50
                  transition
                "
              >
                Manage Attendance

                <FaArrowRight className="text-xs" />

              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default WelcomeCard;