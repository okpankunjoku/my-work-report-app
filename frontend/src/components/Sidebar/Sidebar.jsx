import {
  FaChartPie,
  FaClipboardList,
  FaCalendarCheck,
  FaPlusCircle,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";

import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  return (
    <aside
      className="
        hidden
        lg:flex
        flex-col
        w-72
        bg-white
        border-r
        min-h-screen
        shadow-sm
      "
    >
      <SidebarLogo />

      <nav className="flex-1 px-4 py-6 space-y-2">

        <SidebarItem
          to="/dashboard"
          title="Dashboard"
          icon={<FaChartPie />}
        />

        <SidebarItem
          to="/attendance"
          title="Attendance"
          icon={<FaCalendarCheck />}
        />

        <SidebarItem
          to="/reports"
          title="Reports"
          icon={<FaClipboardList />}
        />

        <SidebarItem
          to="/create-report"
          title="Create Report"
          icon={<FaPlusCircle />}
        />

        <SidebarItem
          to="/profile"
          title="Profile"
          icon={<FaUserCircle />}
        />

        <SidebarItem
          to="/settings"
          title="Settings"
          icon={<FaCog />}
        />

      </nav>
    </aside>
  );
}

export default Sidebar;