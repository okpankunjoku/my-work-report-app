import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request...");

      const response = await api.post(
        "/auth/login",
        formData
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      // ==========================================
      // GET RESPONSE DATA
      // ==========================================

      const responseData = response.data?.data;

      if (!responseData) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      const { token, employee } = responseData;

      // ==========================================
      // VALIDATE TOKEN
      // ==========================================

      if (!token) {
        throw new Error(
          "Login successful, but no token was returned."
        );
      }

      // ==========================================
      // VALIDATE EMPLOYEE
      // ==========================================

      if (!employee) {
        throw new Error(
          "Login successful, but no employee data was returned."
        );
      }

      console.log(
        "LOGGED-IN EMPLOYEE:",
        employee
      );

      console.log(
        "EMPLOYEE ROLE:",
        employee.role
      );

      // ==========================================
      // SAVE AUTHENTICATION
      // ==========================================

      login(employee, token);

      // ==========================================
      // IMPORTANT:
      // SAVE THE EMPLOYEE OBJECT DIRECTLY
      // TO LOCAL STORAGE
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(employee)
      );

      localStorage.setItem(
        "token",
        token
      );

      // ==========================================
      // VERIFY WHAT WAS SAVED
      // ==========================================

      const savedUser =
        localStorage.getItem("user");

      const savedToken =
        localStorage.getItem("token");

      console.log(
        "SAVED USER:",
        savedUser
          ? JSON.parse(savedUser)
          : null
      );

      console.log(
        "SAVED USER ROLE:",
        savedUser
          ? JSON.parse(savedUser)?.role
          : null
      );

      console.log(
        "TOKEN SAVED:",
        !!savedToken
      );

      // ==========================================
      // SHOW SUCCESS
      // ==========================================

      alert("Login successful!");

      // ==========================================
      // REDIRECT BASED ON ROLE
      // ==========================================

      const userRole =
        employee.role?.toLowerCase();

      if (userRole === "admin") {
        console.log(
          "Admin detected. Redirecting to admin dashboard..."
        );

        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        console.log(
          "Employee detected. Redirecting to employee dashboard..."
        );

        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password."
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

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Work Reports
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to your account
        </p>

        {/* ==========================================
            LOGIN FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={<FaEnvelope />}
          />

          {/* Password */}

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={<FaLock />}
          />

          {/* ==========================================
              FORGOT PASSWORD
          ========================================== */}

          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </Button>
        </form>

        {/* ==========================================
            REGISTER
        ========================================== */}

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;