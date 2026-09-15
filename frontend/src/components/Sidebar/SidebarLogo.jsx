import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function SidebarLogo() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-3 px-5 py-6 border-b"
    >
      <img
        src={logo}
        alt="Logo"
        className="w-11 h-11 object-contain"
      />

      <div>
        <h2 className="font-bold text-lg">
          Work Reports
        </h2>

        <p className="text-xs text-gray-500">
          Employee Portal
        </p>
      </div>
    </Link>
  );
}

export default SidebarLogo;