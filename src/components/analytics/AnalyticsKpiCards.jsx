import React from "react";
import { FiAlertTriangle, FiClipboard, FiTruck, FiUser } from "react-icons/fi";

export default function AnalyticsKpiCards({ values }) {
  const v = values || {
    totalInspections: 230,
    totalIncidents: 230,
    damagedVans: 230,
    highRiskDrivers: 230,
  };

  const cards = [
    {
      label: "Total Inspections",
      value: v.totalInspections,
      icon: <FiClipboard />,
    },
    {
      label: "Total Incidents Reported",
      value: v.totalIncidents,
      icon: <FiAlertTriangle />,
    },
    {
      label: "Frequently Damaged Vans",
      value: v.damagedVans,
      icon: <FiTruck />,
    },
    { label: "High-Risk Drivers", value: v.highRiskDrivers, icon: <FiUser /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl bg-teal-50/70 border border-slate-100 shadow-sm px-6 py-5 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-white flex items-center justify-center text-teal-600 text-xl shadow-sm">
              {c.icon}
            </div>
            <div className="text-xs text-slate-700">{c.label}</div>
            <div className="text-base font-semibold text-slate-900 mt-1">
              {c.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
