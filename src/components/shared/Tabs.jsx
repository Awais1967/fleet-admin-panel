import React from "react";

export default function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-app shadow-sm px-4 py-2 inline-flex gap-2">
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            onClick={() => onChange?.(t.value)}
            className={`h-9 px-4 rounded-md text-sm font-medium transition ${
              isActive
                ? "bg-teal-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
