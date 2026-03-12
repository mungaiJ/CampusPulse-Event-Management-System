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
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 cursor-pointer">
          CampusPulse
        </h1>

        <div className="flex items-center space-x-6 text-gray-300">
          
          <Link
            to="/"
            className="font-medium hover:text-blue-400 hover:underline transition"
          >
            Events
          </Link>

          {user && (
            <Link
              to="/my-events"
              className="font-medium hover:text-blue-400 hover:underline transition"
            >
              My Events
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="font-medium hover:text-purple-400 hover:underline transition"
            >
              Admin
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/signup"
                className="font-medium hover:text-green-400 hover:underline transition"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="font-medium hover:text-blue-400 hover:underline transition"
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}