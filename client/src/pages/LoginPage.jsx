import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(form);

    if (data.message && data.message.includes("successful")) {
      setMessage("Login successful! Redirecting...");

      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

      navigate(data.user.role === "admin" ? "/admin" : "/my-events");
    } else {
      setMessage(data.error || data.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"></div>

        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"></div>

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Login
        </h1>

        <p className="text-center text-gray-400 mb-6 text-sm">
          Access your campus event account
        </p>

        <form className="relative z-10" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          />

          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:scale-105 transition">
            Login
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-red-400">{message}</p>
          )}
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm relative z-10">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}