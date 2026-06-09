import React, { useEffect, useState } from "react";
import * as settingsService from "../../services/settings.service";

export default function SystemSettingsCard() {
  const [aiDetect, setAiDetect] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    settingsService
      .getSystemSettings()
      .then((settings) => {
        if (cancelled) return;
        setAiDetect(Boolean(settings.aiDetect));
        setSmsNotif(Boolean(settings.smsNotif));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const save = (next) => {
    settingsService.saveSystemSettings({
      aiDetect: next.aiDetect ?? aiDetect,
      smsNotif: next.smsNotif ?? smsNotif,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">
          System Settings
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-4">
              AI Detection
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={aiDetect}
                disabled={loading}
                onChange={(e) => {
                  setAiDetect(e.target.checked);
                  save({ aiDetect: e.target.checked });
                }}
                className="h-4 w-4 accent-teal-600"
              />
              Enable AI damage detection
            </label>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 mb-4">
              SMS Configuration
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={smsNotif}
                disabled={loading}
                onChange={(e) => {
                  setSmsNotif(e.target.checked);
                  save({ smsNotif: e.target.checked });
                }}
                className="h-4 w-4 accent-teal-600"
              />
              Enable SMS notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
