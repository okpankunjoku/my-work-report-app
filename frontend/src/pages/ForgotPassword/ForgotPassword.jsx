import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Sending forgot password request..."
      );

      const response = await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        response.data
      );

      setMessage(
        response.data?.message ||
          "If an account with that email exists, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-600">
            Forgot Password?
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your email address and we'll send you
            a link to reset your password.
          </p>

        </div>

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}

        {message && (
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

            </div>
          </div>

          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        {/* ==========================================
            BACK TO LOGIN
        ========================================== */}

        <div className="text-center mt-6">

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
          >
            <FaArrowLeft />
            Back to Login
          </Link>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;