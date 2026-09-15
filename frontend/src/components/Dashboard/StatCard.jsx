function StatCard({
  title,
  value,
  icon,
  color = "text-blue-600",
  change = "+0%",
  changeText = "No change",
  loading = false,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        bg-white
        rounded-2xl
        border
        border-gray-200
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Decorative Background */}
      <div
        className="
          absolute
          -right-8
          -top-8
          w-24
          h-24
          rounded-full
          bg-gray-50
          transition-transform
          duration-300
          group-hover:scale-150
        "
      ></div>

      {/* Top Section */}
      <div className="relative flex items-start justify-between">

        {/* Icon */}
        <div
          className={`
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            text-2xl
            ${color}
            bg-gray-50
            border
            border-gray-100
            transition-all
            duration-300
            group-hover:scale-105
          `}
        >
          {icon}
        </div>

        {/* Change Indicator */}
        <div className="text-right">
          <span
            className="
              inline-flex
              items-center
              px-2.5
              py-1
              rounded-full
              bg-green-50
              text-green-600
              text-xs
              font-semibold
            "
          >
            {change}
          </span>
        </div>

      </div>

      {/* Value */}
      <div className="relative mt-6">

        {loading ? (
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        ) : (
          <h2
            className="
              text-3xl
              sm:text-4xl
              font-bold
              text-gray-800
              tracking-tight
            "
          >
            {value}
          </h2>
        )}

      </div>

      {/* Title */}
      <div className="relative mt-2">

        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

      </div>

      {/* Divider */}
      <div className="relative mt-5 border-t border-gray-100"></div>

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-between">

        <span className="text-xs font-medium text-gray-400">
          {changeText}
        </span>

        <span
          className={`
            text-xs
            font-semibold
            ${color}
          `}
        >
          View details
        </span>

      </div>

    </div>
  );
}

export default StatCard;