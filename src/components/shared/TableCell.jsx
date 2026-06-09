import React from "react";

export default function TableCell({ children, className = "" }) {
  return (
    <td className={`py-4 text-sm text-slate-700 ${className}`}>{children}</td>
  );
}
