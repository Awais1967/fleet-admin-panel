import React from "react";

export default function SelectField({ label, value, onChange, options = [] }) {
  return (
    <div className="w-full">
      {label ? (
        <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      ) : null}
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm bg-white focus:border-teal-600"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
