import React from "react";

export default function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  rightIcon,
}) {
  return (
    <div className="w-full">
      {label ? (
        <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      ) : null}
      <div className="relative">
        <input
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-slate-200 px-3 pr-10 text-sm outline-none focus:border-teal-600 bg-white"
        />
        {rightIcon ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
