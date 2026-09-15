import { useEffect, useState } from "react";

import {
  FaClipboardList,
  FaClock,
  FaCalendarCheck,
  FaUsers,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";

import api from "../../services/api";

import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import WelcomeCard from "../../components/Dashboard/WelcomeCard";
import StatCard from "../../components/Dashboard/StatCard";
import AttendanceCard from "../../components/Dashboard/AttendanceCard";
import RecentReports from "../../components/Dashboard/RecentReports";
import ActivityList from "../../components/Dashboard/ActivityList";
import QuickActions from "../../components/Dashboard/QuickActions";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Dashboard
  // ==========================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      console.log(
        "Dashboard response:",
        response.data
      );

      setDashboard(response.data?.data || {});
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
          px-4
        "
      >
        <div className="text-center">

          <div
            className="
              w-14
              h-14
              mx-auto
              rounded-2xl
              bg-blue-50
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                w-8
                h-8
                border-4
                border-blue-200
                border-t-blue-600
                rounded-full
                animate-spin
              "
            />
          </div>

          <h2 className="text-lg font-bold text-gray-800 mt-5">
            Loading Dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Preparing your workspace...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // Error State
  // ==========================================

  if (error) {
    return (
      <div
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
          px-4
        "
      >
        <div
          className="
            w-full
            max-w-md
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-sm
            p-8
            text-center
          "
        >

          {/* Error Icon */}

          <div
            className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-red-50
              text-red-500
              flex
              items-center
              justify-center
              text-2xl
            "
          >
            <FaExclamationCircle />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Unable to Load Dashboard
          </h2>

          <p className="text-gray-500 text-sm mt-2 leading-6">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="
              mt-6
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
              text-sm
              hover:bg-blue-700
              transition
            "
          >
            <FaRedo />

            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // Dashboard Data
  // ==========================================

  const employee =
    dashboard?.employee || {};

  const attendance =
    dashboard?.today?.attendance || {};

  const reports =
    dashboard?.recentReports ||
    dashboard?.reports ||
    [];

  const activities =
    dashboard?.activities || [];

  const stats =
    dashboard?.stats || {};

  // ==========================================
  // Dashboard
  // ==========================================

  return (
    <div
      className="
        max-w-[1600px]
        mx-auto
        space-y-7
        pb-8
      "
    >

      {/* ======================================
          Dashboard Header
      ====================================== */}

      <DashboardHeader
        employee={employee}
      />

      {/* ======================================
          Welcome Card
      ====================================== */}

      <WelcomeCard
        employee={employee}
      />

      {/* ======================================
          Statistics
      ====================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-gray-900">
            Today's Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            A quick look at your workday.
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
          "
        >

          {/* Reports */}

          <StatCard
            title="Today's Reports"
            value={
              stats.reportsToday ??
              reports.length ??
              0
            }
            icon={<FaClipboardList />}
            color="text-blue-600"
            change={
              stats.reportsToday > 0
                ? "Submitted"
                : "Pending"
            }
            changeText="Today"
          />

          {/* Attendance */}

          <StatCard
            title="Attendance"
            value={
              stats.attendance ||
              attendance.status ||
              "Not Yet"
            }
            icon={<FaCalendarCheck />}
            color="text-green-600"
            change={
              attendance.clockIn
                ? "Present"
                : "Pending"
            }
            changeText="Today"
          />

          {/* Clock In */}

          <StatCard
            title="Clock In"
            value={
              attendance.clockIn
                ? new Date(
                    attendance.clockIn
                  ).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "-- : --"
            }
            icon={<FaClock />}
            color="text-orange-600"
            change={
              attendance.workingHours
                ? `${attendance.workingHours} hrs`
                : "Not started"
            }
            changeText="Working Hours"
          />

          {/* Employees */}

          <StatCard
            title="Employees"
            value={
              stats.employees ?? 1
            }
            icon={<FaUsers />}
            color="text-purple-600"
            change="Active"
            changeText="Workforce"
          />

        </div>

      </section>

      {/* ======================================
          Today's Attendance
      ====================================== */}

      <AttendanceCard
        attendance={attendance}
      />

      {/* ======================================
          Reports + Activity
      ====================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-gray-900">
            Work Activity
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review your latest reports and activities.
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          "
        >

          <RecentReports
            reports={reports}
          />

          <ActivityList
            activities={activities}
          />

        </div>

      </section>

      {/* ======================================
          Quick Actions
      ====================================== */}

      <QuickActions />

    </div>
  );
}

export default Dashboard;