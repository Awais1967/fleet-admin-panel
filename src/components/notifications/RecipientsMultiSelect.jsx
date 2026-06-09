import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function RecipientsMultiSelect({
  value = [],
  onChange,
  options = [],
  placeholder = "All Driver",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onDoc = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const allIds = useMemo(() => options.map((o) => o.id), [options]);

  const isAll = value.length === 0 || value.length === allIds.length;

  const displayText = isAll ? placeholder : `${value.length} selected`;

  const toggleId = (id) => {
    let next;
    if (value.includes(id)) next = value.filter((x) => x !== id);
    else next = [...value, id];

    // if none selected => treat as All
    if (next.length === 0) next = [];
    onChange?.(next);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-700 bg-white flex items-center justify-between"
      >
        <span>{displayText}</span>
        <FiChevronDown className="text-slate-500" />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-50 w-full rounded-lg border border-slate-100 bg-white shadow-xl overflow-hidden">
          <div className="max-h-55 overflow-auto py-2">
            {options.map((o) => (
              <label
                key={o.id}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={isAll ? true : value.includes(o.id)}
                  onChange={() => toggleId(o.id)}
                  className="h-4 w-4 accent-teal-600"
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
