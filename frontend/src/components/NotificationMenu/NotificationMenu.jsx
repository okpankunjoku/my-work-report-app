import { useEffect, useRef, useState } from "react";

import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaClock,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

function NotificationMenu() {
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const menuRef = useRef(null);

  // ==========================================
  // Fetch Notifications
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setError("");

      const response = await getNotifications();

      console.log("Notifications response:", response);

      // Backend response:
      // {
      //   success: true,
      //   message: "...",
      //   data: {
      //     notifications: [],
      //     pagination: {}
      //   }
      // }

      const notificationList =
        response?.data?.notifications || [];

      setNotifications(notificationList);
    } catch (error) {
      console.error(
        "Notifications Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Load + Automatic Refresh
  // ==========================================

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // Close When Clicking Outside
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
  // Unread Count
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==========================================
  // Notification Icon
  // ==========================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <FaCheckCircle className="text-green-600" />
        );

      case "warning":
        return (
          <FaExclamationTriangle className="text-yellow-600" />
        );

      case "report":
        return (
          <FaFileAlt className="text-blue-600" />
        );

      case "attendance":
        return (
          <FaClock className="text-purple-600" />
        );

      case "account":
        return (
          <FaCheckCircle className="text-green-600" />
        );

      default:
        return (
          <FaBell className="text-blue-600" />
        );
    }
  };

  // ==========================================
  // Notification Background
  // ==========================================

  const getNotificationStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50";

      case "warning":
        return "bg-yellow-50";

      case "report":
        return "bg-blue-50";

      case "attendance":
        return "bg-purple-50";

      case "account":
        return "bg-green-50";

      default:
        return "bg-gray-50";
    }
  };

  // ==========================================
  // Mark Notification As Read
  // ==========================================

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );
    }
  };

  // ==========================================
  // Mark All As Read
  // ==========================================

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark all notifications as read error:",
        error
      );
    }
  };

  // ==========================================
  // Format Notification Time
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const seconds = Math.floor(
      difference / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} minute${
        minutes === 1 ? "" : "s"
      } ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hour${
        hours === 1 ? "" : "s"
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} day${
        days === 1 ? "" : "s"
      } ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      {/* ==========================================
          Notification Button
      ========================================== */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="
          relative
          p-3
          rounded-xl
          text-gray-600
          hover:text-blue-600
          hover:bg-gray-100
          transition
        "
      >
        <FaBell className="text-xl" />

        {/* Unread Badge */}

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-5
              h-5
              px-1
              bg-red-500
              text-white
              rounded-full
              text-[10px]
              font-bold
              flex
              items-center
              justify-center
              border-2
              border-white
            "
          >
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* ==========================================
          Notification Dropdown
      ========================================== */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-[calc(100vw-2rem)]
            sm:w-96
            max-w-96
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-2xl
            overflow-hidden
            z-50
          "
        >
          {/* ========================================
              Header
          ======================================== */}

          <div
            className="
              px-5
              py-4
              border-b
              border-gray-100
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-gray-900">
                  Notifications
                </h2>

                {unreadCount > 0 && (
                  <span
                    className="
                      bg-blue-100
                      text-blue-700
                      text-xs
                      font-bold
                      px-2
                      py-1
                      rounded-full
                    "
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Stay updated with your work activities.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="
                  text-xs
                  font-semibold
                  text-blue-600
                  hover:text-blue-800
                  whitespace-nowrap
                "
              >
                Mark all read
              </button>
            )}
          </div>

          {/* ========================================
              Loading
          ======================================== */}

          {loading ? (
            <div className="py-12 text-center">
              <div className="text-sm text-gray-500">
                Loading notifications...
              </div>
            </div>
          ) : error ? (
            /* ========================================
                Error
            ======================================== */

            <div className="py-12 px-6 text-center">
              <div className="text-sm text-red-500">
                {error}
              </div>

              <button
                type="button"
                onClick={fetchNotifications}
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-800
                "
              >
                Try again
              </button>
            </div>
          ) : notifications.length > 0 ? (
            /* ========================================
                Notifications
            ======================================== */

            <div className="max-h-[420px] overflow-y-auto">
              {notifications.map(
                (notification) => (
                  <button
                    type="button"
                    key={notification._id}
                    onClick={() =>
                      markAsRead(
                        notification._id
                      )
                    }
                    className={`
                      w-full
                      text-left
                      px-5
                      py-4
                      border-b
                      border-gray-100
                      transition
                      hover:bg-gray-50
                      ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-blue-50/40"
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}

                      <div
                        className={`
                          w-10
                          h-10
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                          ${getNotificationStyle(
                            notification.type
                          )}
                        `}
                      >
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className={`
                              text-sm
                              font-semibold
                              ${
                                notification.isRead
                                  ? "text-gray-700"
                                  : "text-gray-900"
                              }
                            `}
                          >
                            {notification.title}
                          </h3>

                          {!notification.isRead && (
                            <span
                              className="
                                w-2
                                h-2
                                rounded-full
                                bg-blue-600
                                flex-shrink-0
                                mt-1.5
                              "
                            />
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-1 leading-5">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <FaClock className="text-gray-400 text-[10px]" />

                          <span className="text-[11px] text-gray-400">
                            {formatTime(
                              notification.createdAt
                            )}
                          </span>

                          {notification.isRead && (
                            <span
                              className="
                                flex
                                items-center
                                gap-1
                                text-[11px]
                                text-green-600
                              "
                            >
                              <FaCheck />
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          ) : (
            /* ========================================
                Empty State
            ======================================== */

            <div className="py-12 px-6 text-center">
              <div
                className="
                  w-14
                  h-14
                  mx-auto
                  rounded-2xl
                  bg-gray-100
                  text-gray-400
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >
                <FaBell className="text-xl" />
              </div>

              <h3 className="font-semibold text-gray-700">
                No notifications
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                You're all caught up.
              </p>
            </div>
          )}

          {/* ========================================
              Footer
          ======================================== */}

          <div className="border-t border-gray-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                w-full
                py-3.5
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-semibold
                text-blue-600
                hover:bg-blue-50
                transition
              "
            >
              View All Notifications

              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationMenu;