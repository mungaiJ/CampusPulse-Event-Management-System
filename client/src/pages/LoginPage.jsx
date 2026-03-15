import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await loginUser(form);

      if (data.message && data.message.includes("successful")) {
        setMessageType("success");
        setMessage("Login successful! Redirecting...");

        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);

        setTimeout(() => {
          navigate(data.user.role === "admin" ? "/admin" : "/my-events");
        }, 1000);
      } else {
        setMessageType("error");
        setMessage(data.error || data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setMessageType("error");
      setMessage("Please enter your email address.");
      return;
    }
    
    // In a real app, this would send an email with a reset link
    setMessageType("success");
    setMessage(`Password reset link would be sent to ${resetEmail}. Check your email.`);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail("");
      setMessage(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">

      {/* Glow background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-30 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

        {!showForgotPassword ? (
          <>
            <h1 className="text-4xl font-bold text-white text-center mb-2">
              Welcome Back
            </h1>

            <p className="text-center text-gray-400 mb-8 text-sm">
              Login to your campus event account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

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
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {message && (
                <p className={`text-center text-sm font-medium ${messageType === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </form>

            <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setMessage(null);
                }}
                className="w-full text-center text-gray-400 hover:text-blue-400 text-sm transition"
              >
                Forgot Password?
              </button>

              <p className="text-center text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Reset Password
            </h1>

            <p className="text-center text-gray-400 mb-8 text-sm">
              Enter your email to receive a password reset link
            </p>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="peer w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder=" "
                />
                <label className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400 peer-focus:text-blue-400 peer-placeholder-shown:text-gray-400">
                  Email Address
                </label>
              </div>

              <button
                type="button"
                onClick={handlePasswordReset}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition"
              >
                Send Reset Link
              </button>

              {message && (
                <p className={`text-center text-sm font-medium ${messageType === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                  setMessage(null);
                }}
                className="w-full text-center text-gray-400 hover:text-blue-400 text-sm transition"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
