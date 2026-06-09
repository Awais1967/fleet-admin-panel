import {
  createPlainDocument,
  getCollection,
  getDocument,
  setPlainDocument,
  setDocument,
} from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

const ADMINS_COLLECTION = "admins";

function normalizeAdmin(admin) {
  return {
    id: admin.id,
    name: admin.Name || admin.name || "",
    email: admin.Email || admin.email || "",
    role: admin.Role || admin.role || "Admin",
    status: admin.status || admin.Status || "Active",
  };
}

function mapAdminPayload(payload) {
  return {
    Name: payload.name || payload.Name || "",
    Email: payload.email || payload.Email || "",
    Role: payload.role || payload.Role || "Admin",
    status: payload.status || "Active",
  };
}

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
    const admins = await getCollection(ADMINS_COLLECTION);
    return admins.map(normalizeAdmin);
  }

  return [];
}

export async function addAdmin(payload) {
  if (isFirebaseConfigured) {
    const admin = await createPlainDocument(
      ADMINS_COLLECTION,
      mapAdminPayload(payload),
    );
    return normalizeAdmin(admin);
  }

  return { ok: true, payload };
}

export async function setAdminStatus(id, status) {
  if (isFirebaseConfigured) {
    const admin = await setPlainDocument(ADMINS_COLLECTION, id, { status });
    return normalizeAdmin(admin);
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
