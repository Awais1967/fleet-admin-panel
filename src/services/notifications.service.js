import { createDocument, getCollection } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

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
