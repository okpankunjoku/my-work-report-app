import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaIdBadge,
} from "react-icons/fa";

import api from "../../services/api";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    position: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE REGISTRATION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        formData
      );

      console.log(
        "REGISTRATION RESPONSE:",
        response.data
      );

      alert(
        response.data?.message ||
          "Account created successfully."
      );

      // Registration successful.
      // Send user back to login page.
      navigate("/login");
    } catch (error) {
      console.error(
        "REGISTRATION ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 flex items-center justify-center px-5 py-10">

      {/* ========================================
          REGISTER CARD
      ======================================== */}

      <div className="w-full max-w-lg bg-blue-50 border border-blue-100 shadow-2xl rounded-2xl p-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-700">
            Work Reports
          </h1>

          <p className="text-gray-600 mt-2">
            Create your employee account
          </p>

        </div>

        {/* ======================================
            REGISTRATION FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* FULL NAME */}

          <Input
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            icon={<FaUser />}
            required
          />

          {/* EMPLOYEE ID */}

          <Input
            label="Employee ID"
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="Enter employee ID"
            icon={<FaIdBadge />}
            required
          />

          {/* EMAIL */}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            icon={<FaEnvelope />}
            required
          />

          {/* PASSWORD */}

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            icon={<FaLock />}
            required
          />

          {/* PHONE */}

          <Input
            label="Phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            icon={<FaPhone />}
            required
          />

          {/* DEPARTMENT */}

          <Input
            label="Department"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter department"
            icon={<FaBuilding />}
            required
          />

          {/* POSITION */}

          <Input
            label="Position"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Enter position"
            icon={<FaBriefcase />}
            required
          />

          {/* ====================================
              SUBMIT BUTTON
          ==================================== */}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </Button>

        </form>

        {/* ======================================
            LOGIN LINK
        ====================================== */}

        <div className="text-center mt-6">

          <p className="text-gray-600">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="inline-block mt-1 text-blue-600 font-semibold hover:text-blue-800 hover:underline transition"
          >
            Login
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Register;