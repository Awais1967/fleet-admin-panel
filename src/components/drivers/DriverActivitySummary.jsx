import React from "react";

function MetricCard({ title, subtitle, value, loading }) {
  return (
    <div className="rounded-[10px] bg-white border border-slate-100 shadow-sm p-5">
      <div className="text-[12px] font-semibold text-slate-700">{title}</div>
      {subtitle ? (
        <div className="mt-1 text-[10px] text-slate-500">{subtitle}</div>
      ) : null}

      <div className="mt-3 text-[18px] font-semibold text-slate-800">
        {loading ? (
          <div className="h-6 w-20 rounded bg-slate-100 animate-pulse" />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export default function DriverActivitySummary({ loading, data }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        loading={loading}
        title="Total Inspections"
        subtitle="Lifetime submissions"
        value={data?.totalInspections ?? "-"}
      />
      <MetricCard
        loading={loading}
        title="Inspections (This Month)"
        subtitle="Recent activity"
        value={data?.inspectionsThisMonth ?? "-"}
      />
      <MetricCard
        loading={loading}
        title="Damage Rate"
        subtitle="AI-detected"
        value={data?.damageRate ?? "-"}
      />

      <MetricCard
        loading={loading}
        title="Avg Completion Time"
        subtitle="Per inspection"
        value={data?.avgCompletionTime ?? "-"}
      />
      <MetricCard
        loading={loading}
        title="Missed Assignments (This Month)"
        subtitle="Recent activity"
        value={data?.missedAssignmentsThisMonth ?? "-"}
      />
      <MetricCard
        loading={loading}
        title="Success Rate"
        subtitle="AI-detected"
        value={data?.successRate ?? "-"}
      />
    </div>
  );
}
