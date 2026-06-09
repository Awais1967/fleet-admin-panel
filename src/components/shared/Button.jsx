import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const v = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white",
    outline: "border border-teal-600 text-teal-700 hover:bg-teal-50",
    ghost: "hover:bg-slate-100 text-slate-700",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
  };

  const s = {
    sm: "h-9 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-11 px-5 text-sm rounded-md",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${v[variant]} ${s[size]} ${className}`}
    >
      {children}
    </button>
  );
}
