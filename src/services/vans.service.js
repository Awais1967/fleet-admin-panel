import { getCollection, getDocument } from "../firebase/firestore";
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

export async function getVans() {
  if (isFirebaseConfigured) {
    const vans = await getCollection("vans");
    return vans.length ? vans : VANS;
  }

  return VANS;
}

export async function getVanById(id) {
  if (isFirebaseConfigured) {
    const van = await getDocument("vans", id);
    if (van) return van;
  }

  return VANS.find((v) => v.id === String(id)) || VANS[0];
}
