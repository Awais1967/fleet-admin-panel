import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../shared/Pagination";
import ErrorState from "../shared/ErrorState";
import * as notificationsService from "../../services/notifications.service";

function getHistoryErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to notification history. Update Firestore rules to allow this admin account to read notifications.";
  }

  return error?.message || "Unable to load notification history.";
}

export default function NotificationHistoryTable({ refreshKey = 0 }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const history = await notificationsService.getHistory();
        if (!cancelled) setItems(history || []);
      } catch (ex) {
        if (!cancelled) {
          setItems([]);
          setError(getHistoryErrorMessage(ex));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

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
        {error ? (
          <div className="mb-4">
            <ErrorState message={error} />
          </div>
        ) : null}

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

            {!pageRows.length ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notification history found.
              </div>
            ) : null}

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
