import React from "react";

export default function AnalyticsFiltersRow({
  date,
  onDate,
  driver,
  onDriver,
  van,
  onVan,
  drivers = [],
  vans = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field label="Date Range">
          <input
            type="date"
            value={date || ""}
            onChange={(e) => onDate?.(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
          />
        </Field>

        <Field label="Driver">
          <select
            value={driver || ""}
            onChange={(e) => onDriver?.(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600 bg-white"
          >
            <option value="">All Drivers</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Van">
          <select
            value={van || ""}
            onChange={(e) => onVan?.(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600 bg-white"
          >
            <option value="">All Vans</option>
            {vans.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
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
