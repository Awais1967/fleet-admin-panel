import React, { useMemo, useState } from "react";

export default function DailyAssignmentCard({
  drivers = [],
  vans = [],
  onAssign,
}) {
  const [autoSms, setAutoSms] = useState(true);
  const [date, setDate] = useState("");
  const [driverId, setDriverId] = useState("");
  const [vanId, setVanId] = useState("");

  const canAssign = date && driverId && vanId;

  const driverOptions = useMemo(() => drivers, [drivers]);
  const vanOptions = useMemo(() => vans, [vans]);

  const handleAssign = () => {
    if (!canAssign) return;
    onAssign?.({ date, driverId, vanId, autoSms });
  };

  const driverLabel = (driver) => driver.name || "Unnamed Driver";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">
          Daily Assignment
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-700 select-none">
          <span className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={autoSms}
              onChange={(e) => setAutoSms(e.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
          </span>
          Auto-send SMS
        </label>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Select Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
            />
          </Field>

          <Field label="Driver">
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600 bg-white"
            >
              <option value="">Select Driver</option>
              {driverOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {driverLabel(d)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Van">
            <select
              value={vanId}
              onChange={(e) => setVanId(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600 bg-white"
            >
              <option value="">Select Van</option>
              {vanOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="pt-6">
          <button
            onClick={handleAssign}
            disabled={!canAssign}
            className="h-10 rounded-md bg-teal-600 text-white text-sm font-medium px-5 hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600"
          >
            Assign Driver to Van
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
