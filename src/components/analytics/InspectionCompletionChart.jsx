import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DATA = [
  { name: "Jan", v: 10 },
  { name: "Feb", v: 45 },
  { name: "Mar", v: 38 },
  { name: "Apr", v: 60 },
  { name: "May", v: 58 },
  { name: "June", v: 70 },
  { name: "July", v: 78 },
  { name: "Aug", v: 95 },
  { name: "Sept", v: 155 },
];

export default function InspectionCompletionChart({ data = DATA }) {
  return (
    <ChartCard title="Inspection Completion Rate">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="v"
              stroke="#0D9488"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
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
