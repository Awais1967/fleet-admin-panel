import React from "react";

const PRIMARY = "#0A8F86";

const tabs = [
  { key: "summary", label: "Driver Activity Summary" },
  { key: "assignment", label: "Current Assignment" },
  { key: "history", label: "Inspection History" },
];

export default function DriverTabs({ value, onChange }) {
  return (
    <div className="px-6 pt-4 border-b border-slate-200">
      <div className="flex items-center gap-8">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange?.(t.key)}
              className={`relative pb-3 text-[12px] font-semibold ${
                active ? "text-slate-800" : "text-slate-600"
              }`}
            >
              {t.label}
              {active ? (
                <span
                  className="absolute left-0 -bottom-px h-0.5 w-full rounded"
                  style={{ backgroundColor: PRIMARY }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
