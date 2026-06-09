import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-app shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
