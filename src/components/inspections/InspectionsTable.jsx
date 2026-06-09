import React, { useMemo, useRef, useState, useEffect } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import InspectionStatusPill from "./InspectionStatusPill";
import AiResultPill from "./AiResultPill";
import InspectionsFiltersPopover from "./InspectionsFiltersPopover";
import Pagination from "../shared/Pagination";

const PRIMARY = "#0A8F86";

function Shell({ children }) {
  return (
    <div className="rounded-[10px] bg-white shadow-sm border border-slate-100">
      {children}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="px-6 pb-6">
      <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
    </div>
  );
}

/**
 * Props designed for lazy loading:
 * - rows: array
 * - loading: boolean (initial)
 * - isLoadingMore: boolean
 * - onLoadMore: fn (optional)
 * - hasMore: boolean (optional)
 * - onViewDetail(row)
 */
export default function InspectionsTable({
  title = "All Inspections",
  loading,
  rows,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore = () => {},
  onViewDetail = () => {},
}) {
  const [q, setQ] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    date: "",
    driver: "",
    van: "",
    ai: "",
  });
  const filterBtnRef = useRef(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = rows || [];

    return list.filter((r) => {
      const okQ =
        !query ||
        String(r.driverName || "")
          .toLowerCase()
          .includes(query) ||
        String(r.vanNumber || "")
          .toLowerCase()
          .includes(query);

      const okDriver =
        !filters.driver ||
        String(r.driverName || "")
          .toLowerCase()
          .includes(filters.driver.toLowerCase());

      const okVan =
        !filters.van ||
        String(r.vanNumber || "")
          .toLowerCase()
          .includes(filters.van.toLowerCase());

      const okAi = !filters.ai || String(r.aiStatus || "") === filters.ai;

      // date is UI-only placeholder; apply if your API returns date
      const okDate = true;

      return okQ && okDriver && okVan && okAi && okDate;
    });
  }, [rows, q, filters]);

  // pagination
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
  }, [q, filters, rows]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = filtered.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize,
  );

  const onApply = () => setFiltersOpen(false);
  const onClear = () => {
    setFilters({ date: "", driver: "", van: "", ai: "" });
    setFiltersOpen(false);
  };

  return (
    <Shell>
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="text-[14px] font-semibold text-slate-800">{title}</div>

        <div className="relative w-90">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-10 text-[12px] text-slate-700 outline-none focus:border-slate-300"
          />
          <button
            ref={filterBtnRef}
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white"
            aria-label="Open filters"
            title="Filter"
          >
            <FiSliders className="text-slate-500 text-[13px]" />
          </button>

          <InspectionsFiltersPopover
            open={filtersOpen}
            anchorRef={filterBtnRef}
            values={filters}
            onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
            onApply={onApply}
            onClear={onClear}
            onClose={() => setFiltersOpen(false)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="min-w-225 w-full">
              <thead>
                <tr className="text-left text-[12px] font-semibold text-slate-700">
                  <th className="py-4 pr-4">Driver Name</th>
                  <th className="py-4 pr-4">Van Number</th>
                  <th className="py-4 pr-4">Assign Time</th>
                  <th className="py-4 pr-4">Status</th>
                  <th className="py-4 pr-4">Submit Time</th>
                  <th className="py-4 pr-4">AI Status</th>
                  <th className="py-4">Action</th>
                </tr>
              </thead>

              <tbody className="text-[12px] text-slate-600">
                {pageRows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="py-4 pr-4">{r.driverName}</td>
                    <td className="py-4 pr-4">{r.vanNumber}</td>
                    <td className="py-4 pr-4">{r.assignTime}</td>
                    <td className="py-4 pr-4">
                      <InspectionStatusPill value={r.status} />
                    </td>
                    <td className="py-4 pr-4">{r.submitTime}</td>
                    <td className="py-4 pr-4">
                      <AiResultPill value={r.aiStatus} />
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

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-slate-400"
                    >
                      No inspections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="h-9 rounded-md px-5 text-[12px] font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: PRIMARY }}
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          ) : total > pageSize ? (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </div>
          ) : null}
        </div>
      )}
    </Shell>
  );
}
