import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DATA = Array.from({ length: 40 }).map((_, i) => ({
  name:
    i < 5
      ? "12 Aug"
      : i < 12
        ? "13 Aug"
        : i < 20
          ? "14 Aug"
          : i < 26
            ? "15 Aug"
            : i < 32
              ? "16 Aug"
              : i < 36
                ? "17 Aug"
                : "18 Aug",
  v: Math.max(40, Math.round(160 + 60 * Math.sin(i / 6) - i * 2 + (i % 3) * 6)),
}));

export default function WeeklyIncidentTrendsChart({ data = DATA }) {
  return (
    <ChartCard title="Weekly Incident Trends">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="wkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#0D9488" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#0D9488"
              strokeWidth={2.3}
              fill="url(#wkFill)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
