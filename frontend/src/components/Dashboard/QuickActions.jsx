import {
  FaClock,
  FaFileAlt,
  FaUser,
  FaCalendarCheck,
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";

function QuickActions() {
  const actions = [
    {
      title: "Clock In / Out",
      description: "Manage your daily attendance",
      icon: <FaClock />,
      href: "/attendance",
      iconStyle: "bg-green-100 text-green-600",
      hoverStyle:
        "hover:border-green-200 hover:bg-green-50",
    },
    {
      title: "Create Report",
      description: "Submit today's work report",
      icon: <FaFileAlt />,
      href: "/create-report",
      iconStyle: "bg-blue-100 text-blue-600",
      hoverStyle:
        "hover:border-blue-200 hover:bg-blue-50",
    },
    {
      title: "View Reports",
      description: "Review your submitted reports",
      icon: <FaCalendarCheck />,
      href: "/reports",
      iconStyle: "bg-purple-100 text-purple-600",
      hoverStyle:
        "hover:border-purple-200 hover:bg-purple-50",
    },
    {
      title: "My Profile",
      description: "View and manage your profile",
      icon: <FaUser />,
      href: "/profile",
      iconStyle: "bg-orange-100 text-orange-600",
      hoverStyle:
        "hover:border-orange-200 hover:bg-orange-50",
    },
  ];

  return (
    <section>
      {/* ==========================================
          Header
      ========================================== */}
      <div className="flex items-center gap-3 mb-6">

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-blue-50
            border
            border-blue-100
            flex
            items-center
            justify-center
          "
        >
          <FaBolt className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quickly access your most important tasks
          </p>
        </div>

      </div>

      {/* ==========================================
          Actions
      ========================================== */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
      >

        {actions.map((action) => (
          <a
            key={action.title}
            href={action.href}
            className={`
              group
              relative
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-5
              sm:p-6
              shadow-sm
              overflow-hidden
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
              ${action.hoverStyle}
            `}
          >

            {/* ======================================
                Top Accent
            ====================================== */}
            <div
              className="
                absolute
                top-0
                left-0
                right-0
                h-1
                bg-blue-500
                opacity-0
                group-hover:opacity-100
                transition
              "
            ></div>

            {/* ======================================
                Top Row
            ====================================== */}
            <div className="flex items-start justify-between gap-3">

              {/* Icon */}
              <div
                className={`
                  w-13
                  h-13
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  text-xl
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:rotate-2
                  ${action.iconStyle}
                `}
              >
                {action.icon}
              </div>

              {/* Arrow */}
              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-gray-50
                  border
                  border-gray-100
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  group-hover:bg-white
                  group-hover:border-gray-200
                "
              >
                <FaArrowRight
                  className="
                    text-gray-300
                    text-xs
                    transition-all
                    duration-300
                    group-hover:text-blue-600
                    group-hover:translate-x-1
                  "
                />
              </div>

            </div>

            {/* ======================================
                Content
            ====================================== */}
            <div className="mt-5">

              <h3
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  text-gray-800
                  group-hover:text-blue-700
                  transition
                "
              >
                {action.title}
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-2
                  leading-6
                "
              >
                {action.description}
              </p>

            </div>

            {/* ======================================
                Bottom Action
            ====================================== */}
            <div
              className="
                mt-5
                pt-4
                border-t
                border-gray-100
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-xs
                  font-semibold
                  text-gray-400
                  group-hover:text-blue-600
                  transition
                "
              >
                Open
              </span>

              <span
                className="
                  text-xs
                  font-medium
                  text-gray-400
                  group-hover:text-gray-600
                  transition
                "
              >
                →
              </span>
            </div>

          </a>
        ))}

      </div>
    </section>
  );
}

export default QuickActions;