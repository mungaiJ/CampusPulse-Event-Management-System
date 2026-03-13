import { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  const data = await signupUser(form);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    if (data.token) localStorage.setItem("token", data.token);
    // ✅ clear form after success
    setForm({ name: "", email: "", password: "", role: "student" });
    navigate(data.user.role === "admin" ? "/admin" : "/my-events");
  } else {
    setMessage(data.error || data.message || "Signup failed.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 overflow-hidden">
        {/* Techy Gradient Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

        <h1 className="text-4xl font-bold text-white text-center mb-2 tracking-tight">Sign Up</h1>
        <p className="text-center text-gray-400 mb-6 text-sm">Join our next-gen campus event platform</p>

        <form className="relative z-10" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full mb-6 p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105">
            Create Account
          </button>

          {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span className="text-blue-400 hover:text-blue-300 cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}