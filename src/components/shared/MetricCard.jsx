import React from "react";
import Card from "./Card";

export default function MetricCard({ icon, label, value, tone = "default" }) {
  const bg = tone === "muted" ? "bg-slate-50" : "bg-teal-50";

  return (
    <Card className={`px-6 py-5 ${bg}`}>
      <div className="h-10 w-10 rounded-full bg-white border border-app flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-3 text-xs text-slate-600">{label}</div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
    </Card>
  );
}
