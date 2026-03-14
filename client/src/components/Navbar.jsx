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
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent cursor-pointer drop-shadow-lg hover:scale-105 transition-transform">
            CampusPulse
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-gray-300">

          <Link
            to="/"
            className="font-medium hover:text-blue-400 transition"
          >
            Events
          </Link>

          {user && (
            <Link
              to="/my-events"
              className="font-medium hover:text-blue-400 transition"
            >
              My Events
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="font-medium hover:text-purple-400 transition"
            >
              Admin
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/signup"
                className="font-medium hover:text-green-400 transition"
              >
                Signup
              </Link>

              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-105 transition"
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold hover:scale-105 transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}