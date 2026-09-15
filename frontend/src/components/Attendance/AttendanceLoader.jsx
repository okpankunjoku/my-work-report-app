function AttendanceLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">

        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-500 font-medium">
          Loading attendance...
        </p>

      </div>
    </div>
  );
}

export default AttendanceLoader;