import { getCollection, getDocument } from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

const MOCK_INSPECTIONS = [
  // Damage Alert inspections (Van-19, Ahmed Ali)
  {
    id: "1",
    driverName: "Ahmed Ali",
    vanNumber: "Van-19",
    assignTime: "09:15 AM",
    status: "Completed",
    submitTime: "09:22 AM",
    aiStatus: "Damage",
  },
  {
    id: "2",
    driverName: "Ahmed Ali",
    vanNumber: "Van-19",
    assignTime: "09:15 AM",
    status: "Completed",
    submitTime: "09:22 AM",
    aiStatus: "Damage",
  },
  // Regular inspections (John Doe, Van-07)
  ...Array.from({ length: 23 }).map((_, i) => ({
    id: String(i + 3),
    driverName: "John Doe",
    vanNumber: "Van-07",
    assignTime: "09:15 AM",
    status:
      i % 3 === 0 ? "In Progress" : i % 3 === 1 ? "Completed" : "Not Started",
    submitTime: i % 3 === 1 ? "-" : "09:22 AM",
    aiStatus: i % 2 === 0 ? "Clear" : "Damage",
  })),
];

export async function getInspections() {
  if (isFirebaseConfigured) {
    const inspections = await getCollection("inspections");
    return inspections.length ? inspections : MOCK_INSPECTIONS;
  }

  return MOCK_INSPECTIONS;
}

export async function getInspectionById(id) {
  if (isFirebaseConfigured) {
    const inspection = await getDocument("inspections", id);
    if (inspection) return inspection;
  }

  const base =
    MOCK_INSPECTIONS.find((x) => x.id === String(id)) || MOCK_INSPECTIONS[0];

  // Check if this is a damage alert inspection (Ahmed Ali, Van-19)
  const isDamageAlert =
    base.driverName === "Ahmed Ali" && base.vanNumber === "Van-19";

  return {
    ...base,
    driverId: base.driverName === "Ahmed Ali" ? "DR-022" : "DR-021",
    vin: base.vanNumber === "Van-19" ? "4Y1SL65849Z" : "4Y1SL65848Z",
    inspectionDate: "13 Aug 2025",
    submissionTime: "08:42 AM",
    totalInspections: base.driverName === "Ahmed Ali" ? 95 : 118,
    damageRate: isDamageAlert ? "5.2%" : "3.2%",
    lastInspection: "12 Aug 2025",
    photos: Array.from({ length: 10 }).map((_, i) => ({
      id: `p_${i}`,
      url: "https://picsum.photos/seed/van" + (i + 20) + "/320/240",
      tagged: isDamageAlert ? i % 2 === 0 : i % 4 === 0,
      tagLabel: "Scratch Detected",
    })),
    aiIssues: isDamageAlert
      ? [
          { label: "Scratch – Left rear door", type: "damage" },
          { label: "Paint chip – Back panel", type: "damage" },
        ]
      : [
          { label: "Scratch – Left rear door", type: "ok" },
          { label: "Dent – Rear bumper", type: "ok" },
          { label: "Paint chip – Back panel", type: "ok" },
        ],
  };
}

export async function getBeforeAfterByInspectionId(id) {
  if (isFirebaseConfigured) {
    const beforeAfter = await getDocument("inspectionBeforeAfter", id);
    if (beforeAfter) return beforeAfter;
  }

  return {
    before: {
      url: "https://picsum.photos/seed/before" + id + "/900/600",
      capturedOn: "13 Aug 2025",
      capturedAt: "08:37 AM",
      gps: "24.8607° N, 67.0011° E",
      device: "Android",
      label: "Before",
    },
    after: {
      url: "https://picsum.photos/seed/after" + id + "/900/600",
      capturedOn: "13 Aug 2025",
      capturedAt: "08:37 AM",
      gps: "24.8607° N, 67.0011° E",
      device: "Android",
      label: "After",
      tag: "Scratch Detected",
      box: { x: 62, y: 42, w: 28, h: 18 }, // optional if your component supports
    },
  };
}
