import React from "react";

export default function PageHeader({ title, right }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-xl font-semibold text-slate-900">{title}</div>
      <div className="ml-auto">{right}</div>
    </div>
  );
}
