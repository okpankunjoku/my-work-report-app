import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaKey,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

import Card from "../../components/Card/Card";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Handle Input
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate new password
    if (formData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters long."
      );

      return;
    }

    // Confirm password
    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError(
        "New password and confirmation password do not match."
      );

      return;
    }

    try {
      setSaving(true);

      /*
        Backend password-change API will be connected here.

        For now, this validates the form and displays
        a successful UI response.
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setSuccess(
        "Password change request completed successfully."
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* ==========================================
          Back
      ========================================== */}

      <Link
        to="/profile"
        className="
          inline-flex
          items-center
          gap-2
          text-blue-600
          hover:text-blue-800
          font-medium
          mb-6
          transition
        "
      >
        <FaArrowLeft />

        Back to Profile
      </Link>

      {/* ==========================================
          Header
      ========================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-4">

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-blue-100
              text-blue-600
              flex
              items-center
              justify-center
            "
          >
            <FaKey className="text-xl" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Change Password
            </h1>

            <p className="text-gray-500 mt-1">
              Update your account password to keep your
              account secure.
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
          Success
      ========================================== */}

      {success && (
        <div
          className="
            flex
            items-start
            gap-3
            bg-green-50
            border
            border-green-200
            text-green-700
            rounded-xl
            p-4
            mb-6
          "
        >
          <FaCheckCircle className="mt-1" />

          <div>
            <p className="font-semibold">
              Password Updated
            </p>

            <p className="text-sm mt-1">
              {success}
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          Error
      ========================================== */}

      {error && (
        <div
          className="
            bg-red-50
            border
            border-red-200
            text-red-700
            rounded-xl
            p-4
            mb-6
          "
        >
          <p className="font-semibold">
            Unable to update password
          </p>

          <p className="text-sm mt-1">
            {error}
          </p>
        </div>
      )}

      {/* ==========================================
          Password Form
      ========================================== */}

      <Card>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Current Password */}

          <div>

            <label
              htmlFor="currentPassword"
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
              "
            >
              Current Password
            </label>

            <div className="relative">

              <FaLock
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                id="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                required
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  pl-11
                  pr-12
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-blue-600
                "
              >
                {showCurrentPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* New Password */}

          <div>

            <label
              htmlFor="newPassword"
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
              "
            >
              New Password
            </label>

            <div className="relative">

              <FaKey
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                id="newPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                required
                minLength={6}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  pl-11
                  pr-12
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-blue-600
                "
              >
                {showNewPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Password must contain at least 6 characters.
            </p>

          </div>

          {/* Confirm Password */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
              "
            >
              Confirm New Password
            </label>

            <div className="relative">

              <FaLock
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                required
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  pl-11
                  pr-12
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-blue-600
                "
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* ==========================================
              Buttons
          ========================================== */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
              pt-3
            "
          >

            <button
              type="submit"
              disabled={saving}
              className="
                flex-1
                inline-flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                hover:bg-blue-700
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <FaKey />

              {saving
                ? "Updating..."
                : "Change Password"}
            </button>

            <Link
              to="/profile"
              className="
                flex-1
                inline-flex
                items-center
                justify-center
                bg-gray-100
                text-gray-700
                px-6
                py-3
                rounded-xl
                font-semibold
                hover:bg-gray-200
                transition
              "
            >
              Cancel
            </Link>

          </div>

        </form>

      </Card>

      {/* ==========================================
          Security Notice
      ========================================== */}

      <div
        className="
          mt-6
          bg-blue-50
          border
          border-blue-100
          rounded-2xl
          p-5
        "
      >
        <div className="flex gap-3">

          <FaLock className="text-blue-600 mt-1" />

          <div>

            <h3 className="font-semibold text-blue-900">
              Security Tip
            </h3>

            <p className="text-sm text-blue-700 mt-1">
              Use a strong password that is difficult to
              guess and avoid sharing your password with
              anyone.
            </p>

          </div>

        </div>
      </div>

    </div>
  );
}

export default ChangePassword;