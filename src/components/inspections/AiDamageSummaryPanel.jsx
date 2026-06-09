import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AiDamageSummaryPanel({
  loading,
  items = [],
  aiStatus,
  inspectionId,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isClear = aiStatus && aiStatus.toLowerCase() === "clear";
  const list = (items || []).map((it) =>
    typeof it === "string" ? { label: it } : it,
  );

  return (
    <div className="h-full flex flex-col rounded-[10px] bg-white border border-slate-100 shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="text-[12px] font-semibold text-slate-800">
          AI Damage Summary Panel
        </div>
      </div>

      <div className="px-5 py-4 flex-1">
        <div className="text-[12px] font-semibold text-slate-700 mb-3">
          Detected Issues
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-3 w-40 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-36 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
          </div>
        ) : isClear ? (
          <div className="text-[12px] text-slate-500 font-medium">None</div>
        ) : list.length === 0 ? (
          <div className="text-[12px] text-slate-400">No issues found.</div>
        ) : (
          <ul className="space-y-2">
            {list.map((it, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className="text-[12px] text-teal-700 font-medium hover:underline"
                  onClick={() => {
                    // navigate to before-after page and pass selected issue
                    const target = `/inspections/${inspectionId}/before-after`;
                    // prefer state so urls stay clean, but also add query for shareability
                    const search = new URLSearchParams({
                      issue: it.label,
                    }).toString();
                    navigate(target + "?" + search, {
                      state: { issue: it.label, from: location.pathname },
                    });
                  }}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
