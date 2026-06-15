import { createDocument, getCollection } from "../firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/client";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const READ_STORAGE_KEY = "fleet_admin_read_notification_ids";

export function getStoredReadNotificationIds() {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? new Set(ids) : new Set();
  } catch {
    return new Set();
  }
}

function storeReadNotificationIds(ids) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Ignore storage failures; Firebase remains the source of truth when available.
  }
}

function markStoredNotificationIdsRead(notificationIds) {
  const next = getStoredReadNotificationIds();
  notificationIds.forEach((id) => next.add(id));
  storeReadNotificationIds(next);
  return next;
}

function formatFirebaseDate(value) {
  if (!value) return "-";

  const date =
    typeof value.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : null;

  if (!date) return String(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function mapNotificationToHistory(notification) {
  return {
    ...notification,
    id: notification.id,
    message: notification.message || "-",
    sentTo: notification.sentTo || "All Driver",
    dateTime: formatFirebaseDate(notification.createdAt),
    status: notification.status || "Delivered",
  };
}

function getDateValue(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function formatRelativeTime(value) {
  const date = getDateValue(value);
  if (!date) return "";

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "now";
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m`;
  if (diffMs < day) return `${Math.max(1, Math.floor(diffMs / hour))}h`;
  return `${Math.max(1, Math.floor(diffMs / day))}d`;
}

function getInspectionTime(inspection) {
  return inspection.submittedAt || inspection.updatedAt || inspection.startedAt;
}

function isDamageDetectedInspection(inspection) {
  return String(inspection.status || "").toLowerCase() === "damage_detected";
}

function mapInspectionToDamageNotification(inspection) {
  const vehicleName =
    inspection.vehicleDisplayName ||
    inspection.model ||
    inspection.vehicleId ||
    "vehicle";
  const driverName = inspection.driverName || "driver";
  const damageCount = Number(inspection.damageCount || 0);
  const damageText =
    damageCount > 0
      ? `${damageCount} damage ${damageCount === 1 ? "issue" : "issues"}`
      : "damage";

  return {
    id: `inspection_${inspection.id}`,
    title: "AI detected damage",
    body:
      inspection.damageSummary ||
      `AI detected ${damageText} on ${vehicleName} for ${driverName}.`,
    time: formatRelativeTime(getInspectionTime(inspection)),
    timestamp: getInspectionTime(inspection),
    unread: true,
    to: `/inspections/${inspection.id}`,
    inspectionId: inspection.id,
  };
}

function sortByNewest(a, b) {
  const aTime = getDateValue(a.timestamp)?.getTime() || 0;
  const bTime = getDateValue(b.timestamp)?.getTime() || 0;
  return bTime - aTime;
}

function mapInspectionsToDamageNotifications(inspections) {
  return inspections
    .filter(isDamageDetectedInspection)
    .map(mapInspectionToDamageNotification)
    .sort(sortByNewest);
}

export async function sendNotification(payload) {
  const notification = {
    message: payload.message || "",
    recipientIds: payload.recipientIds || [],
    recipientNames: payload.recipientNames || [],
    sentTo: payload.sentTo || "All Driver",
    sms: Boolean(payload.sms),
    inApp: Boolean(payload.inApp),
    status: payload.status || "Delivered",
  };

  if (isFirebaseConfigured) {
    const savedNotification = await createDocument(
      "notifications",
      notification,
    );
    return { ok: true, payload: mapNotificationToHistory(savedNotification) };
  }

  return { ok: true, payload: notification };
}

export async function getHistory() {
  if (isFirebaseConfigured) {
    const notifications = await getCollection("notifications");
    return notifications
      .map(mapNotificationToHistory)
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
  }

  return [];
}

export async function getDamageDetectedNotifications() {
  if (!isFirebaseConfigured) return [];

  const inspections = await getCollection("inspections");
  return mapInspectionsToDamageNotifications(inspections);
}

export function subscribeDamageDetectedNotifications(onNext, onError) {
  if (!isFirebaseConfigured || !db) {
    onNext?.([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, "inspections"),
    (snapshot) => {
      const inspections = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      onNext?.(mapInspectionsToDamageNotifications(inspections));
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeReadNotificationIds(adminUid, onNext, onError) {
  if (!isFirebaseConfigured || !db || !adminUid) {
    onNext?.([...getStoredReadNotificationIds()]);
    return () => {};
  }

  return onSnapshot(
    collection(db, "users", adminUid, "notification_reads"),
    (snapshot) => {
      onNext?.(snapshot.docs.map((item) => item.id));
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function markNotificationsRead(adminUid, notificationIds) {
  const ids = [...new Set(notificationIds.filter(Boolean))];

  markStoredNotificationIdsRead(ids);

  if (!ids.length || !isFirebaseConfigured || !db || !adminUid) {
    return { ok: true, count: 0 };
  }

  await Promise.all(
    ids.map((notificationId) =>
      setDoc(
        doc(db, "users", adminUid, "notification_reads", notificationId),
        {
          notificationId,
          readAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );

  return { ok: true, count: ids.length };
}
