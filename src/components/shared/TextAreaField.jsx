import React from "react";

export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <div className="w-full">
      {label ? (
        <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      ) : null}
      <textarea
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="min-h-22.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 bg-white"
      />
    </div>
  );
}
