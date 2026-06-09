import React from "react";
import DateField from "./DateField";

export default function DateRangeField({ label, start, end, onStart, onEnd }) {
  return (
    <div className="w-full">
      {label ? (
        <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DateField label="From" value={start} onChange={onStart} />
        <DateField label="To" value={end} onChange={onEnd} />
      </div>
    </div>
  );
}
