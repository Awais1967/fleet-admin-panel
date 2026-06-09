import React from "react";
import SkeletonTable from "./SkeletonTable";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

export default function DataTable({
  title,
  columns = [],
  rows = [],
  loading = false,
  emptyText = "No records found.",
  rightSlot,
  pagination,
  sentinelRef, // optional for lazy loading hook
  hasMore = false, // optional
}) {
  return (
    <div className="bg-white rounded-xl border border-app shadow-sm overflow-hidden">
      {title ? (
        <div className="px-6 py-4 border-b border-app flex items-center">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="ml-auto">{rightSlot}</div>
        </div>
      ) : null}

      <div className="px-6 py-4">
        {loading ? (
          <SkeletonTable />
        ) : rows.length === 0 ? (
          <EmptyState title={emptyText} />
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-180 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className={`py-3 font-medium ${c.thClassName || ""}`}
                    >
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={r.id || idx} className="border-t border-app">
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`py-4 text-slate-700 ${c.tdClassName || ""}`}
                      >
                        {c.render ? c.render(r) : r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* lazy loading sentinel */}
            {sentinelRef ? <div ref={sentinelRef} className="h-8" /> : null}

            {hasMore ? (
              <div className="py-3 text-xs text-slate-500">Loading more…</div>
            ) : null}
          </div>
        )}

        {pagination ? (
          <div className="pt-4">
            <Pagination {...pagination} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
