import React from "react";

export default function FiltersBar({ children }) {
  return (
    <div className="bg-white rounded-xl border border-app shadow-sm px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}
