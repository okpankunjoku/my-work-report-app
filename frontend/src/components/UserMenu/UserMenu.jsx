import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaKey,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import profileImage from "../../assets/images/cj.png";

function UserMenu() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  // ==========================================
  // User Information
  // ==========================================

  const fullName = user?.fullName || "Employee";

  const email = user?.email || "No email available";

  const role = user?.role || "Employee";

  // ==========================================
  // Get User Initials
  // ==========================================

  const getInitials = (name) => {
    if (!name) return "E";

    const names = name.trim().split(" ");

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) +
      names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    setOpen(false);

    logout();

    localStorage.removeItem("token");
    localStorage.removeItem("employee");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // Close Menu When Clicking Outside
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // Close Menu With Escape Key
  // ==========================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      {/* ==========================================
          Profile Button
      ========================================== */}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="
          group
          flex
          items-center
          gap-3
          rounded-2xl
          px-2
          py-2
          transition-all
          duration-200
          hover:bg-gray-50
          focus:outline-none
          focus:ring-2
          focus:ring-blue-100
        "
      >
        {/* Profile Image */}

        <div className="relative">

          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="
                w-10
                h-10
                rounded-full
                object-cover
                border-2
                border-white
                ring-2
                ring-blue-100
                shadow-sm
              "
            />
          ) : (
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {getInitials(fullName)}
            </div>
          )}

          {/* Online Indicator */}

          <span
            className="
              absolute
              bottom-0
              right-0
              w-3
              h-3
              bg-green-500
              border-2
              border-white
              rounded-full
            "
          ></span>

        </div>

        {/* User Details */}

        <div className="hidden lg:block text-left min-w-0">

          <p
            className="
              text-sm
              font-semibold
              text-gray-800
              truncate
              max-w-[130px]
            "
          >
            {fullName}
          </p>

          <p className="text-xs text-gray-500 capitalize">
            {role}
          </p>

        </div>

        {/* Arrow */}

        <FaChevronDown
          className={`
            hidden
            lg:block
            text-xs
            text-gray-400
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        />

      </button>

      {/* ==========================================
          Dropdown
      ========================================== */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-72
            bg-white
            rounded-2xl
            shadow-2xl
            border
            border-gray-100
            overflow-hidden
            z-50
            animate-[fadeIn_0.15s_ease-out]
          "
        >

          {/* ======================================
              User Header
          ====================================== */}

          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50">

            <div className="flex items-center gap-4">

              <div className="relative flex-shrink-0">

                <img
                  src={profileImage}
                  alt={fullName}
                  className="
                    w-14
                    h-14
                    rounded-full
                    object-cover
                    border-2
                    border-white
                    shadow-sm
                  "
                />

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-3.5
                    h-3.5
                    bg-green-500
                    border-2
                    border-white
                    rounded-full
                  "
                ></span>

              </div>

              <div className="min-w-0">

                <h3
                  className="
                    font-bold
                    text-gray-900
                    truncate
                  "
                >
                  {fullName}
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-500
                    truncate
                    mt-0.5
                  "
                >
                  {email}
                </p>

                <span
                  className="
                    inline-flex
                    items-center
                    mt-2
                    px-2.5
                    py-1
                    rounded-full
                    bg-green-100
                    text-green-700
                    text-xs
                    font-semibold
                  "
                >
                  Active
                </span>

              </div>

            </div>

          </div>

          {/* ======================================
              Menu Items
          ====================================== */}

          <div className="p-2">

            {/* Profile */}

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="
                group
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-gray-700
                hover:bg-blue-50
                hover:text-blue-700
                transition-all
              "
            >
              <span
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  group-hover:bg-blue-100
                "
              >
                <FaUser />
              </span>

              <div className="flex-1">

                <p className="text-sm font-semibold">
                  My Profile
                </p>

                <p className="text-xs text-gray-400">
                  View your employee information
                </p>

              </div>

            </Link>

            {/* Settings */}

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="
                group
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-gray-700
                hover:bg-gray-50
                transition-all
              "
            >
              <span
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-gray-100
                  text-gray-600
                  flex
                  items-center
                  justify-center
                  group-hover:bg-gray-200
                "
              >
                <FaCog />
              </span>

              <div className="flex-1">

                <p className="text-sm font-semibold">
                  Account Settings
                </p>

                <p className="text-xs text-gray-400">
                  Manage your account
                </p>

              </div>

            </Link>

            {/* Change Password */}

            <Link
              to="/change-password"
              onClick={() => setOpen(false)}
              className="
                group
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-gray-700
                hover:bg-orange-50
                hover:text-orange-700
                transition-all
              "
            >
              <span
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-orange-50
                  text-orange-600
                  flex
                  items-center
                  justify-center
                  group-hover:bg-orange-100
                "
              >
                <FaKey />
              </span>

              <div className="flex-1">

                <p className="text-sm font-semibold">
                  Change Password
                </p>

                <p className="text-xs text-gray-400">
                  Update your password
                </p>

              </div>

            </Link>

          </div>

          {/* ======================================
              Logout
          ====================================== */}

          <div className="border-t border-gray-100 p-2">

            <button
              type="button"
              onClick={handleLogout}
              className="
                group
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-red-600
                hover:bg-red-50
                transition-all
                text-left
              "
            >

              <span
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-red-50
                  text-red-600
                  flex
                  items-center
                  justify-center
                  group-hover:bg-red-100
                "
              >
                <FaSignOutAlt />
              </span>

              <div>

                <p className="text-sm font-semibold">
                  Logout
                </p>

                <p className="text-xs text-red-400">
                  Sign out of your account
                </p>

              </div>

            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default UserMenu;