import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";

import Dashboard from "../pages/Dashboard/Dashboard";
import Attendance from "../pages/Attendance/Attendance";
import Reports from "../pages/Reports/Reports";
import CreateReport from "../pages/CreateReport/CreateReport";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import ChangePassword from "../pages/ChangePassword/ChangePassword";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import EmployeeManagement from "../pages/Admin/EmployeeManagement";
import AdminAttendance from "../pages/Admin/AdminAttendance";
import AdminReports from "../pages/Admin/AdminReports";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            PUBLIC AUTH ROUTES
        ========================================== */}

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* FORGOT PASSWORD */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* ==========================================
            PROTECTED ROUTES
        ========================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ========================================
              MAIN LAYOUT
          ======================================== */}

          <Route element={<MainLayout />}>

            {/* ======================================
                EMPLOYEE DASHBOARD
            ====================================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* ======================================
                ADMIN ROUTES
            ====================================== */}

            <Route
              element={
                <ProtectedRoute adminOnly={true} />
              }
            >

              {/* Admin Dashboard */}

              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              {/* Employee Management */}

              <Route
                path="/employees"
                element={<EmployeeManagement />}
              />

              {/* Admin Attendance */}

              <Route
                path="/admin/attendance"
                element={<AdminAttendance />}
              />

              {/* Admin Reports */}

              <Route
                path="/admin/reports"
                element={<AdminReports />}
              />

            </Route>

            {/* ======================================
                EMPLOYEE ROUTES
            ====================================== */}

            {/* Attendance */}

            <Route
              path="/attendance"
              element={<Attendance />}
            />

            {/* Reports */}

            <Route
              path="/reports"
              element={<Reports />}
            />

            {/* Create Report */}

            <Route
              path="/create-report"
              element={<CreateReport />}
            />

            {/* Profile */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Settings */}

            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Change Password */}

            <Route
              path="/change-password"
              element={<ChangePassword />}
            />

          </Route>
        </Route>

        {/* ==========================================
            DEFAULT ROUTE
        ========================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ==========================================
            UNKNOWN ROUTES
        ========================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;