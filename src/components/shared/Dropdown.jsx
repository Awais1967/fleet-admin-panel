import React, { useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => String(o.value) === String(value));
    return found?.label || "";
  }, [options, value]);

  return (
    <div className={`relative ${className}`}>
      {label ? (
        <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm bg-white flex items-center justify-between"
      >
        <span className={selectedLabel ? "text-slate-700" : "text-slate-400"}>
          {selectedLabel || placeholder}
        </span>
        <FiChevronDown className="text-slate-400" />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-app shadow-lg overflow-hidden">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange?.(o.value);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
