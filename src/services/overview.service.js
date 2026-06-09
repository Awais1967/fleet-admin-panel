import { getCollection } from "../firebase/firestore";
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

function isToday(value) {
  const date = typeof value?.toDate === "function" ? value.toDate() : null;
  if (!date) return false;

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isDriver(user) {
  return String(user?.role || "").toLowerCase() === "driver";
}

function mapInspectionStatus(inspection) {
  const status = String(inspection.status || "").toLowerCase();
  const phase = String(inspection.inspectionPhase || "").toLowerCase();

  if (status === "approved" || phase === "complete") return "Completed";
  if (status === "started" || phase === "started") return "In Progress";
  return inspection.status || "Not Started";
}

function mapInspectionToOverviewRow(inspection) {
  const damageCount = Number(inspection.damageCount || 0);

  return {
    ...inspection,
    id: inspection.id,
    driverName: inspection.driverName || "-",
    van: inspection.vehicleDisplayName || "-",
    assignTime: formatTime(inspection.startedAt),
    status: mapInspectionStatus(inspection),
    submitTime: formatTime(inspection.submittedAt),
    aiStatus: damageCount > 0 ? "Damage" : "Clear",
  };
}

function mapInspectionToAlert(inspection, index) {
  return {
    id: inspection.id,
    inspectionId: inspection.id,
    title: `Damage Alert #${index + 1}`,
    vanNumber: inspection.vehicleDisplayName || "-",
    driver: inspection.driverName || "-",
    damageDetected: formatTime(inspection.submittedAt || inspection.updatedAt),
    aiFinding: inspection.damageSummary || "Damage detected",
  };
}

async function getOverviewCollections() {
  const [vehicles, users, inspections] = await Promise.all([
    getCollection("vehicles"),
    getCollection("users"),
    getCollection("inspections"),
  ]);

  return { vehicles, users, inspections };
}

export async function getKpis() {
  if (isFirebaseConfigured) {
    const { vehicles, users, inspections } = await getOverviewCollections();
    const todayInspections = inspections.filter((inspection) =>
      isToday(inspection.submittedAt || inspection.startedAt),
    );
    const completedToday = todayInspections.filter(
      (inspection) => mapInspectionStatus(inspection) === "Completed",
    );
    const pendingInspections = inspections.filter(
      (inspection) => mapInspectionStatus(inspection) !== "Completed",
    );
    const damageAlertsToday = todayInspections.filter(
      (inspection) => Number(inspection.damageCount || 0) > 0,
    );

    return {
      totalVans: vehicles.length,
      totalDrivers: users.filter(isDriver).length,
      todaysInspections: {
        done: completedToday.length,
        total: todayInspections.length,
      },
      pendingInspections: pendingInspections.length,
      damageAlertsToday: damageAlertsToday.length,
    };
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
    const inspections = await getCollection("inspections");
    return inspections
      .filter((inspection) => isToday(inspection.submittedAt || inspection.startedAt))
      .map(mapInspectionToOverviewRow);
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
    const inspections = await getCollection("inspections");
    return inspections
      .filter((inspection) => Number(inspection.damageCount || 0) > 0)
      .map(mapInspectionToAlert);
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
