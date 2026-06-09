import { createDocument, getCollection } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

export async function assignDaily({ date, driverId, vanId, autoSms }) {
  if (isFirebaseConfigured) {
    const assignment = await createDocument("assignments", {
      date,
      driverId,
      vanId,
      autoSms,
      type: "daily",
      status: "Assigned",
    });

    return {
      ok: true,
      ...assignment,
      message: `Driver-${driverId} has been assigned Van-${vanId} for ${date}`,
    };
  }

  // demo response for your AssignmentAlertModal
  const driverText = driverId ? `Driver-${driverId}` : "Ahmed Ali";

  return {
    ok: true,
    message: `${driverText} has been assigned Van-${vanId} for ${date}`,
    autoSms,
  };
}

export async function assignBulk(rows) {
  if (isFirebaseConfigured) {
    const savedRows = await Promise.all(
      rows.map((row) =>
        createDocument("assignments", {
          ...row,
          type: "bulk",
          status: "Assigned",
        }),
      ),
    );
    return { ok: true, rows: savedRows };
  }

  return { ok: true, rows };
}

export async function getAssignmentHistory() {
  if (isFirebaseConfigured) {
    return getCollection("assignments");
  }

  return [];
}
