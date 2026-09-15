import { FaCalendarAlt, FaClock } from "react-icons/fa";

function AttendanceHistory({ history = [] }) {
  const formatDate = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) {
      return "--:--";
    }

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <FaCalendarAlt className="text-blue-600 text-xl" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Attendance History
          </h2>

          <p className="text-sm text-gray-500">
            Your previous attendance records
          </p>
        </div>

      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="py-12 text-center">

          <FaCalendarAlt className="mx-auto text-4xl text-gray-300" />

          <h3 className="mt-4 font-semibold text-gray-700">
            No attendance records
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Your attendance history will appear here.
          </p>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">

                <th className="py-4 px-3 text-sm font-semibold text-gray-500">
                  Date
                </th>

                <th className="py-4 px-3 text-sm font-semibold text-gray-500">
                  Clock In
                </th>

                <th className="py-4 px-3 text-sm font-semibold text-gray-500">
                  Clock Out
                </th>

                <th className="py-4 px-3 text-sm font-semibold text-gray-500">
                  Working Hours
                </th>

                <th className="py-4 px-3 text-sm font-semibold text-gray-500">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {history.map((record, index) => (

                <tr
                  key={record._id || index}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >

                  <td className="py-4 px-3">

                    <div className="flex items-center gap-2">

                      <FaCalendarAlt className="text-gray-400" />

                      <span className="font-medium text-gray-800">
                        {formatDate(record.attendanceDate)}
                      </span>

                    </div>

                  </td>

                  <td className="py-4 px-3">

                    <div className="flex items-center gap-2 text-gray-600">

                      <FaClock className="text-green-500" />

                      {formatTime(record.clockIn)}

                    </div>

                  </td>

                  <td className="py-4 px-3">

                    <div className="flex items-center gap-2 text-gray-600">

                      <FaClock className="text-red-500" />

                      {formatTime(record.clockOut)}

                    </div>

                  </td>

                  <td className="py-4 px-3">

                    <span className="font-semibold text-gray-800">
                      {record.workingHours !== undefined &&
                      record.workingHours !== null
                        ? `${record.workingHours} hrs`
                        : "--"}
                    </span>

                  </td>

                  <td className="py-4 px-3">

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : record.status === "Absent"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {record.status || "Unknown"}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AttendanceHistory;