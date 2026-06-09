import React from "react";
import DamageAlertCard from "./DamageAlertCard";

const PRIMARY = "#0A8F86";

function CardShell({ children }) {
  return (
    <div className="rounded-[10px] bg-white shadow-sm border border-slate-100">
      {children}
    </div>
  );
}

function AlertsSkeleton() {
  return (
    <div className="px-5 pb-5">
      <div className="h-42.5 w-full rounded-lg border border-slate-200 bg-slate-50 animate-pulse" />
      <div className="mt-4 h-42.5 w-full rounded-lg border border-slate-200 bg-slate-50 animate-pulse" />
    </div>
  );
}

export default function DamageAlertsPanel({
  loading,
  alerts,
  onViewAll,
  onViewDetail,
}) {
  return (
    <CardShell>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="text-[14px] font-semibold text-slate-800">
          Damage Alerts
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="h-9 rounded-md px-4 text-[12px] font-semibold text-white"
          style={{ backgroundColor: PRIMARY }}
        >
          View All
        </button>
      </div>

      {loading ? (
        <AlertsSkeleton />
      ) : (
        <div className="px-5 pb-5">
          <div className="flex flex-col gap-4">
            {(alerts || []).map((a) => (
              <DamageAlertCard
                key={a.id}
                alert={a}
                onViewDetail={() => onViewDetail?.(a)}
              />
            ))}

            {(!alerts || alerts.length === 0) && (
              <div className="py-10 text-center text-[12px] text-slate-400">
                No damage alerts found.
              </div>
            )}
          </div>
        </div>
      )}
    </CardShell>
  );
}
