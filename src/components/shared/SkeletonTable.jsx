import React from "react";
import Skeleton from "./Skeleton";

export default function SkeletonTable({ rows = 8 }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
