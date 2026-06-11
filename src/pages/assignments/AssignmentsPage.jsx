import React, { useEffect, useState } from "react";
import DailyAssignmentCard from "../../components/assignments/DailyAssignmentCard";
import BulkAssignmentCard from "../../components/assignments/BulkAssignmentCard";
import AssignmentHistoryTable from "../../components/assignments/AssignmentHistoryTable";
import AssignmentAlertModal from "../../components/assignments/AssignmentAlertModal";
import * as driversService from "../../services/drivers.service";
import * as vansService from "../../services/vans.service";
import * as assignmentsService from "../../services/assignments.service";
import { useAuth } from "../../context/AuthContext";
import ErrorState from "../../components/shared/ErrorState";

function getAssignmentsErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to assigned vehicles. Update Firestore rules to allow this admin account to write users/{driverUid}/assigned_vehicles.";
  }

  return error?.message || "Unable to save assignment.";
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [vans, setVans] = useState([]);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [d, v] = await Promise.all([
          driversService.getDrivers(),
          vansService.getVans(),
        ]);
        if (!mounted) return;
        setDrivers(
          d.map((x) => ({
            id: x.uid || x.id,
            uid: x.uid || x.id,
            driverId: x.driverId || "",
            name: x.name,
            email: x.email,
          })),
        );
        setVans(v.map((x) => ({ id: x.id, label: x.vanNumber })));
      } catch (ex) {
        if (!mounted) return;
        setError(getAssignmentsErrorMessage(ex));
      }
    })();
    return () => (mounted = false);
  }, []);

  const onAssign = async ({ date, driverId: selectedDriverUid, vanId, autoSms }) => {
    try {
      setError("");
      const driver = drivers.find((item) => item.uid === selectedDriverUid);
      const van = vans.find((item) => item.id === vanId);

      if (!driver) {
        throw new Error("Selected driver was not found. Refresh and select the driver again.");
      }

      if (!driver.uid) {
        throw new Error("Selected driver is missing a Firebase UID.");
      }

      if (!van) {
        throw new Error("Selected van was not found. Refresh and select the van again.");
      }

      const res = await assignmentsService.assignDaily({
        date,
        driverUid: driver.uid,
        driverId: driver?.driverId || "",
        driverName: driver?.name || "",
        vanId,
        vanLabel: van?.label || "",
        assignedBy: user?.name || user?.email || "Admin",
        autoSms,
      });
      setAlertMsg(res.message);
      setAlertOpen(true);
      setHistoryRefreshKey((value) => value + 1);
    } catch (ex) {
      setError(getAssignmentsErrorMessage(ex));
    }
  };

  const onBulkConfirm = async (rows) => {
    try {
      setError("");
      const result = await assignmentsService.assignBulk(rows, {
        assignedBy: user?.name || user?.email || "Admin",
        autoSms: true,
      });
      setHistoryRefreshKey((value) => value + 1);
      return result;
    } catch (ex) {
      setError(getAssignmentsErrorMessage(ex));
      throw ex;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Assignments</div>
      {error ? <ErrorState message={error} /> : null}

      <DailyAssignmentCard drivers={drivers} vans={vans} onAssign={onAssign} />
      <BulkAssignmentCard
        drivers={drivers}
        vans={vans}
        onConfirm={onBulkConfirm}
      />
      <AssignmentHistoryTable refreshKey={historyRefreshKey} />

      <AssignmentAlertModal
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}
