import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const PRIMARY = "#0A8F86";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-[12px]">
      <div className="text-slate-600 font-medium">{label}</div>
      <div className="text-slate-500">{value}</div>
    </div>
  );
}

export default function DamageAlertCard({ alert, onViewDetail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm px-4 py-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <FiAlertTriangle className="text-red-500 text-[15px]" />
        <div className="text-[12px] font-semibold text-red-500">
          {alert?.title || "Damage Alert"}
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2">
        <Row label="Van Number" value={alert?.vanNumber || "-"} />
        <Row label="Driver" value={alert?.driver || "-"} />
        <Row label="Damage Detected" value={alert?.damageDetected || "-"} />
        <Row label="AI Finding" value={alert?.aiFinding || "-"} />
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onViewDetail}
        className="mt-4 h-9 w-full rounded-md text-[12px] font-semibold text-white"
        style={{ backgroundColor: PRIMARY }}
      >
        View Detail
      </button>
    </div>
  );
}
