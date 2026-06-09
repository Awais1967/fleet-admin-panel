import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DATA = [
  { name: "Van 1", v: 40 },
  { name: "Van 2", v: 60 },
  { name: "Van 3", v: 80 },
  { name: "Van 4", v: 130 },
  { name: "Van 5", v: 75 },
  { name: "Van 6", v: 70 },
];

export default function MostDamagedVansChart({ data = DATA }) {
  return (
    <ChartCard title="Most Damaged Vans">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="v" radius={[8, 8, 8, 8]} fill="#7BC8C0" />
          </BarChart>
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
