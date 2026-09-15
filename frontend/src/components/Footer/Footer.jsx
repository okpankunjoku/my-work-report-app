import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Left */}

          <div>

            <h2 className="font-bold text-lg text-gray-800">
              Work Reports
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Employee Productivity & Daily Reporting System
            </p>

          </div>

          {/* Center */}

          <div className="text-center">

            <p className="text-gray-500 text-sm">
              © 2026 Work Reports
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Built with React • Node.js • MongoDB
            </p>

          </div>

          {/* Right */}

          <div className="flex items-center gap-5 text-xl">

            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <FaGithub />
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <FaLinkedin />
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <FaGlobe />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;