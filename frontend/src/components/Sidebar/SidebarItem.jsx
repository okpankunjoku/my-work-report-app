import { useState } from "react";

import {
  FaChartPie,
  FaClipboardList,
  FaCalendarCheck,
  FaPlusCircle,
  FaUserCircle,
  FaCog,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        hidden
        lg:flex
        flex-col
        bg-white
        border-r
        shadow-sm
        min-h-screen
        transition-all
        duration-300
        ${collapsed ? "w-24" : "w-72"}
      `}
    >
      <div className="relative">

        {!collapsed && <SidebarLogo />}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            absolute
            -right-4
            top-6
            bg-white
            border
            rounded-full
            w-8
            h-8
            shadow-md
            flex
            items-center
            justify-center
            hover:bg-blue-600
            hover:text-white
            transition
          "
        >
          {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>

      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">

        <SidebarItem
          to="/dashboard"
          title="Dashboard"
          icon={<FaChartPie />}
          collapsed={collapsed}
        />

        <SidebarItem
          to="/attendance"
          title="Attendance"
          icon={<FaCalendarCheck />}
          collapsed={collapsed}
        />

        <SidebarItem
          to="/reports"
          title="Reports"
          icon={<FaClipboardList />}
          collapsed={collapsed}
        />

        <SidebarItem
          to="/create-report"
          title="Create Report"
          icon={<FaPlusCircle />}
          collapsed={collapsed}
        />

        <SidebarItem
          to="/profile"
          title="Profile"
          icon={<FaUserCircle />}
          collapsed={collapsed}
        />

        <SidebarItem
          to="/settings"
          title="Settings"
          icon={<FaCog />}
          collapsed={collapsed}
        />

      </nav>

    </aside>
  );
}

export default Sidebar;