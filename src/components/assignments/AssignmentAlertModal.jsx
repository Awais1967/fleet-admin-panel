import React from "react";
import { FiX } from "react-icons/fi";

export default function AssignmentAlertModal({
  open,
  title = "Assignment Alert",
  message,
  lines = [],
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-155 rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-md hover:bg-slate-100 flex items-center justify-center"
          >
            <FiX />
          </button>
        </div>

        <div className="px-6 py-6">
          {message ? (
            <div className="text-sm text-slate-700 text-center">{message}</div>
          ) : (
            <div className="text-sm text-slate-700">
              <div className="font-medium mb-3">
                Assignments Completed Successfully
              </div>
              <div className="space-y-2">
                {lines.map((t, i) => (
                  <div key={i}>{t}</div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="h-10 min-w-27.5 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
