import React, { useMemo, useState } from "react";
import AssignmentAlertModal from "./AssignmentAlertModal";

export default function BulkAssignmentCard({
  drivers = [],
  vans = [],
  onConfirm,
}) {
  const [rows, setRows] = useState([]);

  // Initialize rows whenever drivers prop changes (drivers may be loaded async)
  React.useEffect(() => {
    setRows((drivers || []).map((d) => ({ driverId: d.id, vanId: "" })));
  }, [drivers]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertLines, setAlertLines] = useState([]);

  const driverMap = useMemo(() => {
    const m = new Map();
    drivers.forEach((d) => m.set(d.id, d));
    return m;
  }, [drivers]);

  const vanMap = useMemo(() => {
    const m = new Map();
    vans.forEach((v) => m.set(v.id, v));
    return m;
  }, [vans]);

  const selectedVanIds = useMemo(
    () => new Set(rows.map((r) => r.vanId).filter(Boolean)),
    [rows],
  );

  const handleVanChange = (driverId, vanId) => {
    setRows((prev) =>
      prev.map((r) => (r.driverId === driverId ? { ...r, vanId } : r)),
    );
  };

  const driverLabel = (driver) => driver?.name || "Unnamed Driver";

  const statusOf = (r) =>
    r.vanId
      ? { text: "Ready", cls: "text-teal-700" }
      : { text: "No van selected", cls: "text-rose-600" };

  const handleConfirm = async () => {
    const skipped = rows.filter((r) => !r.vanId).length;
    const payloadRows = rows.map((r) => {
      const driver = driverMap.get(r.driverId);
      const van = vanMap.get(r.vanId);
      return {
        ...r,
        driverUid: driver?.uid || r.driverId,
        driverId: driver?.driverId || "",
        driverName: driver?.name || "",
        vanId: van?.vehicleId || van?.id || r.vanId,
        vanLabel: van?.displayName || van?.label || "",
        vehicleId: van?.vehicleId || van?.id || r.vanId,
        displayName: van?.displayName || van?.label || "",
        imageUrl: van?.imageUrl || "",
        model: van?.model || "",
        vin: van?.vin || "",
        isDemo: Boolean(van?.isDemo),
        status: Boolean(r.vanId),
      };
    });

    try {
      const result = await onConfirm?.(payloadRows);
      const saved = result?.rows?.length ?? 0;
      const notificationsSent = result?.notificationsSent ?? 0;
      const skippedAfterSave = rows.length - saved;

      const lines = [
        `${saved} drivers assigned`,
        `${notificationsSent} driver notifications sent`,
        `${skippedAfterSave || skipped} driver skipped due to missing data`,
      ];

      setAlertLines(lines);
      setAlertOpen(true);
    } catch {
      // The parent page renders the Firebase error alert.
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-semibold text-slate-900">
            Bulk Assignment
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-3 text-xs font-semibold text-slate-600 pb-3">
            <div>Driver</div>
            <div>Van</div>
            <div>Status</div>
          </div>

          <div className="space-y-4">
            {rows.map((r) => {
              const d = driverMap.get(r.driverId);
              const st = statusOf(r);
              return (
                <div key={r.driverId} className="grid grid-cols-3 items-center">
                  <div className="text-xs text-slate-700">
                    {driverLabel(d) || "—"}
                  </div>

                  <div>
                    <select
                      value={r.vanId}
                      onChange={(e) =>
                        handleVanChange(r.driverId, e.target.value)
                      }
                      className="h-10 w-full max-w-90 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600 bg-white"
                    >
                      <option value="">Select Van</option>
                      {vans.map((v) => (
                        <option
                          key={v.id}
                          value={v.id}
                          disabled={
                            selectedVanIds.has(v.id) && r.vanId !== v.id
                          }
                        >
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={["text-xs font-medium", st.cls].join(" ")}>
                    {st.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6">
            <button
              onClick={handleConfirm}
              className="h-10 rounded-md bg-teal-600 text-white text-sm font-medium px-5 hover:bg-teal-700"
            >
              Confirm Assignments
            </button>
          </div>
        </div>
      </div>

      <AssignmentAlertModal
        open={alertOpen}
        lines={alertLines}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}
