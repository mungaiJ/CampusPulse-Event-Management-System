import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-3xl font-extrabold text-white tracking-tight cursor-pointer hover:text-blue-400 transition-colors">
            CampusPulse
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-5">

          <Link
            to="/"
            className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
          >
            Events
          </Link>

          {user && (
            <Link
              to="/my-events"
              className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
            >
              My Events
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-gray-300 hover:text-purple-400 font-medium transition-colors"
            >
              Admin
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/signup"
                className="text-gray-300 hover:text-green-400 font-medium transition-colors"
              >
                Signup
              </Link>

              <Link
                to="/login"
                className="px-5 py-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-transform transition-shadow"
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 hover:scale-105 hover:shadow-lg transition-all"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}