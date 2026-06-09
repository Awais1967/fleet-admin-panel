import { createDocument, getCollection } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

function formatFirebaseDate(value, options = {}) {
  if (!value) return "-";

  const date =
    typeof value.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : null;

  if (!date) return String(value);

  return new Intl.DateTimeFormat("en", options).format(date);
}

function formatTime(value) {
  return formatFirebaseDate(value, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapAssignmentToHistory(assignment) {
  return {
    ...assignment,
    id: assignment.id,
    date: assignment.date || "-",
    driver: assignment.driverName || "-",
    van: assignment.vanLabel || assignment.van || "-",
    assignedBy: assignment.assignedBy || "Admin",
    time: formatTime(assignment.createdAt),
  };
}

function buildAssignmentPayload({
  date,
  driverId,
  driverName,
  vanId,
  vanLabel,
  assignedBy,
  autoSms,
  type,
  status,
}) {
  return {
    date,
    driverId,
    driverName,
    vanId,
    vanLabel,
    assignedBy: assignedBy || "Admin",
    autoSms: Boolean(autoSms),
    type,
    status: Boolean(status),
  };
}

export async function assignDaily({
  date,
  driverId,
  driverName,
  vanId,
  vanLabel,
  assignedBy,
  autoSms,
}) {
  const payload = buildAssignmentPayload({
    date,
    driverId,
    driverName,
    vanId,
    vanLabel,
    assignedBy,
    autoSms,
    type: "daily",
    status: true,
  });

  if (isFirebaseConfigured) {
    const assignment = await createDocument("assignments", payload);

    return {
      ok: true,
      ...assignment,
      message: `${payload.driverName} has been assigned ${payload.vanLabel} for ${date}`,
    };
  }

  return {
    ok: true,
    ...payload,
    message: `${payload.driverName} has been assigned ${payload.vanLabel} for ${date}`,
  };
}

export async function assignBulk(rows, { date, assignedBy, autoSms } = {}) {
  const payloads = rows
    .filter((row) => row.driverId)
    .map((row) =>
      buildAssignmentPayload({
        date: date || new Date().toISOString().slice(0, 10),
        driverId: row.driverId,
        driverName: row.driverName,
        vanId: row.vanId,
        vanLabel: row.vanLabel,
        assignedBy,
        autoSms,
        type: "bulk",
        status: Boolean(row.vanId),
      }),
    );

  if (isFirebaseConfigured) {
    const savedRows = await Promise.all(
      payloads.map((payload) => createDocument("assignments", payload)),
    );
    return { ok: true, rows: savedRows };
  }

  return { ok: true, rows: payloads };
}

export async function getAssignmentHistory() {
  if (isFirebaseConfigured) {
    const assignments = await getCollection("assignments");
    return assignments
      .filter((assignment) => assignment.status === true)
      .map(mapAssignmentToHistory)
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
  }

  return [];
}
