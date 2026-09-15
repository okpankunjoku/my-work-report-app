import {
  FaHistory,
  FaClock,
  FaClipboardCheck,
  FaSignInAlt,
  FaSignOutAlt,
  FaFileAlt,
  FaArrowRight,
} from "react-icons/fa";

function ActivityList({ activities = [] }) {
  // ==========================================
  // Format Date & Time
  // ==========================================
  const formatDateTime = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Get Activity Type
  // ==========================================
  const getActivityType = (activity) => {
    return String(
      activity?.type ||
        activity?.action ||
        activity?.title ||
        ""
    ).toLowerCase();
  };

  // ==========================================
  // Get Activity Icon
  // ==========================================
  const getActivityIcon = (activity) => {
    const type = getActivityType(activity);

    if (
      type.includes("clock in") ||
      type.includes("clock-in") ||
      type.includes("check in")
    ) {
      return <FaSignInAlt />;
    }

    if (
      type.includes("clock out") ||
      type.includes("clock-out") ||
      type.includes("check out")
    ) {
      return <FaSignOutAlt />;
    }

    if (
      type.includes("report") ||
      type.includes("submit")
    ) {
      return <FaFileAlt />;
    }

    if (
      type.includes("attendance") ||
      type.includes("present")
    ) {
      return <FaClipboardCheck />;
    }

    return <FaHistory />;
  };

  // ==========================================
  // Get Activity Colors
  // ==========================================
  const getActivityColor = (activity) => {
    const type = getActivityType(activity);

    if (
      type.includes("clock in") ||
      type.includes("clock-in") ||
      type.includes("check in")
    ) {
      return {
        wrapper:
          "bg-green-50 border-green-100 hover:border-green-200",
        icon:
          "bg-green-100 text-green-600",
        accent:
          "bg-green-500",
      };
    }

    if (
      type.includes("clock out") ||
      type.includes("clock-out") ||
      type.includes("check out")
    ) {
      return {
        wrapper:
          "bg-red-50 border-red-100 hover:border-red-200",
        icon:
          "bg-red-100 text-red-600",
        accent:
          "bg-red-500",
      };
    }

    if (
      type.includes("report") ||
      type.includes("submit")
    ) {
      return {
        wrapper:
          "bg-blue-50 border-blue-100 hover:border-blue-200",
        icon:
          "bg-blue-100 text-blue-600",
        accent:
          "bg-blue-500",
      };
    }

    if (
      type.includes("attendance") ||
      type.includes("present")
    ) {
      return {
        wrapper:
          "bg-purple-50 border-purple-100 hover:border-purple-200",
        icon:
          "bg-purple-100 text-purple-600",
        accent:
          "bg-purple-500",
      };
    }

    return {
      wrapper:
        "bg-gray-50 border-gray-100 hover:border-gray-200",
      icon:
        "bg-gray-100 text-gray-600",
      accent:
        "bg-gray-400",
    };
  };

  // ==========================================
  // Recent Activities
  // ==========================================
  const recentActivities = Array.isArray(activities)
    ? activities.slice(0, 5)
    : [];

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      {/* ==========================================
          Header
      ========================================== */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-purple-50
                border
                border-purple-100
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <FaHistory className="text-purple-600 text-lg" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your latest work activities
              </p>
            </div>

          </div>

          {/* Recent Indicator */}
          <div
            className="
              hidden
              sm:flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              bg-gray-50
              border
              border-gray-100
              text-xs
              font-semibold
              text-gray-500
            "
          >
            <FaClock className="text-gray-400" />

            Recent
          </div>

        </div>

      </div>

      {/* ==========================================
          Activity List
      ========================================== */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8">

        {recentActivities.length > 0 ? (

          <div className="space-y-3">

            {recentActivities.map(
              (activity, index) => {

                const colors =
                  getActivityColor(activity);

                const title =
                  activity?.title ||
                  activity?.action ||
                  activity?.type ||
                  "Activity";

                const description =
                  activity?.description ||
                  activity?.message ||
                  activity?.details ||
                  "";

                const date =
                  activity?.createdAt ||
                  activity?.date ||
                  activity?.timestamp;

                return (
                  <div
                    key={
                      activity?._id ||
                      activity?.id ||
                      index
                    }
                    className={`
                      group
                      relative
                      flex
                      items-start
                      gap-4
                      p-4
                      sm:p-5
                      rounded-2xl
                      border
                      transition-all
                      duration-300
                      hover:shadow-sm
                      ${colors.wrapper}
                    `}
                  >

                    {/* Left Accent */}
                    <div
                      className={`
                        absolute
                        left-0
                        top-4
                        bottom-4
                        w-1
                        rounded-r-full
                        ${colors.accent}
                        opacity-0
                        group-hover:opacity-100
                        transition
                      `}
                    ></div>

                    {/* Activity Icon */}
                    <div
                      className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                        ${colors.icon}
                      `}
                    >
                      {getActivityIcon(activity)}
                    </div>

                    {/* Activity Content */}
                    <div className="min-w-0 flex-1">

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >

                        <div className="min-w-0">

                          <h3
                            className="
                              font-semibold
                              text-gray-800
                              truncate
                              group-hover:text-blue-700
                              transition
                            "
                          >
                            {title}
                          </h3>

                          {description && (
                            <p
                              className="
                                text-sm
                                text-gray-500
                                mt-1
                                line-clamp-2
                              "
                            >
                              {description}
                            </p>
                          )}

                        </div>

                        {/* Desktop Date */}
                        <span
                          className="
                            hidden
                            sm:block
                            text-xs
                            text-gray-400
                            whitespace-nowrap
                            pt-0.5
                          "
                        >
                          {formatDateTime(date)}
                        </span>

                      </div>

                      {/* Mobile Date */}
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          text-gray-400
                          mt-3
                          sm:hidden
                        "
                      >
                        <FaClock />

                        {formatDateTime(date)}
                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          /* ==========================================
             Empty State
          ========================================== */
          <div
            className="
              border
              border-dashed
              border-gray-200
              rounded-2xl
              py-12
              px-6
              text-center
              bg-gray-50
            "
          >

            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-white
                border
                border-gray-200
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <FaHistory className="text-gray-400 text-2xl" />
            </div>

            <h3 className="font-semibold text-gray-700">
              No recent activity
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Your clock-ins, clock-outs, reports and
              other work activities will appear here.
            </p>

          </div>
        )}

        {/* ==========================================
            Footer
        ========================================== */}
        {recentActivities.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100">

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
              View attendance

              <FaArrowRight className="text-xs" />
            </a>

          </div>
        )}

      </div>

    </div>
  );
}

export default ActivityList;