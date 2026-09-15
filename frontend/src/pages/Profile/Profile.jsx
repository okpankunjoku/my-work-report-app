import { useEffect, useState } from "react";

import {
  FaUserCircle,
  FaEnvelope,
  FaIdBadge,
  FaBuilding,
  FaBriefcase,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import Card from "../../components/Card/Card";

import {
  getProfile,
  updateProfile,
} from "../../services/profileService";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    department: "",
    position: "",
  });

  // ==========================================
  // Fetch Profile
  // ==========================================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProfile();

      console.log("Profile response:", response);

      const employee =
        response?.data?.employee ||
        response?.data ||
        null;

      setProfile(employee);

      if (employee) {
        setFormData({
          fullName: employee.fullName || "",
          phone: employee.phone || "",
          department: employee.department || "",
          position: employee.position || "",
        });
      }
    } catch (error) {
      console.error("Profile Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Handle Input
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // Start Editing
  // ==========================================
  const handleEdit = () => {
    setSuccess("");
    setError("");
    setEditing(true);
  };

  // ==========================================
  // Cancel Editing
  // ==========================================
  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || "",
      phone: profile?.phone || "",
      department: profile?.department || "",
      position: profile?.position || "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  // ==========================================
  // Update Profile
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateProfile(formData);

      console.log("Updated profile:", response);

      const updatedEmployee =
        response?.data?.employee ||
        response?.data ||
        null;

      if (updatedEmployee) {
        setProfile(updatedEmployee);

        setFormData({
          fullName: updatedEmployee.fullName || "",
          phone: updatedEmployee.phone || "",
          department: updatedEmployee.department || "",
          position: updatedEmployee.position || "",
        });
      } else {
        await fetchProfile();
      }

      setSuccess("Profile updated successfully.");

      setEditing(false);
    } catch (error) {
      console.error("Update Profile Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="text-gray-600 font-medium mt-4">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================
  if (error && !profile) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <FaTimes />
            </div>

            <div>
              <p className="font-bold text-lg">
                Unable to load profile
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchProfile}
                className="
                  mt-4
                  bg-blue-600
                  text-white
                  px-5
                  py-2.5
                  rounded-xl
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12 text-gray-500">
        Profile information not available.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ==========================================
          Page Header
      ========================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Account
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your personal and employee information.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={handleEdit}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              shadow-sm
              hover:bg-blue-700
              hover:shadow-md
              transition-all
              duration-300
              w-fit
            "
          >
            <FaEdit />
            Edit Profile
          </button>
        )}

      </div>

      {/* ==========================================
          Success Message
      ========================================== */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <FaCheckCircle />
          </div>

          <div>
            <p className="font-semibold">
              Success
            </p>

            <p className="text-sm">
              {success}
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          Error Message
      ========================================== */}
      {error && profile && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <FaTimes />
          </div>

          <div>
            <p className="font-semibold">
              Update failed
            </p>

            <p className="text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          Profile Hero
      ========================================== */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-blue-600
          via-blue-700
          to-indigo-800
          p-6
          sm:p-8
          text-white
          shadow-lg
        "
      >

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full"></div>

        <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-white/5 rounded-full"></div>

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">

          {/* Avatar */}
          <div className="w-28 h-28 rounded-3xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">

            <FaUserCircle className="text-7xl text-white" />

          </div>

          {/* Profile Info */}
          <div className="flex-1">

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">

              <h2 className="text-2xl sm:text-3xl font-bold">
                {profile.fullName || "Employee"}
              </h2>

              <span className="inline-flex items-center gap-1.5 bg-green-400/20 border border-green-300/30 text-green-100 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                <FaCheckCircle className="text-green-300" />
                {profile.status || "Active"}
              </span>

            </div>

            <p className="text-blue-100 mt-2 text-lg">
              {profile.position || "Employee"}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-blue-100">

              <span className="flex items-center gap-2">
                <FaBuilding />
                {profile.department || "Department not set"}
              </span>

              <span className="flex items-center gap-2">
                <FaIdBadge />
                {profile.employeeId || "--"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          Employee Information
      ========================================== */}
      <Card>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Employee Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your registered employee details.
            </p>

          </div>

          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FaUserCircle />
          </div>

        </div>

        {editing ? (

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    pl-11
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                    transition
                  "
                  required
                />

              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>

              <div className="relative">

                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    pl-11
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                    transition
                  "
                />

              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>

              <div className="relative">

                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    pl-11
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                    transition
                  "
                  required
                />

              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position
              </label>

              <div className="relative">

                <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    pl-11
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                    transition
                  "
                  required
                />

              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">

              <button
                type="submit"
                disabled={saving}
                className="
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
                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-gray-100
                  text-gray-700
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-gray-200
                  transition
                  disabled:opacity-50
                "
              >
                <FaTimes />
                Cancel
              </button>

            </div>

          </form>

        ) : (

          <div className="grid sm:grid-cols-2 gap-4">

            {/* Full Name */}
            <div className="group border border-gray-100 bg-gray-50 rounded-2xl p-5 hover:bg-blue-50 hover:border-blue-100 transition">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FaUserCircle />
                </div>

                <span className="text-sm text-gray-500">
                  Full Name
                </span>
              </div>

              <p className="font-bold text-gray-800">
                {profile.fullName || "--"}
              </p>

            </div>

            {/* Email */}
            <div className="group border border-gray-100 bg-gray-50 rounded-2xl p-5 hover:bg-blue-50 hover:border-blue-100 transition">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FaEnvelope />
                </div>

                <span className="text-sm text-gray-500">
                  Email Address
                </span>
              </div>

              <p className="font-bold text-gray-800 break-all">
                {profile.email || "--"}
              </p>

            </div>

            {/* Employee ID */}
            <div className="group border border-gray-100 bg-gray-50 rounded-2xl p-5 hover:bg-blue-50 hover:border-blue-100 transition">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FaIdBadge />
                </div>

                <span className="text-sm text-gray-500">
                  Employee ID
                </span>
              </div>

              <p className="font-bold text-gray-800">
                {profile.employeeId || "--"}
              </p>

            </div>

            {/* Phone */}
            <div className="group border border-gray-100 bg-gray-50 rounded-2xl p-5 hover:bg-green-50 hover:border-green-100 transition">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <FaPhone />
                </div>

                <span className="text-sm text-gray-500">
                  Phone Number
                </span>
              </div>

              <p className="font-bold text-gray-800">
                {profile.phone || "--"}
              </p>

            </div>

            {/* Department */}
            <div className="group border border-gray-100 bg-gray-50 rounded-2xl p-5 hover:bg-orange-50 hover:border-orange-100 transition">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FaBuilding />
                </div>

                <span className="text-sm text-gray-500">
                  Department
                </span>
              </div>

              <p className="font-bold text-gray-800">
                {profile.department || "--"}
              </p>

            </div>

            {/* Position */}
            <div className="group border border-gray-100 bg-gray-50 rounded-2xl p-5 hover:bg-purple-50 hover:border-purple-100 transition">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FaBriefcase />
                </div>

                <span className="text-sm text-gray-500">
                  Position
                </span>
              </div>

              <p className="font-bold text-gray-800">
                {profile.position || "--"}
              </p>

            </div>

          </div>

        )}

      </Card>

      {/* ==========================================
          Account Security
      ========================================== */}
      <Card>

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 text-green-600 flex items-center justify-center">
            <FaShieldAlt />
          </div>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Account Status
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your account is currently{" "}
              <span className="font-semibold text-green-600">
                {profile.status || "Active"}
              </span>
              .
            </p>

          </div>

        </div>

      </Card>

    </div>
  );
}

export default Profile;