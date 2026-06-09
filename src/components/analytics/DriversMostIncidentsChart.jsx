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

const DATA = [
  { name: "Ali", v: 50 },
  { name: "Rehman", v: 55 },
  { name: "Azaan", v: 48 },
  { name: "Wasif", v: 68 },
  { name: "Ayaan", v: 60 },
  { name: "Hamza", v: 115 },
  { name: "Faiz", v: 108 },
];

export default function DriversMostIncidentsChart({ data = DATA }) {
  return (
    <ChartCard title="Drivers with Most Incidents">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" stopOpacity={0.25} />
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
              strokeWidth={2.5}
              fill="url(#incFill)"
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
