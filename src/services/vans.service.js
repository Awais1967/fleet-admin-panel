import {
  createDocumentWithId,
  getCollection,
  getDocument,
  setDocument,
} from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

const VANS = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  vanNumber: `Van-${String((i % 9) + 1).padStart(2, "0")}`,
  vin: `4Y1SL${String(65848 + i)}Z`,
  plateNumber: `ABC-${100 + i}`,
  model: "Toyota Hiace",
  assignedDriver: i % 2 === 0 ? "Ahmed Ali" : "John Doe",
  status: "Active",
}));

const VEHICLES_COLLECTION = "vehicles";

function mapVehicleToVan(vehicle) {
  return {
    ...vehicle,
    id: vehicle.id,
    vanNumber: vehicle.displayName || vehicle.vanNumber || "-",
    vin: vehicle.vin || "",
    plateNumber: vehicle.plateNumber || "-",
    model: vehicle.model || "",
    assignedDriver: vehicle.assignedDriver || "-",
    status: vehicle.isActive === false ? "Inactive" : "Active",
  };
}

function mapVanPayloadToVehicle(payload) {
  return {
    id: payload.vehicleId || payload.id,
    displayName: payload.vanNumber || payload.displayName || "New Van",
    vin: payload.vin || "",
    model: payload.model || "",
    isActive: String(payload.status || "Active").toLowerCase() === "active",
    isDemo: Boolean(payload.isDemo),
    imageUrl: payload.imageUrl || "",
  };
}

function generateVehicleId() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `vehicle_${suffix}`;
}

export async function getVans() {
  if (isFirebaseConfigured) {
    const vehicles = await getCollection(VEHICLES_COLLECTION);
    const vans = vehicles.map(mapVehicleToVan);
    return vans.length ? vans : VANS;
  }

  return VANS;
}

export async function getVanById(id) {
  if (isFirebaseConfigured) {
    const vehicle = await getDocument(VEHICLES_COLLECTION, id);
    if (vehicle) return mapVehicleToVan(vehicle);
  }

  return VANS.find((v) => v.id === String(id)) || VANS[0];
}

export async function upsertVan(payload) {
  if (isFirebaseConfigured) {
    if (payload?.id) {
      const data = mapVanPayloadToVehicle(payload);
      const vehicle = await setDocument(VEHICLES_COLLECTION, payload.id, data);
      return mapVehicleToVan(vehicle);
    }

    const vehicleId = generateVehicleId();
    const data = mapVanPayloadToVehicle({ ...payload, vehicleId });
    const vehicle = await createDocumentWithId(
      VEHICLES_COLLECTION,
      vehicleId,
      data,
    );
    return mapVehicleToVan(vehicle);
  }

  if (payload?.id) {
    const idx = VANS.findIndex((van) => van.id === String(payload.id));
    if (idx !== -1) {
      VANS[idx] = { ...VANS[idx], ...payload };
      return VANS[idx];
    }
  }

  const newVan = {
    id: `van_${Date.now()}`,
    assignedDriver: "-",
    status: "Active",
    ...payload,
  };

  VANS.unshift(newVan);
  return newVan;
}
