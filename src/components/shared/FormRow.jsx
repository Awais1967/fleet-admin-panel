import React from "react";

export default function FormRow({ label, children }) {
  return (
    <div>
      {label ? (
        <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      ) : null}
      {children}
    </div>
  );
}
