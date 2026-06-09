import React from "react";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[12px]">
      <div className="text-slate-600 font-medium">{label}</div>
      <div className="text-slate-700">{value}</div>
    </div>
  );
}

export default function DriverCurrentAssignment({ assignment }) {
  const a = assignment || {};

  return (
    <div className="rounded-[10px] bg-white border border-slate-100 shadow-sm p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <Row label="Assigned Van" value={a?.van || "-"} />
          <Row label="VIN" value={a?.vin || "-"} />
        </div>

        <div className="space-y-3">
          <Row label="Assignment Time" value={a?.assignmentTime || "-"} />
          <Row label="Inspection Status" value={a?.inspectionStatus || "-"} />
        </div>
      </div>
    </div>
  );
}
