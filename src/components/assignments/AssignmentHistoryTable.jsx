import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../shared/Pagination";
import ErrorState from "../shared/ErrorState";
import * as assignmentsService from "../../services/assignments.service";

function getHistoryErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to assignment history. Update Firestore rules to allow this admin account to read assignments.";
  }

  return error?.message || "Unable to load assignment history.";
}

export default function AssignmentHistoryTable({ refreshKey = 0 }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const history = await assignmentsService.getAssignmentHistory();
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
          Assignment History
        </div>
      </div>

      <div className="px-6 py-6">
        {error ? (
          <div className="mb-4">
            <ErrorState message={error} />
          </div>
        ) : null}

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

            {!pageRows.length ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No assignment history found.
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
