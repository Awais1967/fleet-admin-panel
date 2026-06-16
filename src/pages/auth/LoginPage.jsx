import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const nextPath = loc.state?.from || "/overview";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ email, password });
      nav(nextPath, { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-115 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="text-lg font-semibold text-slate-900">
            Admin Login
          </div>
          <div className="text-sm text-slate-600 mt-1">Sign in to continue</div>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-6 space-y-4">
          {err ? (
            <div className="rounded-md bg-rose-50 text-rose-700 text-sm px-4 py-3">
              {err}
            </div>
          ) : null}

          <div>
            <div className="text-sm font-medium text-slate-800 mb-2">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-slate-800 mb-2">
              Password
            </div>
            <div className="relative">
              <input
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 pr-10 text-sm outline-none focus:border-teal-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="h-10 w-full rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
