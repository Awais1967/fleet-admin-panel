import { createDocument, getCollection } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

export async function sendNotification(payload) {
  if (isFirebaseConfigured) {
    const notification = await createDocument("notifications", payload);
    return { ok: true, payload: notification };
  }

  return { ok: true, payload };
}

export async function getHistory() {
  if (isFirebaseConfigured) {
    return getCollection("notifications");
  }

  return [];
}
