import React, { useEffect, useState } from "react";
import AiResultPill from "../inspections/AiResultPill";
import Pagination from "../shared/Pagination";

const PRIMARY = "#0A8F86";

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
    </div>
  );
}

export default function DriverInspectionHistoryTable({
  loading = false,
  rows = [],
  onViewDetail,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setPage(1);
    });
    return () => {
      cancelled = true;
    };
  }, [rows]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = rows.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize,
  );

  return (
    <div className="rounded-[10px] bg-white border border-slate-100 shadow-sm p-5">
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-212.5 w-full">
              <thead>
                <tr className="text-left text-[12px] font-semibold text-slate-700">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Van</th>
                  <th className="py-3 pr-4">Photos</th>
                  <th className="py-3 pr-4">Submission Time</th>
                  <th className="py-3 pr-4">AI Result</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody className="text-[12px] text-slate-600">
                {pageRows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="py-4 pr-4">{r.date}</td>
                    <td className="py-4 pr-4">{r.van}</td>
                    <td className="py-4 pr-4">{r.photos}</td>
                    <td className="py-4 pr-4">{r.submissionTime}</td>
                    <td className="py-4 pr-4">
                      <AiResultPill value={r.aiResult} />
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => onViewDetail?.(r)}
                        className="h-8 rounded-md px-4 text-[11px] font-semibold text-white"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      No inspection history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {total > pageSize ? (
            <div className="mt-3">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
