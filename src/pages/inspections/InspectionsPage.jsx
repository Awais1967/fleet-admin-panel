import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InspectionsTable from "../../components/inspections/InspectionsTable";
import * as inspectionsService from "../../services/inspections.service";

export default function InspectionsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await inspectionsService.getInspections();
      if (!mounted) return;
      setRows(data || []);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Inspections</div>
      <InspectionsTable
        loading={loading}
        rows={rows}
        onViewDetail={(row) => navigate(`/inspections/${row.id}`)}
      />
    </div>
  );
}
