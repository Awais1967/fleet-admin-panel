import React from "react";
import { FiCalendar } from "react-icons/fi";

export default function DateField({
  label,
  value,
  onChange,
  placeholder = "mm/dd/yyyy",
}) {
  return (
    <div className="w-full">
      {label ? (
        <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      ) : null}
      <div className="relative">
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 px-3 pr-10 text-sm outline-none focus:border-teal-600 bg-white"
          placeholder={placeholder}
        />
        <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
