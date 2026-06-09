import React from "react";

export default function Badge({ children, tone = "default" }) {
  const map = {
    default: "bg-slate-50 text-slate-700",
    teal: "bg-teal-50 text-teal-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${map[tone] || map.default}`}
    >
      {children}
    </span>
  );
}
