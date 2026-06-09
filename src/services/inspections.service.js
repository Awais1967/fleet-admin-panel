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

function formatDate(value) {
  return formatFirebaseDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  return formatFirebaseDate(value, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapInspectionStatus(inspection) {
  const status = String(inspection.status || "").toLowerCase();
  const phase = String(inspection.inspectionPhase || "").toLowerCase();

  if (status === "approved" || phase === "complete") return "Completed";
  if (status === "started" || phase === "started") return "In Progress";
  return inspection.status || "Not Started";
}

function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.imageUrl || image.downloadUrl || image.path || "";
}

function mapInspectionImages(images = [], inspection) {
  return (images || [])
    .map((image, index) => ({
      id: image?.id || `photo_${index + 1}`,
      url: getImageUrl(image),
      tagged: Boolean(image?.tagged || image?.damageDetected),
      tag: image?.tag,
      tagLabel: image?.tagLabel,
      capturedOn: formatDate(image?.capturedAt || inspection.submittedAt),
      capturedAt: formatTime(image?.capturedAt || inspection.submittedAt),
      gps: image?.gps || "-",
      device: image?.device || "-",
    }))
    .filter((image) => image.url);
}

function mapInspectionToUi(inspection) {
  const damageCount = Number(inspection.damageCount || 0);
  const aiStatus = damageCount > 0 ? "Damage" : "Clear";
  const photos = mapInspectionImages(inspection.images || [], inspection);

  return {
    ...inspection,
    id: inspection.id,
    driverName: inspection.driverName || "-",
    driverId: inspection.driverId || inspection.userId || "-",
    driverEmail: inspection.driverEmail || "",
    driverPhone: inspection.driverPhone || "",
    vanNumber: inspection.vehicleDisplayName || "-",
    vehicleId: inspection.vehicleId || "",
    vin: inspection.vin || "",
    model: inspection.model || "",
    assignTime: formatTime(inspection.startedAt),
    status: mapInspectionStatus(inspection),
    submitTime: formatTime(inspection.submittedAt),
    submissionTime: formatTime(inspection.submittedAt),
    inspectionDate: formatDate(inspection.submittedAt || inspection.startedAt),
    aiStatus,
    totalInspections: inspection.capturedImageCount ?? "-",
    damageRate: damageCount > 0 ? `${damageCount} found` : "-",
    lastInspection: formatDate(inspection.submittedAt),
    photos,
    aiIssues:
      damageCount > 0
        ? [
            {
              label: inspection.damageSummary || `${damageCount} damage found`,
              type: "damage",
            },
          ]
        : [],
  };
}

export async function getInspections() {
  if (isFirebaseConfigured) {
    const inspections = await getCollection("inspections");
    const mappedInspections = inspections.map(mapInspectionToUi);
    return mappedInspections.length ? mappedInspections : MOCK_INSPECTIONS;
  }

  return MOCK_INSPECTIONS;
}

export async function getInspectionById(id) {
  if (isFirebaseConfigured) {
    const inspection = await getDocument("inspections", id);
    if (inspection) return mapInspectionToUi(inspection);
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
    const inspection = await getDocument("inspections", id);
    if (inspection) {
      const mappedInspection = mapInspectionToUi(inspection);
      const photos = mappedInspection.photos || [];
      const beforePhoto = photos[0];
      const afterPhoto = photos[photos.length > 1 ? photos.length - 1 : 0];
      const damageCount = Number(inspection.damageCount || 0);

      return {
        before: {
          url: beforePhoto?.url,
          capturedOn: beforePhoto?.capturedOn || mappedInspection.inspectionDate,
          capturedAt: beforePhoto?.capturedAt || mappedInspection.submitTime,
          gps: beforePhoto?.gps || "-",
          device: beforePhoto?.device || "-",
          label: "Before",
        },
        after: {
          url: afterPhoto?.url,
          capturedOn: afterPhoto?.capturedOn || mappedInspection.inspectionDate,
          capturedAt: afterPhoto?.capturedAt || mappedInspection.submitTime,
          gps: afterPhoto?.gps || "-",
          device: afterPhoto?.device || "-",
          label: "After",
          tag: damageCount > 0 ? inspection.damageSummary : "No damage",
        },
      };
    }
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
