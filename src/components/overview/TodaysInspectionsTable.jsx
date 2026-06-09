import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiSliders,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import Pagination from "../shared/Pagination";
import OverviewFiltersPopover from "./OverviewFiltersPopover";

const PRIMARY = "#0A8F86";

function CardShell({ children }) {
  return (
    <div className="rounded-[10px] bg-white shadow-sm border border-slate-100">
      {children}
    </div>
  );
}

function Pill({ type, text }) {
  const cfg = (() => {
    // status pills (match screenshot colors)
    if (type === "In Progress")
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        dot: "bg-orange-500",
      };
    if (type === "Completed")
      return { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" };
    if (type === "Not Started")
      return { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" };
    if (type === "Damage")
      return {
        bg: "bg-red-50",
        text: "text-red-600",
        icon: <FiAlertTriangle className="text-red-500" />,
      };
    if (type === "Clear")
      return {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: <FiCheckCircle className="text-green-500" />,
      };
    return { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400" };
  })();

  if (text === "-" || !text) return <span className="text-slate-400">-</span>;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}
    >
      {cfg.icon ? (
        <span className="text-[14px]">{cfg.icon}</span>
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      )}
      {text}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="px-5 pb-5">
      <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
      <div className="mt-3 h-8 w-full rounded bg-slate-100 animate-pulse" />
    </div>
  );
}

export default function TodaysInspectionsTable({ loading, rows, onViewAll }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const filterButtonRef = useRef(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let result = rows || [];

    // Apply search query
    if (q.trim()) {
      const query = q.trim().toLowerCase();
      result = result.filter((r) => {
        return (
          String(r.driverName || "")
            .toLowerCase()
            .includes(query) ||
          String(r.van || "")
            .toLowerCase()
            .includes(query) ||
          String(r.status || "")
            .toLowerCase()
            .includes(query) ||
          String(r.aiStatus || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    // Apply filter values
    if (filterValues.driverName) {
      const query = filterValues.driverName.trim().toLowerCase();
      result = result.filter((r) =>
        String(r.driverName || "")
          .toLowerCase()
          .includes(query),
      );
    }

    if (filterValues.vanNumber) {
      const query = filterValues.vanNumber.trim().toLowerCase();
      result = result.filter((r) =>
        String(r.van || "")
          .toLowerCase()
          .includes(query),
      );
    }

    if (filterValues.status) {
      result = result.filter((r) => r.status === filterValues.status);
    }

    if (filterValues.aiStatus) {
      result = result.filter((r) => r.aiStatus === filterValues.aiStatus);
    }

    return result;
  }, [rows, q, filterValues]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setPage(1);
    });
    return () => {
      cancelled = true;
    };
  }, [rows, q]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = filtered.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize,
  );

  return (
    <CardShell>
      {/* Header bar (matches screenshot) */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="text-[14px] font-semibold text-slate-800">
          Today’s Inspection
        </div>

        <div className="flex items-center gap-3">
          {/* Search input (center) */}
          <div className="relative w-65 hidden sm:block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-10 text-[12px] text-slate-700 outline-none focus:border-slate-300"
            />
            <button
              ref={filterButtonRef}
              onClick={() => setPopoverOpen(!popoverOpen)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50"
              aria-label="Filters"
              title="Filters"
            >
              <FiSliders className="text-slate-500 text-[13px]" />
            </button>
          </div>

          {/* View All button */}
          <button
            type="button"
            onClick={onViewAll}
            className="h-9 rounded-md px-4 text-[12px] font-semibold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            View All
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="px-5 pb-5">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-[12px] font-semibold text-slate-700">
                  <th className="py-4 pr-4">Driver Name</th>
                  <th className="py-4 pr-4">Van</th>
                  <th className="py-4 pr-4">Assign Time</th>
                  <th className="py-4 pr-4">Status</th>
                  <th className="py-4 pr-4">Submit Time</th>
                  <th className="py-4">AI Status</th>
                </tr>
              </thead>

              <tbody className="text-[12px] text-slate-600">
                {pageRows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="py-4 pr-4">{r.driverName}</td>
                    <td className="py-4 pr-4">{r.van}</td>
                    <td className="py-4 pr-4">{r.assignTime}</td>
                    <td className="py-4 pr-4">
                      <Pill type={r.status} text={r.status} />
                    </td>
                    <td className="py-4 pr-4">{r.submitTime}</td>
                    <td className="py-4">
                      <Pill type={r.aiStatus} text={r.aiStatus} />
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      No inspections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {total > pageSize ? (
            <div className="mt-4 px-5">
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

      <OverviewFiltersPopover
        open={popoverOpen}
        anchorRef={filterButtonRef}
        values={filterValues}
        onChange={(key, value) =>
          setFilterValues((prev) => ({ ...prev, [key]: value }))
        }
        onApply={() => {
          setPopoverOpen(false);
          setPage(1);
        }}
        onClear={() => {
          setFilterValues({});
          setPage(1);
        }}
        onClose={() => setPopoverOpen(false)}
      />
    </CardShell>
  );
}
