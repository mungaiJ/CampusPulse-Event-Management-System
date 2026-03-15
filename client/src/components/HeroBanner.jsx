import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  const words = ["Connect.", "Explore.", "Experience."];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-linear-to-br from-gray-900 via-gray-950 to-black text-white">
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-32 right-1/3 w-72 h-72 bg-pink-500 opacity-20 blur-2xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-400 opacity-20 blur-2xl rounded-full animate-pulse"></div>
      {/* Floating activity SVGs */}
      <svg
        className="absolute top-20 left-10 w-9 h-9 text-blue-400 opacity-60 animate-bounce-slow"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 2H5c-1.1 0-2 .9-2 2v16l7-3 7 3V4c0-1.1-.9-2-2-2z" />
      </svg>{" "}
      {/* book */}
      <svg
        className="absolute top-1/3 right-16 w-9 h-9 text-purple-400 opacity-60 animate-bounce-slow"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
      </svg>{" "}
      {/* music */}
      <svg
        className="absolute bottom-40 left-1/3 w-9 h-9 text-green-400 opacity-60 animate-bounce-slow"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M16.5 12c0 1.38-1.12 2.5-2.5 2.5S11.5 13.38 11.5 12 12.62 9.5 14 9.5s2.5 1.12 2.5 2.5z" />
      </svg>{" "}
      {/* football */}
      <svg
        className="absolute bottom-32 right-10 w-9 h-9 text-yellow-400 opacity-60 animate-bounce-slow"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
      </svg>{" "}
      {/* coffee */}
      <div className="relative z-10 max-w-3xl">
        {/* Animated headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-300 to-indigo-500 drop-shadow-lg">
          {words[currentWord]}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          All your campus events in one place. Discover activities, connect with
          peers, and make every moment count.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-xl font-semibold backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 transition"
          >
            Join the Community
          </Link>

          <Link
            to="/login"
            className="px-8 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 transition"
          >
            Login
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-12 text-gray-300 text-sm md:text-base">
          <div className="flex flex-col items-center hover:text-white transition">
            <span className="text-2xl font-bold text-white">500+</span>
            Events This Semester
          </div>
          <div className="flex flex-col items-center hover:text-white transition">
            <span className="text-2xl font-bold text-white">2000+</span>
            Students Connected
          </div>
          <div className="flex flex-col items-center hover:text-white transition">
            <span className="text-2xl font-bold text-white">50+</span>
            Clubs & Societies
          </div>
        </div>
      </div>
    </section>
  );
}
