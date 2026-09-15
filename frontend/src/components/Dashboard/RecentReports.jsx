import {
  FaClipboardList,
  FaArrowRight,
  FaCheckCircle,
  FaCalendarAlt,
  FaTasks,
} from "react-icons/fa";

function RecentReports({ reports = [] }) {
  // ==========================================
  // Format Date
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Get Recent Reports
  // ==========================================
  const recentReports = Array.isArray(reports)
    ? reports.slice(0, 5)
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
                bg-blue-50
                border
                border-blue-100
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <FaClipboardList className="text-blue-600 text-lg" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Reports
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your latest daily work reports
              </p>
            </div>

          </div>

          {/* Desktop View All */}
          <a
            href="/reports"
            className="
              hidden
              sm:inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-600
              hover:text-blue-800
              transition
            "
          >
            View All
            <FaArrowRight className="text-xs" />
          </a>

        </div>

      </div>

      {/* ==========================================
          Reports List
      ========================================== */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8">

        {recentReports.length > 0 ? (

          <div className="space-y-3">

            {recentReports.map((report, index) => {

              const tasks = Array.isArray(
                report?.tasksCompleted
              )
                ? report.tasksCompleted
                : [];

              return (
                <div
                  key={report?._id || index}
                  className="
                    group
                    relative
                    border
                    border-gray-100
                    rounded-2xl
                    p-4
                    sm:p-5
                    bg-gray-50
                    hover:bg-blue-50
                    hover:border-blue-100
                    transition-all
                    duration-300
                  "
                >

                  {/* Left Accent */}
                  <div
                    className="
                      absolute
                      left-0
                      top-4
                      bottom-4
                      w-1
                      rounded-r-full
                      bg-blue-500
                      opacity-0
                      group-hover:opacity-100
                      transition
                    "
                  ></div>

                  <div className="flex items-start gap-4">

                    {/* Report Icon */}
                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-white
                        border
                        border-gray-200
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                        group-hover:border-blue-200
                        transition
                      "
                    >
                      <FaCheckCircle className="text-green-500" />
                    </div>

                    {/* Report Content */}
                    <div className="min-w-0 flex-1">

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-start
                          sm:justify-between
                          gap-3
                        "
                      >

                        <div className="min-w-0">

                          {/* Work Summary */}
                          <h3
                            className="
                              font-semibold
                              text-gray-800
                              group-hover:text-blue-700
                              transition
                              line-clamp-1
                            "
                          >
                            {report?.workSummary ||
                              "Daily Work Report"}
                          </h3>

                          {/* Date */}
                          <div className="flex items-center gap-2 mt-2">

                            <FaCalendarAlt className="text-gray-400 text-xs" />

                            <span className="text-xs text-gray-500">
                              {formatDate(
                                report?.reportDate ||
                                  report?.createdAt
                              )}
                            </span>

                          </div>

                        </div>

                        {/* Submitted Badge */}
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            bg-green-50
                            border
                            border-green-100
                            text-green-700
                            text-xs
                            font-semibold
                            px-3
                            py-1.5
                            rounded-full
                            w-fit
                            flex-shrink-0
                          "
                        >
                          <span
                            className="
                              w-1.5
                              h-1.5
                              bg-green-500
                              rounded-full
                            "
                          ></span>

                          Submitted
                        </span>

                      </div>

                      {/* Tasks */}
                      <div className="mt-3">

                        {tasks.length > 0 ? (

                          <div className="flex items-start gap-2">

                            <FaTasks className="text-blue-400 text-xs mt-1 flex-shrink-0" />

                            <p
                              className="
                                text-sm
                                text-gray-500
                                line-clamp-1
                              "
                            >
                              {tasks.join(", ")}
                            </p>

                          </div>

                        ) : (

                          <p className="text-sm text-gray-400">
                            No tasks recorded
                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

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
              <FaClipboardList className="text-gray-400 text-2xl" />
            </div>

            <h3 className="font-semibold text-gray-700">
              No reports yet
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Your submitted daily work reports will
              appear here once you create your first report.
            </p>

            <a
              href="/create-report"
              className="
                inline-flex
                items-center
                gap-2
                mt-5
                bg-blue-600
                text-white
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                hover:bg-blue-700
                hover:shadow-md
                transition
              "
            >
              Create Report
              <FaArrowRight className="text-xs" />
            </a>

          </div>
        )}

        {/* ==========================================
            Mobile View All
        ========================================== */}
        {recentReports.length > 0 && (
          <div className="mt-5 sm:hidden">

            <a
              href="/reports"
              className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                border
                border-gray-200
                text-gray-700
                py-3
                rounded-xl
                text-sm
                font-semibold
                hover:bg-gray-50
                hover:border-gray-300
                transition
              "
            >
              View All Reports
              <FaArrowRight className="text-xs" />
            </a>

          </div>
        )}

      </div>

    </div>
  );
}

export default RecentReports;