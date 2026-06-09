import { getCollection } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

const FALLBACK_KPIS = {
  totalInspections: 230,
  totalIncidents: 230,
  damagedVans: 230,
  highRiskDrivers: 230,
};

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function monthName(date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
}

function dayName(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function isCompleted(inspection) {
  const status = String(inspection.status || "").toLowerCase();
  const phase = String(inspection.inspectionPhase || "").toLowerCase();
  return status === "approved" || phase === "complete";
}

function hasDamage(inspection) {
  return Number(inspection.damageCount || 0) > 0;
}

function increment(map, key, amount = 1) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + amount);
}

function toChartRows(map, limit) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, v]) => ({ name, v }));
}

async function getInspections() {
  return getCollection("inspections");
}

function matchesDate(inspection, date) {
  if (!date) return true;
  const inspectionDate = toDate(inspection.submittedAt || inspection.startedAt);
  if (!inspectionDate) return false;
  return inspectionDate.toISOString().slice(0, 10) === date;
}

function filterInspections(inspections, filters = {}) {
  return inspections.filter((inspection) => {
    if (!matchesDate(inspection, filters.date)) return false;
    if (filters.driver && inspection.driverId !== filters.driver) return false;
    if (filters.van && inspection.vehicleId !== filters.van) return false;
    return true;
  });
}

export async function getKpis(filters = {}) {
  if (isFirebaseConfigured) {
    const inspections = filterInspections(await getInspections(), filters);
    const damagedInspections = inspections.filter(hasDamage);
    const damagedVanIds = new Set(
      damagedInspections.map((inspection) => inspection.vehicleId).filter(Boolean),
    );
    const highRiskDriverIds = new Set(
      damagedInspections.map((inspection) => inspection.driverId).filter(Boolean),
    );

    return {
      totalInspections: inspections.length,
      totalIncidents: damagedInspections.reduce(
        (total, inspection) => total + Number(inspection.damageCount || 0),
        0,
      ),
      damagedVans: damagedVanIds.size,
      highRiskDrivers: highRiskDriverIds.size,
    };
  }

  return FALLBACK_KPIS;
}

export async function getChartData(filters = {}) {
  if (!isFirebaseConfigured) {
    return {
      completion: undefined,
      damagedVans: undefined,
      highRiskDrivers: undefined,
      weeklyIncidents: undefined,
    };
  }

  const inspections = filterInspections(await getInspections(), filters);
  const completionByMonth = new Map();
  const damagedByVan = new Map();
  const incidentsByDriver = new Map();
  const incidentsByDay = new Map();

  inspections.forEach((inspection) => {
    const date = toDate(inspection.submittedAt || inspection.startedAt);
    const damageCount = Number(inspection.damageCount || 0);

    if (date && isCompleted(inspection)) {
      increment(completionByMonth, monthName(date));
    }

    if (damageCount > 0) {
      const vanName =
        inspection.vehicleDisplayName || inspection.vin || inspection.vehicleId;
      const driverName =
        inspection.driverName || inspection.driverEmail || inspection.driverId;

      increment(damagedByVan, vanName, damageCount);
      increment(incidentsByDriver, driverName, damageCount);

      if (date) {
        increment(incidentsByDay, dayName(date), damageCount);
      }
    }
  });

  return {
    completion: [...completionByMonth.entries()].map(([name, v]) => ({
      name,
      v,
    })),
    damagedVans: toChartRows(damagedByVan, 6),
    highRiskDrivers: toChartRows(incidentsByDriver, 7),
    weeklyIncidents: [...incidentsByDay.entries()].map(([name, v]) => ({
      name,
      v,
    })),
  };
}
