import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const PRIMARY = "#0A8F86";

function Label({ children }) {
  return (
    <div className="text-[12px] font-semibold text-slate-700 mb-2">
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none focus:border-slate-300"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-10 text-[12px] text-slate-700 outline-none focus:border-slate-300"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[14px]" />
    </div>
  );
}

export default function DriversFiltersPopover({
  open,
  anchorRef,
  values,
  onChange,
  onApply,
  onClear,
  onClose,
}) {
  const popRef = useRef(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    const updatePos = () => {
      const rect = anchorRef?.current?.getBoundingClientRect?.();
      if (!rect) {
        setPos({ top: 0, left: 0 });
        return;
      }
      setPos({
        top: rect.bottom + 10 + window.scrollY,
        left: rect.right - 320 + window.scrollX,
      });
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [anchorRef, open]);

  useEffect(() => {
    if (!open) return;

    const onDoc = (e) => {
      const p = popRef.current;
      const a = anchorRef?.current;
      if (!p) return;
      if (p.contains(e.target)) return;
      if (a && a.contains(e.target)) return;
      onClose?.();
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  return (
    <div
      ref={popRef}
      className="fixed z-60 w-[320px] rounded-[10px] bg-white shadow-xl border border-slate-100"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="px-5 py-4">
        <div className="text-[14px] font-semibold text-slate-800">Filter</div>

        <div className="mt-4 space-y-4">
          <div>
            <Label>Name</Label>
            <TextInput
              value={values?.name || ""}
              onChange={(v) => onChange?.("name", v)}
              placeholder="Search Name"
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={values?.status || ""}
              onChange={(v) => onChange?.("status", v)}
              options={[
                { value: "", label: "Select" },
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onApply}
              className="h-9 flex-1 rounded-md text-[12px] font-semibold text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Apply
            </button>

            <button
              type="button"
              onClick={onClear}
              className="h-9 flex-1 rounded-md border text-[12px] font-semibold"
              style={{ borderColor: PRIMARY, color: PRIMARY }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
