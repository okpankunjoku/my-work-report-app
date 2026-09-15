import { FaClipboardList } from "react-icons/fa";

function EmptyState({
  title = "No Reports Yet",
  message = "Create your first report to get started.",
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-10 text-center">

      <FaClipboardList className="text-5xl text-blue-500 mx-auto mb-4" />

      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="text-gray-500 mt-2">
        {message}
      </p>

    </div>
  );
}

export default EmptyState;