import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/client";

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
    driver: assignment.driverName || assignment.driverId || "-",
    van: assignment.vanLabel || assignment.vanId || "-",
    assignedBy: assignment.assignedBy || "Admin",
    time: formatTime(assignment.createdAt),
  };
}

function buildAssignmentPayload({
  date,
  driverUid,
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
    driverUid,
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

function buildAssignmentNotificationPayload(assignment) {
  const message = `You have been assigned ${assignment.vanLabel} for ${assignment.date}.`;

  return {
    message,
    recipientIds: [assignment.driverUid].filter(Boolean),
    recipientNames: [assignment.driverName].filter(Boolean),
    sentTo: assignment.driverName || "Driver",
    sms: Boolean(assignment.autoSms),
    inApp: true,
    status: "Delivered",
    type: "assignment",
    assignmentId: assignment.id,
    driverUid: assignment.driverUid,
    driverId: assignment.driverId,
    vanId: assignment.vanId,
    date: assignment.date,
  };
}

async function saveAssignmentNotification(assignment) {
  if (!assignment?.status || !assignment?.driverUid || !assignment?.vanId) {
    return null;
  }

  if (!isFirebaseConfigured || !db) {
    return {
      id: `local_notification_${Date.now()}`,
      ...buildAssignmentNotificationPayload(assignment),
    };
  }

  const notificationRef = doc(
    collection(db, "users", assignment.driverUid, "notifications"),
  );
  const notificationPath = `users/${assignment.driverUid}/notifications/${notificationRef.id}`;
  console.log("Saving assignment notification to:", notificationPath);

  const payload = {
    ...buildAssignmentNotificationPayload(assignment),
    notificationId: notificationRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(notificationRef, payload);
  const savedSnap = await getDoc(notificationRef);

  if (!savedSnap.exists()) {
    throw new Error("Assignment notification write failed: document was not created");
  }

  return { id: savedSnap.id, ...savedSnap.data() };
}

async function saveAssignedVehicle(assignment) {
  if (!assignment?.driverUid) {
    throw new Error("Driver Firebase UID is missing. Select a valid driver.");
  }

  if (!assignment?.vanId) {
    throw new Error("Van is missing. Select a valid van.");
  }

  if (!isFirebaseConfigured || !db) {
    const id = `local_assignment_${Date.now()}`;
    return {
      id,
      assignmentId: id,
      ...assignment,
    };
  }

  const assignmentRef = doc(
    collection(db, "users", assignment.driverUid, "assigned_vehicles"),
  );
  const assignmentPath = `users/${assignment.driverUid}/assigned_vehicles/${assignmentRef.id}`;
  console.log("Saving assignment to:", assignmentPath);

  await setDoc(assignmentRef, {
    assignmentId: assignmentRef.id,
    date: assignment.date,
    driverUid: assignment.driverUid,
    driverId: assignment.driverId,
    driverName: assignment.driverName,
    vanId: assignment.vanId,
    vanLabel: assignment.vanLabel,
    assignedBy: assignment.assignedBy,
    autoSms: Boolean(assignment.autoSms),
    type: assignment.type,
    status: Boolean(assignment.status),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const savedSnap = await getDoc(assignmentRef);

  if (!savedSnap.exists()) {
    throw new Error("Assignment write failed: document was not created");
  }

  return { id: savedSnap.id, ...savedSnap.data() };
}

export async function assignDaily({
  date,
  driverUid,
  driverId,
  driverName,
  vanId,
  vanLabel,
  assignedBy,
  autoSms,
}) {
  const payload = buildAssignmentPayload({
    date,
    driverUid,
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
    const assignment = await saveAssignedVehicle(payload);
    const notification = await saveAssignmentNotification(assignment);

    return {
      ok: true,
      ...assignment,
      notification,
      notificationSent: Boolean(notification),
      message: `${payload.driverName} has been assigned ${payload.vanLabel} for ${date}. Notification sent to driver.`,
    };
  }

  const assignment = await saveAssignedVehicle(payload);
  const notification = await saveAssignmentNotification(assignment);

  return {
    ok: true,
    ...assignment,
    notification,
    notificationSent: Boolean(notification),
    message: `${payload.driverName} has been assigned ${payload.vanLabel} for ${date}. Notification sent to driver.`,
  };
}

export async function assignBulk(rows, { date, assignedBy, autoSms } = {}) {
  const payloads = rows
    .filter((row) => row.driverUid && row.vanId)
    .map((row) =>
      buildAssignmentPayload({
        date: date || new Date().toISOString().slice(0, 10),
        driverUid: row.driverUid,
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

  if (!payloads.length) {
    throw new Error("No valid assignments to save. Select at least one driver and van.");
  }

  if (isFirebaseConfigured) {
    const savedRows = await Promise.all(
      payloads.map((payload) =>
        saveAssignedVehicle(payload),
      ),
    );
    const notifications = await Promise.all(
      savedRows.map((assignment) => saveAssignmentNotification(assignment)),
    );
    return {
      ok: true,
      rows: savedRows,
      notifications: notifications.filter(Boolean),
      notificationsSent: notifications.filter(Boolean).length,
    };
  }

  const savedRows = await Promise.all(
    payloads.map((payload) =>
      saveAssignedVehicle(payload),
    ),
  );
  const notifications = await Promise.all(
    savedRows.map((assignment) => saveAssignmentNotification(assignment)),
  );

  return {
    ok: true,
    rows: savedRows,
    notifications: notifications.filter(Boolean),
    notificationsSent: notifications.filter(Boolean).length,
  };
}

export async function getAssignmentHistory() {
  if (isFirebaseConfigured && db) {
    const snap = await getDocs(collectionGroup(db, "assigned_vehicles"));
    return snap.docs
      .map((item) => mapAssignmentToHistory({ id: item.id, ...item.data() }))
      .filter((assignment) => assignment.status === true)
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
  }

  return [];
}
