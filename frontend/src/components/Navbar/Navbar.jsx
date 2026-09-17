import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

import {
  FaChevronDown,
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaFileAlt,
  FaUser,
  FaCog,
  FaLock,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import NotificationMenu from "../NotificationMenu/NotificationMenu";

function Navbar() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userMenuRef = useRef(null);
  const adminMenuRef = useRef(null);

  const isAdmin = user?.role === "Admin";

  const isAdminRoute = location.pathname.startsWith("/admin");

  const isActive = (path) => {
    return location.pathname === path;
  };

  // ==========================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserOpen(false);
      }

      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setAdminOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // ==========================================

  useEffect(() => {
    setMobileOpen(false);
    setAdminOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    setUserOpen(false);
    setAdminOpen(false);
    setMobileOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // USER INITIAL
  // ==========================================

  const getUserInitial = () => {
    if (!user?.fullName) {
      return "U";
    }

    return user.fullName.charAt(0).toUpperCase();
  };

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setAdminOpen(false);
    setUserOpen(false);
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between min-h-16 py-2">

          {/* ======================================
              LOGO
          ====================================== */}

          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0"
          >
            <img
              src={logo}
              alt="Work Reports Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain flex-shrink-0"
            />

            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg leading-tight truncate">
                Work Reports
              </h1>

              <p className="text-[10px] sm:text-xs text-blue-100 truncate">
                Productivity Tracker
              </p>
            </div>
          </Link>

          {/* ======================================
              DESKTOP NAVIGATION
              Hidden on mobile
          ====================================== */}

          <div className="hidden lg:flex items-center gap-2">

            {/* ====================================
                DASHBOARD
            ==================================== */}

            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${isActive("/dashboard")
                  ? "bg-blue-900"
                  : "hover:bg-blue-600"
                }`}
            >
              <FaTachometerAlt />
              Dashboard
            </Link>

            {/* ====================================
                ADMIN DROPDOWN
            ==================================== */}

            {isAdmin && (
              <div
                className="relative"
                ref={adminMenuRef}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAdminOpen((prev) => !prev);
                    setUserOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${isAdminRoute
                      ? "bg-blue-900"
                      : "hover:bg-blue-600"
                    }`}
                >
                  Admin

                  <FaChevronDown
                    className={`text-xs transition-transform ${adminOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {adminOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-blue-50 border border-blue-200 rounded-xl shadow-xl overflow-hidden z-50">

                    <Link
                      to="/admin/dashboard"
                      onClick={() => setAdminOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition ${isActive("/admin/dashboard")
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                        }`}
                    >
                      <FaTachometerAlt />
                      Admin Dashboard
                    </Link>

                    <Link
                      to="/admin/attendance"
                      onClick={() => setAdminOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition ${isActive("/admin/attendance")
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                        }`}
                    >
                      <FaCalendarCheck />
                      Admin Attendance
                    </Link>

                    <Link
                      to="/admin/reports"
                      onClick={() => setAdminOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition ${isActive("/admin/reports")
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                        }`}
                    >
                      <FaFileAlt />
                      Admin Reports
                    </Link>

                    <Link
                      to="/employees"
                      onClick={() => setAdminOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition ${isActive("/employees")
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                        }`}
                    >
                      <FaUsers />
                      Employee Management
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ====================================
                ATTENDANCE
            ==================================== */}

            <Link
              to="/attendance"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${isActive("/attendance")
                  ? "bg-blue-900"
                  : "hover:bg-blue-600"
                }`}
            >
              <FaCalendarCheck />
              Attendance
            </Link>

            {/* ====================================
                REPORTS
            ==================================== */}

            <Link
              to="/reports"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${isActive("/reports")
                  ? "bg-blue-900"
                  : "hover:bg-blue-600"
                }`}
            >
              <FaFileAlt />
              Reports
            </Link>

            {/* ====================================
                PROFILE
            ==================================== */}

            <Link
              to="/profile"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${isActive("/profile")
                  ? "bg-blue-900"
                  : "hover:bg-blue-600"
                }`}
            >
              <FaUser />
              Profile
            </Link>

            {/* ====================================
                DIVIDER
            ==================================== */}

            <div className="h-8 w-px bg-blue-500 mx-1" />

            {/* ====================================
                NOTIFICATIONS
            ==================================== */}

            <NotificationMenu />

            {/* ====================================
                USER DROPDOWN
            ==================================== */}

            <div
              className="relative"
              ref={userMenuRef}
            >
              <button
                type="button"
                onClick={() => {
                  setUserOpen((prev) => !prev);
                  setAdminOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-blue-600 transition"
                aria-label="User menu"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border-2 border-blue-300">
                  {getUserInitial()}
                </div>

                <div className="hidden xl:block text-left">
                  <p className="text-sm font-semibold leading-tight">
                    {user?.fullName || "User"}
                  </p>

                  <p className="text-[11px] text-blue-100">
                    {user?.role || "Employee"}
                  </p>
                </div>

                <FaChevronDown
                  className={`text-xs transition-transform ${userOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-blue-50 border border-blue-200 rounded-2xl shadow-2xl overflow-hidden z-50">

                  <div className="px-5 py-4 bg-blue-100 border-b border-blue-200">
                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-lg">
                        {getUserInitial()}
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">
                          {user?.fullName || "User"}
                        </p>

                        <p className="text-xs text-gray-600 truncate">
                          {user?.email || ""}
                        </p>

                        <span className="inline-block mt-1 text-[10px] font-bold bg-blue-700 text-white px-2 py-0.5 rounded-full">
                          {user?.role || "Employee"}
                        </span>
                      </div>

                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    <FaUser className="text-blue-600" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    <FaCog className="text-blue-600" />
                    Settings
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    <FaLock className="text-blue-600" />
                    Change Password
                  </Link>

                  <div className="border-t border-blue-200" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================
              MOBILE ACTIONS
          ====================================== */}

          <div className="lg:hidden flex items-center gap-2">

            {/* Notifications remain visible */}
            <NotificationMenu />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen((prev) => !prev);
                setAdminOpen(false);
                setUserOpen(false);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-600 transition"
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* ======================================
            MOBILE NAVIGATION MENU
        ====================================== */}

        {mobileOpen && (
          <div className="lg:hidden border-t border-blue-500 py-3">

            <div className="flex flex-col gap-1">

              {/* DASHBOARD */}

              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 transition ${isActive("/dashboard")
                    ? "bg-blue-900"
                    : "hover:bg-blue-600"
                  }`}
              >
                <FaTachometerAlt />
                Dashboard
              </Link>

              {/* ADMIN */}

              {isAdmin && (
                <div
                  className="relative"
                  ref={adminMenuRef}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAdminOpen((prev) => !prev);
                      setUserOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition ${isAdminRoute
                        ? "bg-blue-900"
                        : "hover:bg-blue-600"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <FaUsers />
                      Admin
                    </span>

                    <FaChevronDown
                      className={`text-xs transition-transform ${adminOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {adminOpen && (
                    <div className="mt-1 ml-4 border-l-2 border-blue-400 pl-2 flex flex-col gap-1">

                      <Link
                        to="/admin/dashboard"
                        onClick={closeMobileMenu}
                        className={`px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition ${isActive("/admin/dashboard")
                            ? "bg-blue-900"
                            : "hover:bg-blue-600"
                          }`}
                      >
                        <FaTachometerAlt />
                        Admin Dashboard
                      </Link>

                      <Link
                        to="/admin/attendance"
                        onClick={closeMobileMenu}
                        className={`px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition ${isActive("/admin/attendance")
                            ? "bg-blue-900"
                            : "hover:bg-blue-600"
                          }`}
                      >
                        <FaCalendarCheck />
                        Admin Attendance
                      </Link>

                      <Link
                        to="/admin/reports"
                        onClick={closeMobileMenu}
                        className={`px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition ${isActive("/admin/reports")
                            ? "bg-blue-900"
                            : "hover:bg-blue-600"
                          }`}
                      >
                        <FaFileAlt />
                        Admin Reports
                      </Link>

                      <Link
                        to="/employees"
                        onClick={closeMobileMenu}
                        className={`px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition ${isActive("/employees")
                            ? "bg-blue-900"
                            : "hover:bg-blue-600"
                          }`}
                      >
                        <FaUsers />
                        Employee Management
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ATTENDANCE */}

              <Link
                to="/attendance"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 transition ${isActive("/attendance")
                    ? "bg-blue-900"
                    : "hover:bg-blue-600"
                  }`}
              >
                <FaCalendarCheck />
                Attendance
              </Link>

              {/* REPORTS */}

              <Link
                to="/reports"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 transition ${isActive("/reports")
                    ? "bg-blue-900"
                    : "hover:bg-blue-600"
                  }`}
              >
                <FaFileAlt />
                Reports
              </Link>

              {/* PROFILE */}

              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 transition ${isActive("/profile")
                    ? "bg-blue-900"
                    : "hover:bg-blue-600"
                  }`}
              >
                <FaUser />
                Profile
              </Link>

              {/* ==================================
                  MOBILE USER INFORMATION
              ================================== */}

              <div className="mt-2 pt-3 border-t border-blue-500">

                <div className="px-4 py-3 bg-blue-600 rounded-xl">
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border-2 border-blue-300">
                      {getUserInitial()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {user?.fullName || "User"}
                      </p>

                      <p className="text-xs text-blue-100 truncate">
                        {user?.email || ""}
                      </p>

                      <span className="inline-block mt-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {user?.role || "Employee"}
                      </span>
                    </div>

                  </div>
                </div>

                {/* SETTINGS */}

                <Link
                  to="/settings"
                  onClick={closeMobileMenu}
                  className="mt-1 px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-blue-600 transition"
                >
                  <FaCog />
                  Settings
                </Link>

                {/* CHANGE PASSWORD */}

                <Link
                  to="/change-password"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-blue-600 transition"
                >
                  <FaLock />
                  Change Password
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-lg flex items-center gap-3 font-semibold text-red-200 hover:bg-red-500/20 transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;