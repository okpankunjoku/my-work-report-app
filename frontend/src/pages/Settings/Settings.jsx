import { useEffect, useState } from "react";

import {
  FaCog,
  FaBell,
  FaMoon,
  FaSun,
  FaLock,
  FaSave,
  FaCheckCircle,
  FaShieldAlt,
  FaChevronRight,
} from "react-icons/fa";

import Card from "../../components/Card/Card";

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reportReminders: true,
    attendanceNotifications: true,
    darkMode: false,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // ==========================================
  // Load Saved Settings
  // ==========================================

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(
        "workReportsSettings"
      );

      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);

        setSettings((previous) => ({
          ...previous,
          ...parsedSettings,
        }));
      }
    } catch (error) {
      console.error(
        "Unable to load settings:",
        error
      );
    }
  }, []);

  // ==========================================
  // Handle Setting Change
  // ==========================================

  const handleChange = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));

    setSuccess("");
  };

  // ==========================================
  // Save Settings
  // ==========================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess("");

      localStorage.setItem(
        "workReportsSettings",
        JSON.stringify(settings)
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setSuccess(
        "Your settings have been saved successfully."
      );
    } catch (error) {
      console.error("Settings Error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">

      {/* ==========================================
          Page Header
      ========================================== */}

      <div className="mb-8">

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              shadow-lg
              shadow-blue-100
              flex-shrink-0
            "
          >
            <FaCog className="text-2xl" />
          </div>

          <div>

            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Preferences
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              Account Settings
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your notifications, appearance and
              account preferences.
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
          Success Message
      ========================================== */}

      {success && (
        <div
          className="
            flex
            items-center
            gap-3
            bg-green-50
            border
            border-green-200
            text-green-700
            rounded-2xl
            p-4
            mb-6
            shadow-sm
          "
        >
          <div
            className="
              w-9
              h-9
              rounded-full
              bg-green-100
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <FaCheckCircle />
          </div>

          <div>
            <p className="font-semibold">
              Settings Saved
            </p>

            <p className="text-sm mt-0.5">
              {success}
            </p>
          </div>

        </div>
      )}

      {/* ==========================================
          Notification Settings
      ========================================== */}

      <Card>

        <div className="flex items-start gap-4 mb-7">

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-blue-50
              border
              border-blue-100
              text-blue-600
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <FaBell className="text-lg" />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Notifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Control how you receive important work
              notifications.
            </p>

          </div>

        </div>

        <div className="space-y-4">

          <SettingToggle
            title="Email Notifications"
            description="Receive important account and work notifications by email."
            enabled={settings.emailNotifications}
            onChange={() =>
              handleChange("emailNotifications")
            }
            icon={<FaBell />}
            color="blue"
          />

          <SettingToggle
            title="Daily Report Reminders"
            description="Receive reminders when your daily work report is due."
            enabled={settings.reportReminders}
            onChange={() =>
              handleChange("reportReminders")
            }
            icon={<FaCheckCircle />}
            color="green"
          />

          <SettingToggle
            title="Attendance Notifications"
            description="Receive notifications related to clock-in and clock-out activities."
            enabled={settings.attendanceNotifications}
            onChange={() =>
              handleChange(
                "attendanceNotifications"
              )
            }
            icon={<FaClockIcon />}
            color="orange"
          />

        </div>

      </Card>

      {/* ==========================================
          Appearance
      ========================================== */}

      <Card className="mt-6">

        <div className="flex items-start gap-4 mb-7">

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-purple-50
              border
              border-purple-100
              text-purple-600
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            {settings.darkMode ? (
              <FaMoon className="text-lg" />
            ) : (
              <FaSun className="text-lg" />
            )}
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Appearance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Customize how Work Reports looks on your
              device.
            </p>

          </div>

        </div>

        <SettingToggle
          title="Dark Mode"
          description="Use a darker interface for a more comfortable viewing experience."
          enabled={settings.darkMode}
          onChange={() =>
            handleChange("darkMode")
          }
          icon={
            settings.darkMode ? (
              <FaMoon />
            ) : (
              <FaSun />
            )
          }
          color="purple"
        />

      </Card>

      {/* ==========================================
          Security
      ========================================== */}

      <Card className="mt-6">

        <div className="flex items-start gap-4 mb-7">

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-green-50
              border
              border-green-100
              text-green-600
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <FaShieldAlt className="text-lg" />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Security
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Protect your account and manage your
              password.
            </p>

          </div>

        </div>

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-5
            bg-gray-50
            border
            border-gray-100
            rounded-2xl
            p-5
            hover:bg-gray-100
            transition
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-white
                border
                border-gray-200
                text-gray-600
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <FaLock />
            </div>

            <div>

              <h3 className="font-semibold text-gray-800">
                Password
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Update your account password regularly.
              </p>

            </div>

          </div>

          <a
            href="/change-password"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-white
              border
              border-gray-200
              text-gray-700
              px-5
              py-2.5
              rounded-xl
              font-semibold
              hover:bg-blue-600
              hover:text-white
              hover:border-blue-600
              transition-all
              w-fit
              shadow-sm
            "
          >
            Change Password

            <FaChevronRight className="text-xs" />
          </a>

        </div>

      </Card>

      {/* ==========================================
          Save Button
      ========================================== */}

      <div
        className="
          flex
          flex-col-reverse
          sm:flex-row
          sm:justify-end
          gap-3
          mt-6
        "
      >

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            text-white
            px-7
            py-3
            rounded-xl
            font-semibold
            hover:bg-blue-700
            hover:shadow-lg
            hover:shadow-blue-100
            transition-all
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >

          <FaSave />

          {saving
            ? "Saving..."
            : "Save Settings"}

        </button>

      </div>

    </div>
  );
}

// ==========================================
// Setting Toggle Component
// ==========================================

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
  icon,
  color = "blue",
}) {
  const colorClasses = {
    blue: {
      icon: "bg-blue-100 text-blue-600",
    },

    green: {
      icon: "bg-green-100 text-green-600",
    },

    orange: {
      icon: "bg-orange-100 text-orange-600",
    },

    purple: {
      icon: "bg-purple-100 text-purple-600",
    },
  };

  const selectedColor =
    colorClasses[color] ||
    colorClasses.blue;

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        p-5
        rounded-2xl
        border
        border-gray-100
        bg-gray-50
        hover:bg-white
        hover:border-gray-200
        hover:shadow-sm
        transition-all
        duration-300
      "
    >

      <div className="flex items-center gap-4 min-w-0">

        <div
          className={`
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            flex-shrink-0
            ${selectedColor.icon}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <h3 className="font-semibold text-gray-800">
            {title}
          </h3>

          <p className="text-sm text-gray-500 mt-1 leading-5">
            {description}
          </p>

        </div>

      </div>

      {/* Toggle */}

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        className={`
          relative
          flex-shrink-0
          w-14
          h-8
          rounded-full
          transition-all
          duration-300
          focus:outline-none
          focus:ring-4
          focus:ring-blue-100
          ${
            enabled
              ? "bg-blue-600"
              : "bg-gray-300"
          }
        `}
      >

        <span
          className={`
            absolute
            top-1
            w-6
            h-6
            bg-white
            rounded-full
            shadow-md
            transition-all
            duration-300
            ${
              enabled
                ? "left-7"
                : "left-1"
            }
          `}
        />

      </button>

    </div>
  );
}

// ==========================================
// Small Clock Icon
// ==========================================

function FaClockIcon() {
  return (
    <span className="text-sm">
      🕐
    </span>
  );
}

export default Settings;