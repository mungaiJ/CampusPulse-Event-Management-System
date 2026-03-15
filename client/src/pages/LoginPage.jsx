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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-950 to-black px-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-30 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Login to your campus event account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-blue-500 outline-none"
            />
            <label className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400 peer-focus:text-blue-400">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="peer w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-blue-500 outline-none"
            />
            <label className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400 peer-focus:text-blue-400">
              Password
            </label>
          </div>

          <button className="w-full py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition">
            Login
          </button>

          {message && (
            <p className="text-center text-red-400 text-sm">{message}</p>
          )}
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
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
