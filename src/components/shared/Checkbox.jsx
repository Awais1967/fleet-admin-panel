import React from "react";

export default function Checkbox({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
      />
      {label ? <span className="text-sm text-slate-700">{label}</span> : null}
    </label>
  );
}
