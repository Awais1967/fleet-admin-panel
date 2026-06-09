import React from "react";

export default function EmptyState({ title = "No data", subtitle }) {
  return (
    <div className="py-10 text-center">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {subtitle ? (
        <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
      ) : null}
    </div>
  );
}
