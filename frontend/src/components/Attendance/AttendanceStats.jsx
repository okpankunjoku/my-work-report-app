import {
  FaCalendarCheck,
  FaSignInAlt,
  FaSignOutAlt,
  FaBusinessTime,
} from "react-icons/fa";

function AttendanceStats({ attendance }) {
  const formatTime = (time) => {
    if (!time) {
      return "--:--";
    }

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = [
    {
      title: "Status",
      value: attendance?.status || "Absent",
      icon: <FaCalendarCheck />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Clock In",
      value: formatTime(attendance?.clockIn),
      icon: <FaSignInAlt />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Clock Out",
      value: formatTime(attendance?.clockOut),
      icon: <FaSignOutAlt />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Working Hours",
      value:
        attendance?.workingHours !== undefined &&
        attendance?.workingHours !== null
          ? `${attendance.workingHours} hrs`
          : "--",
      icon: <FaBusinessTime />,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
            bg-white
            rounded-2xl
            border
            shadow-sm
            p-5
            transition
            hover:-translate-y-1
            hover:shadow-lg
          "
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {stat.value}
              </h3>
            </div>

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}
            >
              {stat.icon}
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}

export default AttendanceStats;