import React from "react";

export default function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();

  const map = {
    "in progress": "bg-amber-50 text-amber-700",
    completed: "bg-emerald-50 text-emerald-700",
    "not started": "bg-blue-50 text-blue-700",
    clear: "bg-emerald-50 text-emerald-700",
    damage: "bg-rose-50 text-rose-700",
    active: "bg-emerald-50 text-emerald-700",
    disable: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${map[v] || "bg-slate-50 text-slate-700"}`}
    >
      {value}
    </span>
  );
}
