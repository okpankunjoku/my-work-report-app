import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const employee = localStorage.getItem("employee");

  if (!token || !employee) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;