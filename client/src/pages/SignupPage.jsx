import { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Calculate password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[a-z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    if (form.password.length < 8) {
      setMessageType("error");
      setMessage("Password must be at least 8 characters long.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return false;
    }

    if (!form.name || !form.email) {
      setMessageType("error");
      setMessage("Please fill in all required fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (data.user || data.message.includes("successful")) {
        setMessageType("success");
        setMessage("Account created successfully! Redirecting...");

        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);

        setForm({ name: "", email: "", password: "", confirmPassword: "", role: "student" });

        setTimeout(() => {
          navigate(data.user.role === "admin" ? "/admin" : "/my-events");
        }, 1000);
      } else {
        setMessageType("error");
        setMessage(data.error || data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-600";
    if (passwordStrength <= 2) return "bg-red-600";
    if (passwordStrength <= 3) return "bg-yellow-600";
    return "bg-green-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">

      {/* Glow background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-30 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Join our campus event platform
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="peer w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
              placeholder=" "
            />
            <label className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400 peer-focus:text-blue-400 peer-placeholder-shown:text-gray-400">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="peer w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
              placeholder=" "
            />
            <label className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400 peer-focus:text-blue-400 peer-placeholder-shown:text-gray-400">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="peer w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
              placeholder=" "
            />
            <label className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400 peer-focus:text-blue-400 peer-placeholder-shown:text-gray-400">
              Password
            </label>
            
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full flex-1 ${
                        i < passwordStrength ? getPasswordStrengthColor() : "bg-gray-700"
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  {passwordStrength <= 2 && "Weak"}
                  {passwordStrength === 3 && "Fair"}
                  {passwordStrength >= 4 && "Strong"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="peer w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
              placeholder=" "
            />
            <label className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400 peer-focus:text-blue-400 peer-placeholder-shown:text-gray-400">
              Confirm Password
            </label>
          </div>

          {/* Role */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="staff">Staff</option>
          </select>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {message && (
            <p className={`text-center text-sm font-medium ${messageType === "success" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
