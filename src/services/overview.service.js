import { getCollection, getDocument } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

export async function getKpis() {
  if (isFirebaseConfigured) {
    const kpis = await getDocument("overview", "kpis");
    if (kpis) return kpis;
  }

  return {
    totalVans: 230,
    totalDrivers: 96,
    todaysInspections: { done: 42, total: 60 },
    pendingInspections: 18,
    damageAlertsToday: 5,
  };
}

export async function getTodaysInspections() {
  if (isFirebaseConfigured) {
    const inspections = await getCollection("todaysInspections");
    if (inspections.length) return inspections;
  }

  return Array.from({ length: 10 }).map((_, i) => ({
    id: `insp_${i + 1}`,
    driverName: "John Doe",
    van: "Van-07",
    assignTime: "09:15 AM",
    status:
      i % 3 === 0 ? "In Progress" : i % 3 === 1 ? "Completed" : "Not Started",
    submitTime: i % 3 === 1 ? "-" : "09:22 AM",
    aiStatus: i % 2 === 0 ? "Clear" : "Damage",
  }));
}

export async function getDamageAlerts() {
  if (isFirebaseConfigured) {
    const alerts = await getCollection("damageAlerts");
    if (alerts.length) return alerts;
  }

  return Array.from({ length: 2 }).map((_, i) => ({
    id: `da_${i}`,
    title: `Damage Alert #${i + 1}`,
    vanNumber: "Van-19",
    driver: "Ahmed Ali",
    damageDetected: "08:42 AM",
    aiFinding: "Scratch on left rear door",
  }));
}
