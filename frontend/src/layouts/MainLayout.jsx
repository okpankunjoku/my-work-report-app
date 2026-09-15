import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";

import Settings from "../pages/Settings/Settings";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==========================================
          Top Navigation
      ========================================== */}

      <Navbar />

      {/* ==========================================
          Main Application Area
      ========================================== */}

      <main
        className="
          min-h-[calc(100vh-80px)]
          px-4
          sm:px-6
          lg:px-8
          py-6
          sm:py-8
        "
      >
        <Outlet />
      </main>

      {/* ==========================================
          Footer Space
      ========================================== */}

      <div className="h-4" />

    </div>
  );
}

export default MainLayout;