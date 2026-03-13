import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <div className="relative bg-gray-900 text-white py-32 text-center overflow-hidden">
      {/* Background Gradient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
        Meet, Mingle, Make Memories
      </h2>

      <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
        Your guide to the best campus events. Meet friends, join activities, and experience campus life to the fullest.
      </p>

      <div className="flex justify-center space-x-6">
        <Link
          to="/login"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition transform"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition transform"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}