import React from "react";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

function cfg(value) {
  const v = String(value || "")
    .trim()
    .toLowerCase();

  if (v === "clear") {
    return {
      bg: "bg-green-50",
      text: "text-green-600",
      icon: <FiCheckCircle className="text-[12px]" />,
      ring: "ring-green-100",
    };
  }
  if (v === "damage") {
    return {
      bg: "bg-red-50",
      text: "text-red-600",
      icon: <FiAlertTriangle className="text-[12px]" />,
      ring: "ring-red-100",
    };
  }
  return {
    bg: "bg-slate-50",
    text: "text-slate-500",
    icon: null,
    ring: "ring-slate-100",
  };
}

export default function AiResultPill({ value }) {
  if (!value || value === "-") return <span className="text-slate-400">-</span>;
  const c = cfg(value);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${c.bg} ${c.text} ring-1 ${c.ring}`}
    >
      {c.icon}
      {value}
    </span>
  );
}
