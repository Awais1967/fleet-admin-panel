import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyCodePage() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    // demo only
    setTimeout(() => {
      setLoading(false);
      nav("/login", { replace: true });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-115 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="text-lg font-semibold text-slate-900">
            Verify Code
          </div>
          <div className="text-sm text-slate-600 mt-1">Enter the OTP code</div>
        </div>

        <form onSubmit={onVerify} className="px-6 py-6 space-y-4">
          <div>
            <div className="text-sm font-medium text-slate-800 mb-2">
              OTP Code
            </div>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <button
            disabled={!code.trim() || loading}
            className="h-10 w-full rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            onClick={() => nav("/login")}
            className="w-full text-sm text-slate-600 hover:underline"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
