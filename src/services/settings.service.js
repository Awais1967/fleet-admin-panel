import {
  createDocument,
  getCollection,
  getDocument,
  setDocument,
} from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

export async function getRetention() {
  if (isFirebaseConfigured) {
    const retention = await getDocument("settings", "retention");
    if (retention) return retention;
  }

  return { periodDays: 60, autoDelete: true };
}

export async function saveRetention(payload) {
  if (isFirebaseConfigured) {
    return setDocument("settings", "retention", payload);
  }

  return { ok: true, payload };
}

export async function getAdmins() {
  if (isFirebaseConfigured) {
    const admins = await getCollection("admins");
    return admins.length ? admins : [];
  }

  return [];
}

export async function addAdmin(payload) {
  if (isFirebaseConfigured) {
    return createDocument("admins", payload);
  }

  return { ok: true, payload };
}

export async function setAdminStatus(id, status) {
  if (isFirebaseConfigured) {
    return setDocument("admins", id, { status });
  }

  return { ok: true, id, status };
}

export async function getSystemSettings() {
  if (isFirebaseConfigured) {
    const settings = await getDocument("settings", "system");
    if (settings) return settings;
  }

  return { aiDetect: true, smsNotif: true };
}

export async function saveSystemSettings(payload) {
  if (isFirebaseConfigured) {
    return setDocument("settings", "system", payload);
  }

  return { ok: true, payload };
}
