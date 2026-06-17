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
    van: assignment.displayName || assignment.vanLabel || assignment.vehicleId || assignment.vanId || "-",
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
  vehicleId,
  displayName,
  imageUrl,
  model,
  vin,
  isDemo,
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
    vanId: vehicleId || vanId,
    vanLabel: displayName || vanLabel || "",
    vehicleId: vehicleId || vanId,
    displayName: displayName || vanLabel || "",
    imageUrl: imageUrl || "",
    model: model || "",
    vin: vin || "",
    isDemo: Boolean(isDemo),
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
    assignmentId: assignment.id || assignment.vehicleId || assignment.vanId,
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

async function assertVehicleAvailableForDriver(vehicleId, driverUid) {
  if (!isFirebaseConfigured || !db) return;

  const snap = await getDocs(collectionGroup(db, "assigned_vehicles"));
  const existing = snap.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .find(
      (item) =>
        item.isActive === true &&
        String(item.vehicleId || item.id || "") === String(vehicleId) &&
        String(item.driverId || "") !== String(driverUid),
    );

  if (existing) {
    throw new Error(
      `${existing.displayName || vehicleId} is already assigned to another driver.`,
    );
  }
}

async function saveAssignedVehicle(assignment) {
  if (!assignment?.driverUid) {
    throw new Error("Driver Firebase UID is missing. Select a valid driver.");
  }

  const selectedVehicleId = assignment.vehicleId || assignment.vanId;

  if (!selectedVehicleId) {
    throw new Error("Van is missing. Select a valid van.");
  }

  const vehicleId = String(selectedVehicleId);
  await assertVehicleAvailableForDriver(vehicleId, assignment.driverUid);

  const payload = {
    assignedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    date: assignment.date || "",
    displayName: assignment.displayName || assignment.vanLabel || "",
    driverId: assignment.driverUid,
    id: vehicleId,
    imageUrl: assignment.imageUrl || "",
    isActive: true,
    isDemo: Boolean(assignment.isDemo),
    model: assignment.model || "",
    photoCaptured: 0,
    photoRequired: 14,
    status: "not_started",
    updatedAt: serverTimestamp(),
    vehicleId,
    vin: assignment.vin || "",
  };

  if (!isFirebaseConfigured || !db) {
    return payload;
  }

  const assignmentRef = doc(
    db,
    "users",
    String(assignment.driverUid),
    "assigned_vehicles",
    vehicleId,
  );
  const assignmentPath = `users/${assignment.driverUid}/assigned_vehicles/${vehicleId}`;
  console.log("Saving assignment to:", assignmentPath);

  await setDoc(assignmentRef, payload);

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
  vehicleId,
  displayName,
  imageUrl,
  model,
  vin,
  isDemo,
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
    vehicleId,
    displayName,
    imageUrl,
    model,
    vin,
    isDemo,
    assignedBy,
    autoSms,
    type: "daily",
    status: true,
  });

  if (isFirebaseConfigured) {
    const assignment = await saveAssignedVehicle(payload);
    const notification = await saveAssignmentNotification(payload);

    return {
      ok: true,
      ...assignment,
      notification,
      notificationSent: Boolean(notification),
      message: `${payload.driverName} has been assigned ${payload.displayName} for ${date}. Notification sent to driver.`,
    };
  }

  const assignment = await saveAssignedVehicle(payload);
  const notification = await saveAssignmentNotification(payload);

  return {
    ok: true,
    ...assignment,
    notification,
    notificationSent: Boolean(notification),
    message: `${payload.driverName} has been assigned ${payload.displayName} for ${date}. Notification sent to driver.`,
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
        vehicleId: row.vehicleId,
        displayName: row.displayName,
        imageUrl: row.imageUrl,
        model: row.model,
        vin: row.vin,
        isDemo: row.isDemo,
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
      payloads.map((payload) => saveAssignmentNotification(payload)),
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
    payloads.map((payload) => saveAssignmentNotification(payload)),
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
      .filter((assignment) => assignment.isActive === true)
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
  }

  return [];
}
