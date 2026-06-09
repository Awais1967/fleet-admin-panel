import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export default function Modal({
  open,
  title,
  children,
  onClose,
  maxWidth = "720px",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-70">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          style={{ maxWidth }}
          className="w-full bg-white rounded-xl border border-app shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-app flex items-center">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <button
              onClick={onClose}
              className="ml-auto h-9 w-9 rounded-md hover:bg-slate-100 flex items-center justify-center"
            >
              <FiX />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
