import React, { useEffect, useRef } from "react";

export default function VansFiltersPopover({
  open,
  onClose,
  values,
  onChange,
  onApply,
  onClear,
  anchorRef,
}) {
  const popRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onDocDown = (e) => {
      const pop = popRef.current;
      const anchor = anchorRef?.current;
      if (!pop) return;

      if (pop.contains(e.target)) return;
      if (anchor && anchor.contains(e.target)) return;
      onClose?.();
    };

    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={popRef}
      className="absolute right-0 top-13 z-50 w-90 rounded-xl bg-white shadow-xl border border-slate-100 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-slate-100 bg-white">
        <div className="text-[18px] font-semibold text-slate-900">Filter</div>
      </div>

      <div className="p-5 space-y-4">
        <Field label="Van Number">
          <input
            value={values.vanNumber || ""}
            onChange={(e) => onChange({ ...values, vanNumber: e.target.value })}
            placeholder="Search"
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
          />
        </Field>

        <Field label="VIN">
          <input
            value={values.vin || ""}
            onChange={(e) => onChange({ ...values, vin: e.target.value })}
            placeholder="Search"
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
          />
        </Field>

        <Field label="Assigned Driver">
          <input
            value={values.assignedDriver || ""}
            onChange={(e) =>
              onChange({ ...values, assignedDriver: e.target.value })
            }
            placeholder="Search"
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
          />
        </Field>

        <div className="flex gap-4 pt-2">
          <button
            onClick={onApply}
            className="h-10 flex-1 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
          >
            Apply
          </button>
          <button
            onClick={onClear}
            className="h-10 flex-1 rounded-md border border-teal-600 text-teal-700 text-sm font-medium hover:bg-teal-50"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-800 mb-2">{label}</div>
      {children}
    </div>
  );
}
