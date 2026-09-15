import { useEffect, useState } from "react";

import {
  FaSearch,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserSlash,
  FaSyncAlt,
  FaEye,
  FaEdit,
  FaLock,
  FaUnlock,
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

import api from "../../services/api";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [error, setError] = useState("");

  // ==========================================
  // VIEW EMPLOYEE MODAL
  // ==========================================

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [showViewModal, setShowViewModal] =
    useState(false);

  // ==========================================
  // EDIT EMPLOYEE MODAL
  // ==========================================

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    department: "",
    position: "",
  });

  const [saving, setSaving] = useState(false);

  // ==========================================
  // STATUS LOADING
  // ==========================================

  const [statusLoading, setStatusLoading] =
    useState(null);

  // ==========================================
  // DELETE LOADING
  // ==========================================

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  // ==========================================
  // DELETE CONFIRMATION MODAL
  // ==========================================

  const [employeeToDelete, setEmployeeToDelete] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  // ==========================================
  // FETCH EMPLOYEES
  // ==========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      // Search employees
      if (search.trim()) {
        response = await api.get(
          `/employees/search?q=${encodeURIComponent(
            search.trim()
          )}`
        );
      }

      // Filter by status
      else if (status !== "All") {
        response = await api.get(
          `/employees/status/${status}`
        );
      }

      // Get all employees
      else {
        response = await api.get("/employees");
      }

      console.log(
        "EMPLOYEES RESPONSE:",
        response.data
      );

      setEmployees(response.data?.data || []);
    } catch (err) {
      console.error(
        "EMPLOYEE MANAGEMENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load employees."
      );

      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD EMPLOYEES
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setSearch("");
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (employeeStatus) => {
    if (employeeStatus === "Active") {
      return <FaUserCheck />;
    }

    if (employeeStatus === "Inactive") {
      return <FaUserTimes />;
    }

    if (employeeStatus === "Suspended") {
      return <FaUserSlash />;
    }

    return <FaUsers />;
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (employeeStatus) => {
    switch (employeeStatus) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Inactive":
        return "bg-gray-100 text-gray-700";

      case "Suspended":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================================
  // VIEW EMPLOYEE
  // ==========================================

  const handleView = async (employee) => {
    try {
      setError("");

      const response = await api.get(
        `/employees/${employee._id}`
      );

      console.log(
        "EMPLOYEE DETAILS:",
        response.data
      );

      setSelectedEmployee(
        response.data?.data || employee
      );

      setShowViewModal(true);
    } catch (err) {
      console.error(
        "VIEW EMPLOYEE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load employee details."
      );
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);

    setEditForm({
      fullName: employee.fullName || "",
      phone: employee.phone || "",
      department: employee.department || "",
      position: employee.position || "",
    });

    setShowEditModal(true);
  };

  // ==========================================
  // EDIT FORM CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // UPDATE EMPLOYEE
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await api.put(
        `/employees/${selectedEmployee._id}`,
        editForm
      );

      console.log(
        "EMPLOYEE UPDATED:",
        response.data
      );

      setShowEditModal(false);
      setSelectedEmployee(null);

      await fetchEmployees();

      alert("Employee updated successfully.");
    } catch (err) {
      console.error(
        "UPDATE EMPLOYEE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SUSPEND / ACTIVATE EMPLOYEE
  // ==========================================

  const handleStatusChange = async (employee) => {
    if (!employee?._id) {
      return;
    }

    const newStatus =
      employee.status === "Active"
        ? "Suspended"
        : "Active";

    const action =
      newStatus === "Suspended"
        ? "suspend"
        : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${employee.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setStatusLoading(employee._id);
      setError("");

      const response = await api.patch(
        `/employees/${employee._id}/status`,
        {
          status: newStatus,
        }
      );

      console.log(
        "EMPLOYEE STATUS UPDATED:",
        response.data
      );

      setEmployees((currentEmployees) =>
        currentEmployees.map((item) =>
          item._id === employee._id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      alert(
        `${employee.fullName} is now ${newStatus}.`
      );
    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update employee status."
      );
    } finally {
      setStatusLoading(null);
    }
  };

  // ==========================================
  // OPEN DELETE CONFIRMATION
  // ==========================================

  const handleDeleteClick = (employee) => {
    if (!employee?._id) {
      return;
    }

    // Extra frontend protection for admin accounts
    if (
      employee.role &&
      employee.role.toLowerCase() === "admin"
    ) {
      setError(
        "Admin accounts cannot be deleted."
      );

      return;
    }

    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  // ==========================================
  // DELETE EMPLOYEE
  // ==========================================

  const handleDelete = async () => {
    if (!employeeToDelete?._id) {
      return;
    }

    try {
      setDeleteLoading(employeeToDelete._id);
      setError("");

      const response = await api.delete(
        `/employees/${employeeToDelete._id}`
      );

      console.log(
        "EMPLOYEE DELETED:",
        response.data
      );

      // Remove deleted employee immediately
      setEmployees((currentEmployees) =>
        currentEmployees.filter(
          (employee) =>
            employee._id !== employeeToDelete._id
        )
      );

      setShowDeleteModal(false);
      setEmployeeToDelete(null);

      alert(
        `${employeeToDelete.fullName} has been deleted successfully.`
      );
    } catch (err) {
      console.error(
        "DELETE EMPLOYEE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete employee."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==========================================
  // CLOSE VIEW MODAL
  // ==========================================

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedEmployee(null);
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  // ==========================================
  // CLOSE DELETE MODAL
  // ==========================================

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage employees, search records and
            monitor account status.
          </p>
        </div>

        {/* ==========================================
            SEARCH + FILTER
        ========================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* SEARCH */}

            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name, email or employee ID..."
                className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>

            {/* STATUS FILTER */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="lg:w-56 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">
                All Employees
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="Suspended">
                Suspended
              </option>
            </select>

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchEmployees}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
            >
              <FaSyncAlt
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>

        {/* ==========================================
            EMPLOYEE COUNT
        ========================================== */}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Employees
            </h2>

            <p className="text-sm text-gray-500">
              {employees.length} employee
              {employees.length !== 1 ? "s" : ""}
              {" "}found
            </p>
          </div>
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* ==========================================
            LOADING / EMPTY / TABLE
        ========================================== */}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <FaSyncAlt className="text-3xl text-blue-600 animate-spin" />
            </div>

            <p className="text-gray-500">
              Loading employees...
            </p>
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaUsers className="mx-auto text-5xl text-gray-300 mb-4" />

            <h3 className="text-lg font-semibold text-gray-700">
              No employees found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">

                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Employee
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Employee ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Department
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Position
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {employees.map((employee) => (

                    <tr
                      key={employee._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* EMPLOYEE */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          {employee.profileImage ? (
                            <img
                              src={employee.profileImage}
                              alt={employee.fullName}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              {employee.fullName
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-800">
                              {employee.fullName}
                            </p>

                            <p className="text-sm text-gray-500">
                              {employee.email}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* EMPLOYEE ID */}

                      <td className="px-6 py-5">
                        <span className="font-medium text-gray-700">
                          {employee.employeeId}
                        </span>
                      </td>

                      {/* DEPARTMENT */}

                      <td className="px-6 py-5 text-gray-600">
                        {employee.department || "—"}
                      </td>

                      {/* POSITION */}

                      <td className="px-6 py-5 text-gray-600">
                        {employee.position || "—"}
                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-700">
                          {employee.role || "Employee"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(
                            employee.status
                          )}`}
                        >
                          {getStatusIcon(
                            employee.status
                          )}

                          {employee.status}
                        </span>
                      </td>

                      {/* ==========================================
                          ACTIONS
                      ========================================== */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(employee)
                            }
                            title="View Employee"
                            className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"
                          >
                            <FaEye />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(employee)
                            }
                            title="Edit Employee"
                            className="w-9 h-9 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition"
                          >
                            <FaEdit />
                          </button>

                          {/* SUSPEND / ACTIVATE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                employee
                              )
                            }
                            disabled={
                              statusLoading ===
                              employee._id
                            }
                            title={
                              employee.status ===
                              "Active"
                                ? "Suspend Employee"
                                : "Activate Employee"
                            }
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition disabled:opacity-50 ${
                              employee.status ===
                              "Active"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {statusLoading ===
                            employee._id ? (
                              <FaSyncAlt className="animate-spin" />
                            ) : employee.status ===
                              "Active" ? (
                              <FaLock />
                            ) : (
                              <FaUnlock />
                            )}
                          </button>

                          {/* DELETE */}

                          {employee.role?.toLowerCase() !==
                            "admin" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteClick(
                                  employee
                                )
                              }
                              disabled={
                                deleteLoading ===
                                employee._id
                              }
                              title="Delete Employee"
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-50"
                            >
                              {deleteLoading ===
                              employee._id ? (
                                <FaSyncAlt className="animate-spin" />
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>

      {/* ==========================================
          VIEW EMPLOYEE MODAL
      ========================================== */}

      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Employee Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Complete employee information
                </p>
              </div>

              <button
                type="button"
                onClick={closeViewModal}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-6">

              <div className="flex items-center gap-4 mb-6">

                {selectedEmployee.profileImage ? (
                  <img
                    src={selectedEmployee.profileImage}
                    alt={selectedEmployee.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                    {selectedEmployee.fullName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedEmployee.fullName}
                  </h3>

                  <p className="text-gray-500">
                    {selectedEmployee.email}
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Employee ID
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedEmployee.employeeId ||
                      "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Phone
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedEmployee.phone ||
                      "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Department
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedEmployee.department ||
                      "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Position
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedEmployee.position ||
                      "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Role
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedEmployee.role ||
                      "Employee"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mt-1 ${getStatusStyle(
                      selectedEmployee.status
                    )}`}
                  >
                    {getStatusIcon(
                      selectedEmployee.status
                    )}

                    {selectedEmployee.status}
                  </span>
                </div>

              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">

              <button
                type="button"
                onClick={closeViewModal}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          EDIT EMPLOYEE MODAL
      ========================================== */}

      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Employee
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update employee information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
              >
                <FaTimes />
              </button>

            </div>

            <form
              onSubmit={handleUpdate}
              className="p-6 space-y-5"
            >

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  value={editForm.position}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <FaSyncAlt className="animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      {showDeleteModal && employeeToDelete && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}

            <div className="p-6 text-center">

              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <FaExclamationTriangle className="text-2xl" />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                Delete Employee
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Are you sure you want to permanently
                delete{" "}
                <span className="font-semibold text-gray-800">
                  {employeeToDelete.fullName}
                </span>
                ?
              </p>

              <p className="text-sm text-red-500 mt-2">
                This action cannot be undone.
              </p>

            </div>

            {/* BUTTONS */}

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <FaSyncAlt className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Delete Employee
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;