import React from "react";

export default function IconButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`h-10 w-10 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
