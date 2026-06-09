import React, { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "../shared/Pagination";

const MOCK = Array.from({ length: 80 }).map((_, i) => ({
  id: `hist_${i}`,
  date: "13 Aug 2025",
  driver: i % 2 === 0 ? "Ahmed Ali" : "John Doe",
  van: i % 2 === 0 ? "Van-19" : "Van-07",
  assignedBy: "Admin",
  time: "08:05 AM",
}));

export default function AssignmentHistoryTable() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(0);
  const lazyPageSize = 12;
  const sentinelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(MOCK.slice(0, lazyPageSize));
      setCursor(lazyPageSize);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setItems((prev) => {
          if (cursor >= MOCK.length) return prev;
          const next = MOCK.slice(cursor, cursor + lazyPageSize);
          return [...prev, ...next];
        });
        setCursor((c) => Math.min(MOCK.length, c + lazyPageSize));
      },
      { rootMargin: "300px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loading, cursor]);

  const rows = useMemo(() => items, [items]);
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
  }, [items]);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = rows.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize,
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">
          Assignment History
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-5 text-xs font-semibold text-slate-600 pb-3">
          <div>Date</div>
          <div>Driver</div>
          <div>Van</div>
          <div>Assigned By</div>
          <div>Time</div>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <div className="space-y-4">
            {pageRows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-5 text-xs text-slate-700"
              >
                <div>{r.date}</div>
                <div>{r.driver}</div>
                <div>{r.van}</div>
                <div>{r.assignedBy}</div>
                <div>{r.time}</div>
              </div>
            ))}
            <div ref={sentinelRef} className="h-6" />
            {total > pageSize ? (
              <div className="pt-4">
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
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((__, j) => (
            <div key={j} className="h-3 rounded bg-slate-100 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}
