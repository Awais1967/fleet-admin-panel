import React, { useEffect, useState } from "react";
import * as settingsService from "../../services/settings.service";

export default function DataRetentionCard() {
  const [period, setPeriod] = useState("60");
  const [autoDelete, setAutoDelete] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    settingsService
      .getRetention()
      .then((settings) => {
        if (cancelled) return;
        setPeriod(String(settings.periodDays || 60));
        setAutoDelete(Boolean(settings.autoDelete));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const save = (next) => {
    settingsService.saveRetention({
      periodDays: Number(next.period ?? period),
      autoDelete: next.autoDelete ?? autoDelete,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">
          Data Retention
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Retention Period">
            <select
              value={period}
              disabled={loading}
              onChange={(e) => {
                setPeriod(e.target.value);
                save({ period: e.target.value });
              }}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600 bg-white"
            >
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
            </select>
          </Field>

          <div>
            <div className="text-sm font-medium text-slate-800 mb-2">
              Auto Delete
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-700 select-none pt-2">
              <input
                type="checkbox"
                checked={autoDelete}
                disabled={loading}
                onChange={(e) => {
                  setAutoDelete(e.target.checked);
                  save({ autoDelete: e.target.checked });
                }}
                className="h-4 w-4 accent-teal-600"
              />
              Enable automatic deletion
            </label>
          </div>
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
