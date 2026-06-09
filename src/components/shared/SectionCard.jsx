import React from "react";
import Card from "./Card";

export default function SectionCard({ title, right, children }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-app flex items-center">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="ml-auto">{right}</div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </Card>
  );
}
