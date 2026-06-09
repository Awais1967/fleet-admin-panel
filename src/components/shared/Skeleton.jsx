import React from "react";

export default function Skeleton({ className = "h-4 w-full" }) {
  return <div className={`animate-pulse rounded bg-slate-100 ${className}`} />;
}
