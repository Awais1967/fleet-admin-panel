import React from "react";

const styles = {
  info: "bg-slate-50 text-slate-700 border-slate-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-800 border-amber-100",
  danger: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function Alert({ type = "info", title, children }) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${styles[type] || styles.info}`}
    >
      {title ? <div className="font-semibold mb-1">{title}</div> : null}
      <div>{children}</div>
    </div>
  );
}
