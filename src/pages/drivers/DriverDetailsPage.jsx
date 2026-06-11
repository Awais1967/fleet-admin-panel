import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriverDetailsHeader from "../../components/drivers/DriverDetailsHeader";
import DriverTabs from "../../components/drivers/DriverTabs";
import DriverActivitySummary from "../../components/drivers/DriverActivitySummary";
import DriverCurrentAssignment from "../../components/drivers/DriverCurrentAssignment";
import DriverInspectionHistoryTable from "../../components/drivers/DriverInspectionHistoryTable";
import DriverFormModal from "../../components/drivers/DriverFormModal";
import ErrorState from "../../components/shared/ErrorState";
import * as driversService from "../../services/drivers.service";

const PRIMARY = "#0A8F86";

function getDriverDetailsErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to driver details. Update Firestore rules to allow this admin account to read users, settings, assignments, and driver inspection history.";
  }

  return error?.message || "Unable to load driver details.";
}

export default function DriverDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState("");

  // tabs
  const [tab, setTab] = useState("summary"); // summary | assignment | history

  // data
  const [stats, setStats] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRows, setHistoryRows] = useState([]);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);

  const isActive = useMemo(() => {
    const v = String(driver?.status || "Active").toLowerCase();
    return v === "active";
  }, [driver?.status]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");

      try {
        const d = await driversService.getDriverById(id);
        const s = await driversService.getDriverStats(id);
        const a = await driversService.getDriverCurrentAssignment(id);
        if (!mounted) return;

        setDriver(d);
        setStats(s);
        setAssignment(a);
      } catch (ex) {
        if (!mounted) return;
        setDriver(null);
        setStats(null);
        setAssignment(null);
        setError(getDriverDetailsErrorMessage(ex));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  // lazy-load history ONLY when tab opens (matches your “lazy loading tables” rule)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (tab !== "history") return;
      if (historyRows.length) return;

      setHistoryLoading(true);
      setError("");

      try {
        const rows = await driversService.getDriverInspectionHistory(id);
        if (!mounted) return;

        setHistoryRows(rows || []);
      } catch (ex) {
        if (!mounted) return;
        setHistoryRows([]);
        setError(getDriverDetailsErrorMessage(ex));
      } finally {
        if (mounted) setHistoryLoading(false);
      }
    })();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, id]);

  const onDisableToggle = async () => {
    try {
      setError("");
      const next = await driversService.toggleDriverStatus(id);
      setDriver((p) => ({ ...(p || {}), status: next?.status }));
    } catch (ex) {
      setError(getDriverDetailsErrorMessage(ex));
    }
  };

  return (
    <div className="space-y-6">
      {error ? <ErrorState message={error} /> : null}

      {/* ONE main card like screenshot */}
      <div className="rounded-[10px] bg-white border border-slate-100 shadow-sm overflow-hidden">
        <DriverDetailsHeader
          embedded
          loading={loading}
          driver={driver}
          onBack={() => nav(-1)}
          onEdit={() => setEditOpen(true)}
          onDisable={onDisableToggle}
          rightActionLabel={isActive ? "Disable Driver" : "Enable Driver"}
        />

        {/* Tabs area inside same page (light teal) */}
        <div className="px-6 pb-6">
          <div className="rounded-[10px] bg-[#EAF5F4] border border-slate-100 overflow-hidden">
            <DriverTabs value={tab} onChange={setTab} />

            <div className="px-6 py-6">
              {tab === "summary" ? (
                <DriverActivitySummary loading={loading} data={stats} />
              ) : null}

              {tab === "assignment" ? (
                <div className="min-h-90">
                  <DriverCurrentAssignment assignment={assignment} />
                </div>
              ) : null}

              {tab === "history" ? (
                <div className="min-h-90">
                  <DriverInspectionHistoryTable
                    loading={historyLoading}
                    rows={historyRows}
                    onViewDetail={(r) =>
                      nav(`/inspections/${r.inspectionId || r.id}`)
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile modal */}
      <DriverFormModal
        open={editOpen}
        mode="edit"
        initialValues={{
          fullName: driver?.name || "",
          email: driver?.email || "",
          fatherName: driver?.fatherName || "",
          cnic: driver?.cnic || "",
          mobile: driver?.mobile || "",
          dob: driver?.dob || "",
          gender: driver?.gender || "",
        }}
        onClose={() => setEditOpen(false)}
        onSave={async (form) => {
          try {
            setError("");
            await driversService.updateDriver(id, form);
            const d = await driversService.getDriverById(id);
            setDriver(d);
            setEditOpen(false);
          } catch (ex) {
            setError(getDriverDetailsErrorMessage(ex));
          }
        }}
      />
    </div>
  );
}
