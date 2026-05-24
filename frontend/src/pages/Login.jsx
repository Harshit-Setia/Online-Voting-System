import {
  ArrowRight,
  Lock,
  Mail,
  Vote
} from "lucide-react";
import { useState, useEffect, useContext } from "react";

import { Link, useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);



  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use AuthContext login to handle authentication and navigation
      await login(formData);
      // After successful login, redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white overflow-hidden relative flex items-center justify-center px-6 py-10">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* AMBIENT LIGHT */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full"></div>

      {/* MAIN */}
      <div className="relative z-10 w-full flex items-center justify-center">

        <div className="relative w-full max-w-xl">

          {/* CARD */}
          <div className="relative p-8 md:p-10 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl">

            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center">
                <Vote size={34} className="text-black" />
              </div>
            </div>

            {/* HEADING */}
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold tracking-tight">
                Welcome Back
              </h1>
              <p className="text-zinc-500 mt-4 text-lg">
                Login to VoteGuard securely
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {success}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* EMAIL */}
              <div>
                <label className="text-sm text-zinc-300 mb-3 block">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value
                      })
                    }
                    className="w-full h-16 rounded-2xl bg-[#111111] border border-white/10 pl-14 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-zinc-300 mb-3 block">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value
                      })
                    }
                    className="w-full h-16 rounded-2xl bg-[#111111] border border-white/10 pl-14 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all"
                  />
                </div>

                <div className="text-right mt-3">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full h-16 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Signing In..." : "Sign In"}

                {!loading && (
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </form>

            {/* FOOTER */}
            <p className="mt-8 text-center text-zinc-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-white hover:text-zinc-300 transition-colors font-medium"
              >
                Create Account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;