import { getDocument } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

export async function getKpis() {
  if (isFirebaseConfigured) {
    const kpis = await getDocument("analytics", "kpis");
    if (kpis) return kpis;
  }

  return {
    totalInspections: 230,
    totalIncidents: 230,
    damagedVans: 230,
    highRiskDrivers: 230,
  };
}
