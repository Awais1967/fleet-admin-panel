import React from "react";

function cfg(status) {
  const s = String(status || "")
    .trim()
    .toLowerCase();

  if (s === "in progress") {
    return {
      bg: "bg-orange-50",
      text: "text-orange-600",
      dot: "bg-orange-500",
    };
  }
  if (s === "completed") {
    return { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" };
  }
  if (s === "not started") {
    return { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" };
  }
  return { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400" };
}

export default function InspectionStatusPill({ value }) {
  if (!value || value === "-") return <span className="text-slate-400">-</span>;
  const c = cfg(value);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${c.bg} ${c.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {value}
    </span>
  );
}
