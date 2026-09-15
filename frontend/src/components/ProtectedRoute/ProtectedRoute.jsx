import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ adminOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();

  // ==========================================
  // Check Login
  // ==========================================

  const token = localStorage.getItem("token");

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ==========================================
  // Check Admin Access
  // ==========================================

  if (adminOnly) {
    if (user.role !== "Admin") {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }
  }

  // ==========================================
  // Access Granted
  // ==========================================

  return <Outlet />;
}

export default ProtectedRoute;