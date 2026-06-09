import React, { useMemo, useRef, useState, useEffect } from "react";
import { FiPlus, FiSearch, FiSliders } from "react-icons/fi";
import DriversFiltersPopover from "./DriversFiltersPopover";
import Pagination from "../shared/Pagination";

const PRIMARY = "#0A8F86";

function Shell({ children }) {
  return (
    <div className="rounded-[10px] bg-white shadow-sm border border-slate-100">
      {children}
    </div>
  );
}

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();
  const isActive = v === "active";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${
        isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
      />
      {value}
    </span>
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

export default function DriversTable({
  title = "All Drivers",
  loading,
  rows,
  onAddNew,
  onViewDetail,
  onEdit,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [q, setQ] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ name: "", status: "" });
  const filterBtnRef = useRef(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = rows || [];

    return list.filter((r) => {
      const okQ =
        !query ||
        String(r.name || "")
          .toLowerCase()
          .includes(query) ||
        String(r.mobile || "")
          .toLowerCase()
          .includes(query);

      const okName =
        !filters.name ||
        String(r.name || "")
          .toLowerCase()
          .includes(filters.name.toLowerCase());

      const okStatus =
        !filters.status || String(r.status || "") === filters.status;

      return okQ && okName && okStatus;
    });
  }, [rows, q, filters]);

  // reset page when filters/search/rows change
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
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const onApply = () => setFiltersOpen(false);
  const onClear = () => {
    setFilters({ name: "", status: "" });
    setFiltersOpen(false);
  };

  return (
    <Shell>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="text-[14px] font-semibold text-slate-800">{title}</div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-[320px]">
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

            <DriversFiltersPopover
              open={filtersOpen}
              anchorRef={filterBtnRef}
              values={filters}
              onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
              onApply={onApply}
              onClear={onClear}
              onClose={() => setFiltersOpen(false)}
            />
          </div>

          {/* Add new */}
          <button
            type="button"
            onClick={onAddNew}
            className="h-9 rounded-md px-4 text-[12px] font-semibold text-white inline-flex items-center gap-2"
            style={{ backgroundColor: PRIMARY }}
          >
            <FiPlus />
            Add New Driver
          </button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="min-w-225 w-full">
              <thead>
                <tr className="text-left text-[12px] font-semibold text-slate-700">
                  <th className="py-4 pr-4">Driver Name</th>
                  <th className="py-4 pr-4">Mobile Number</th>
                  <th className="py-4 pr-4">Total Inspections</th>
                  <th className="py-4 pr-4">Last Active</th>
                  <th className="py-4 pr-4">Status</th>
                  <th className="py-4">Action</th>
                </tr>
              </thead>

              <tbody className="text-[12px] text-slate-600">
                {pageRows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="py-4 pr-4">{r.name}</td>
                    <td className="py-4 pr-4">{r.mobile}</td>
                    <td className="py-4 pr-4">{r.totalInspections}</td>
                    <td className="py-4 pr-4">{r.lastActive}</td>
                    <td className="py-4 pr-4">
                      <StatusPill value={r.status} />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onViewDetail?.(r)}
                          className="h-8 rounded-md px-4 text-[11px] font-semibold text-white"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          View Detail
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit?.(r)}
                          className="h-8 rounded-md px-4 text-[11px] font-semibold border"
                          style={{ borderColor: PRIMARY, color: PRIMARY }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      No drivers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {total > pageSize ? (
            <div className="mt-4">
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
