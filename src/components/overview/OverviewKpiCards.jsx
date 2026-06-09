import React, { useMemo } from "react";
import {
  FiTruck,
  FiUsers,
  FiCalendar,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";

const PRIMARY = "#0A8F86"; // teal used across screenshot
const CARD_BG = "bg-[#DCEAEA]"; // light teal card background (matches screenshot)

function KpiSkeleton() {
  return (
    <div className={`rounded-[10px] ${CARD_BG} px-4 py-4`}>
      <div className="mx-auto mb-3 h-11 w-11 rounded-full bg-white/80 animate-pulse" />
      <div className="mx-auto h-3 w-24 rounded bg-white/70 animate-pulse" />
      <div className="mx-auto mt-2 h-5 w-10 rounded bg-white/70 animate-pulse" />
    </div>
  );
}

function KpiCard({ icon, label, value, valueClassName, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[10px] ${CARD_BG} px-4 py-4 transition-transform hover:scale-105 cursor-pointer`}
    >
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white">
        <span style={{ color: PRIMARY }} className="text-[18px]">
          {icon}
        </span>
      </div>

      <div className="text-center text-[12px] font-medium text-slate-600">
        {label}
      </div>

      <div
        className={`mt-1 text-center text-[18px] font-semibold text-slate-800 ${
          valueClassName || ""
        }`}
      >
        {value}
      </div>
    </button>
  );
}

export default function OverviewKpiCards({ loading, data, onKpiClick }) {
  const items = useMemo(() => {
    return [
      {
        key: "totalVans",
        icon: <FiTruck />,
        label: "Total Vans",
        value: data?.totalVans ?? 0,
      },
      {
        key: "totalDrivers",
        icon: <FiUsers />,
        label: "Total Drivers",
        value: data?.totalDrivers ?? 0,
      },
      {
        key: "todaysInspections",
        icon: <FiCalendar />,
        label: "Today's Inspections",
        value: `${data?.todaysInspections?.done ?? 0} / ${
          data?.todaysInspections?.total ?? 0
        }`,
      },
      {
        key: "pendingInspections",
        icon: <FiClock />,
        label: "Pending Inspections",
        value: data?.pendingInspections ?? 0,
      },
      {
        key: "damageAlertsToday",
        icon: <FiAlertTriangle />,
        label: "Damage Alerts Today",
        value: data?.damageAlertsToday ?? 0,
        valueClassName: "text-red-500",
      },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((it) =>
        loading ? (
          <KpiSkeleton key={it.key} />
        ) : (
          <KpiCard
            key={it.key}
            icon={it.icon}
            label={it.label}
            value={it.value}
            valueClassName={it.valueClassName}
            onClick={() => onKpiClick?.(it.key)}
          />
        ),
      )}
    </div>
  );
}
