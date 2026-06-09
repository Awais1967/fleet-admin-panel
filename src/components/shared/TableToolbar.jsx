import React from "react";

export default function TableToolbar({ left, right }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">{left}</div>
      <div className="ml-auto">{right}</div>
    </div>
  );
}
