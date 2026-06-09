import React from "react";
import Card from "./Card";

export default function ChartCard({ title, children, className = "" }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-app">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </Card>
  );
}
