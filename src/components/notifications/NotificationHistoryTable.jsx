import React, { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "../shared/Pagination";

const MOCK = Array.from({ length: 60 }).map((_, i) => ({
  id: `nt_${i}`,
  message:
    i % 2 === 0
      ? "Van-19 assigned for today"
      : "Complete inspection before 10 AM",
  sentTo: "Ahmed Ali",
  dateTime: "13 Aug 2025, 08:05 AM",
  status: i % 2 === 0 ? "Delivered" : "Failed",
}));

export default function NotificationHistoryTable() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(0);
  const lazyPageSize = 10;
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
          Notification History
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-4 text-xs font-semibold text-slate-600 pb-3">
          <div>Message</div>
          <div>Sent To</div>
          <div>Date & Time</div>
          <div>Delivery Status</div>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <div className="space-y-4">
            {pageRows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-4 text-xs text-slate-700"
              >
                <div>{r.message}</div>
                <div>{r.sentTo}</div>
                <div>{r.dateTime}</div>
                <div>
                  <StatusPill status={r.status} />
                </div>
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

function StatusPill({ status }) {
  const ok = String(status).toLowerCase() === "delivered";
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium",
        ok ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-600",
      ].join(" ")}
    >
      {ok ? "Delivered" : "Failed"}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((__, j) => (
            <div key={j} className="h-3 rounded bg-slate-100 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}
