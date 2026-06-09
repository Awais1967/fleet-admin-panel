import React, { useEffect, useState } from "react";
import DailyAssignmentCard from "../../components/assignments/DailyAssignmentCard";
import BulkAssignmentCard from "../../components/assignments/BulkAssignmentCard";
import AssignmentHistoryTable from "../../components/assignments/AssignmentHistoryTable";
import AssignmentAlertModal from "../../components/assignments/AssignmentAlertModal";
import * as driversService from "../../services/drivers.service";
import * as vansService from "../../services/vans.service";
import * as assignmentsService from "../../services/assignments.service";

export default function AssignmentsPage() {
  const [drivers, setDrivers] = useState([]);
  const [vans, setVans] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [d, v] = await Promise.all([
        driversService.getDrivers(),
        vansService.getVans(),
      ]);
      if (!mounted) return;
      setDrivers(d.map((x) => ({ id: x.id, name: x.name })));
      setVans(v.map((x) => ({ id: x.id, label: x.vanNumber })));
    })();
    return () => (mounted = false);
  }, []);

  const onAssign = async ({ date, driverId, vanId, autoSms }) => {
    const res = await assignmentsService.assignDaily({
      date,
      driverId,
      vanId,
      autoSms,
    });
    setAlertMsg(res.message);
    setAlertOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Assignments</div>

      <DailyAssignmentCard drivers={drivers} vans={vans} onAssign={onAssign} />
      <BulkAssignmentCard drivers={drivers} vans={vans} onConfirm={() => {}} />
      <AssignmentHistoryTable />

      <AssignmentAlertModal
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}
