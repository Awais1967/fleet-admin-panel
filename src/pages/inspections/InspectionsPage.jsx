import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InspectionsTable from "../../components/inspections/InspectionsTable";
import ErrorState from "../../components/shared/ErrorState";
import * as inspectionsService from "../../services/inspections.service";

function getInspectionsErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to the inspections collection. Update Firestore rules to allow this admin account to read inspections.";
  }

  return error?.message || "Unable to load inspections.";
}

export default function InspectionsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await inspectionsService.getInspections();
        if (!mounted) return;
        setRows(data || []);
      } catch (ex) {
        if (!mounted) return;
        setRows([]);
        setError(getInspectionsErrorMessage(ex));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Inspections</div>
      {error ? <ErrorState message={error} /> : null}
      <InspectionsTable
        loading={loading}
        rows={rows}
        onViewDetail={(row) => navigate(`/inspections/${row.id}`)}
      />
    </div>
  );
}
