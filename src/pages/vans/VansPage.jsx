import React from "react";
import VansTable from "../../components/vans/VansTable";

export default function VansPage() {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Vans</div>
      <VansTable />
    </div>
  );
}
