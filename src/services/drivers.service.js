// src/services/drivers.service.js
import {
  createDocument,
  getCollection,
  getDocument,
  setDocument,
} from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/client";

// ✅ Demo data (match UI screenshots)
const DRIVERS = [
  {
    id: "1",
    name: "Ahmed Ali",
    status: "Active",
    mobile: "+92 300 4567890",
    totalInspections: 118,
    lastActive: "Today, 09:10 AM",
    fatherName: "Ali Ahmad",
    cnic: "2324367523132436",
    dob: "12-30-2000",
    gender: "Male",
    email: "ahmed.ali@company.com",
    joinDate: "12-04-2025",
    lastActiveDate: "Today, 09:10 AM",
  },
  {
    id: "2",
    name: "John Doe",
    status: "Inactive",
    mobile: "+92 300 4567890",
    totalInspections: 118,
    lastActive: "Today, 09:10 AM",
    fatherName: "Doe Senior",
    cnic: "1234567890123456",
    dob: "01-15-1995",
    gender: "Male",
    email: "john.doe@company.com",
    joinDate: "10-15-2024",
    lastActiveDate: "Yesterday, 02:30 PM",
  },
  {
    id: "3",
    name: "John Doe",
    status: "Active",
    mobile: "+92 300 4567890",
    totalInspections: 118,
    lastActive: "Today, 09:10 AM",
    fatherName: "Doe Senior",
    cnic: "9876543210987654",
    dob: "05-22-1998",
    gender: "Male",
    email: "johndoe3@company.com",
    joinDate: "11-20-2024",
    lastActiveDate: "Today, 09:10 AM",
  },
  {
    id: "4",
    name: "John Doe",
    status: "Active",
    mobile: "+92 300 4567890",
    totalInspections: 118,
    lastActive: "Today, 09:10 AM",
    fatherName: "Doe Senior",
    cnic: "5555555555555555",
    dob: "03-10-2000",
    gender: "Male",
    email: "johndoe4@company.com",
    joinDate: "01-05-2025",
    lastActiveDate: "Today, 08:45 AM",
  },
];

const HISTORY = [
  {
    id: "h1",
    date: "13 Aug 2025",
    van: "Van-19",
    photos: "10/10",
    submissionTime: "08:42 AM",
    aiResult: "Clear",
  },
  {
    id: "h2",
    date: "13 Aug 2025",
    van: "Van-19",
    photos: "10/10",
    submissionTime: "08:42 AM",
    aiResult: "Clear",
  },
  {
    id: "h3",
    date: "13 Aug 2025",
    van: "Van-19",
    photos: "10/10",
    submissionTime: "08:42 AM",
    aiResult: "Clear",
  },
  {
    id: "h4",
    date: "13 Aug 2025",
    van: "Van-19",
    photos: "10/10",
    submissionTime: "08:42 AM",
    aiResult: "Clear",
  },
];

// small async delay for skeletons
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const DRIVERS_COLLECTION = "users";

const DEFAULT_NOTIFICATION_SETTINGS = {
  appUpdate: false,
  damageDetection: true,
  inspectionCompleteAlert: false,
  sound: true,
  vanAssign: true,
  vibrate: true,
};

function formatFirebaseDate(value) {
  if (!value) return "-";

  const date =
    typeof value.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : null;

  if (!date) return String(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function generateDriverId() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DRV-${suffix}`;
}

function isDriverUser(user) {
  return String(user?.role || "").toLowerCase() === "driver";
}

function mapUserToDriver(user) {
  return {
    ...user,
    id: user.id,
    name: user.displayName || user.name || "-",
    fullName: user.displayName || user.name || "",
    mobile: user.phoneNumber || user.mobile || "",
    status: user.status || "Active",
    email: user.email || "",
    totalInspections: user.totalInspections ?? 0,
    lastActive: formatFirebaseDate(user.lastLoginAt),
    lastActiveDate: formatFirebaseDate(user.lastLoginAt),
    joinDate: formatFirebaseDate(user.createdAt),
    driverId: user.driverId || "",
    fatherName: user.fatherName || "",
    cnic: user.cnic || "",
    dob: user.dob || "",
    gender: user.gender || "",
  };
}

function mapDriverPayloadToUser(payload) {
  return {
    displayName: payload.fullName || payload.name || "New Driver",
    email: payload.email || "",
    phoneNumber: payload.mobile || payload.phoneNumber || "",
    role: "Driver",
    status: payload.status || "Active",
    driverId: payload.driverId || generateDriverId(),
    fatherName: payload.fatherName || "",
    cnic: payload.cnic || "",
    dob: payload.dob || "",
    gender: payload.gender || "",
    notificationSettings: {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(payload.notificationSettings || {}),
    },
    seededDemo: Boolean(payload.seededDemo),
  };
}

export async function getDrivers() {
  if (isFirebaseConfigured) {
    const users = await getCollection(DRIVERS_COLLECTION);
    const drivers = users.filter(isDriverUser).map(mapUserToDriver);
    return drivers.length ? drivers : DRIVERS;
  }

  await delay(300);
  return DRIVERS;
}

export async function getDriverById(id) {
  if (isFirebaseConfigured) {
    const user = await getDocument(DRIVERS_COLLECTION, id);
    if (user && isDriverUser(user)) return mapUserToDriver(user);
  }

  await delay(250);
  const base = DRIVERS.find((d) => d.id === String(id));

  if (!base) {
    // Return a default if not found
    return DRIVERS[0];
  }

  // ✅ return driver-specific data from the DRIVERS array
  return {
    ...base,
    email: base.email || "—",
    joinDate: base.joinDate || "—",
    lastActiveDate: base.lastActiveDate || base.lastActive || "—",
  };
}

export async function getDriverInspectionHistory() {
  if (isFirebaseConfigured) {
    const history = await getCollection("driverInspectionHistory");
    return history.length ? history : HISTORY;
  }

  await delay(300);
  // driverId parameter removed; kept here for reference for a real API later
  return HISTORY;
}

export async function upsertDriver(payload) {
  if (isFirebaseConfigured) {
    const data = mapDriverPayloadToUser(payload);

    if (payload?.id) {
      const savedUser = await setDocument(DRIVERS_COLLECTION, payload.id, data);
      return mapUserToDriver(savedUser);
    }

    const savedUser = await createDocument(DRIVERS_COLLECTION, data);
    return mapUserToDriver(savedUser);
  }

  await delay(350);

  if (payload?.id) {
    const idx = DRIVERS.findIndex((d) => d.id === String(payload.id));
    if (idx !== -1) {
      DRIVERS[idx] = {
        ...DRIVERS[idx],
        name: payload.fullName ?? DRIVERS[idx].name,
        mobile: payload.mobile ?? DRIVERS[idx].mobile,
        status: payload.status ?? DRIVERS[idx].status,
        fatherName: payload.fatherName ?? DRIVERS[idx].fatherName,
        cnic: payload.cnic ?? DRIVERS[idx].cnic,
        dob: payload.dob ?? DRIVERS[idx].dob,
        gender: payload.gender ?? DRIVERS[idx].gender,
      };
      return DRIVERS[idx];
    }
  }

  // else add new
  const newItem = {
    id: String(Date.now()),
    name: payload.fullName || "New Driver",
    status: payload.status || "Active",
    mobile: payload.mobile || "+92 300 0000000",
    fatherName: payload.fatherName || "",
    cnic: payload.cnic || "",
    dob: payload.dob || "",
    gender: payload.gender || "",
    totalInspections: 0,
    lastActive: "-",
  };

  DRIVERS.unshift(newItem);
  return newItem;
}

export async function setDriverStatus(id, status) {
  if (isFirebaseConfigured) {
    const user = await setDocument(DRIVERS_COLLECTION, id, { status });
    return mapUserToDriver(user);
  }

  await delay(250);
  const idx = DRIVERS.findIndex((d) => d.id === String(id));
  if (idx === -1) return null;
  DRIVERS[idx] = { ...DRIVERS[idx], status };
  return DRIVERS[idx];
}

export async function toggleDriverStatus(id) {
  if (isFirebaseConfigured) {
    const user = await getDocument(DRIVERS_COLLECTION, id);
    if (!user || !isDriverUser(user)) return null;
    const current = String(user.status || "Active").toLowerCase();
    const next = current === "active" ? "Inactive" : "Active";
    const savedUser = await setDocument(DRIVERS_COLLECTION, id, {
      status: next,
    });
    return mapUserToDriver(savedUser);
  }

  await delay(250);
  const idx = DRIVERS.findIndex((d) => d.id === String(id));
  if (idx === -1) return null;
  const current = String(DRIVERS[idx].status || "Active").toLowerCase();
  const next = current === "active" ? "Inactive" : "Active";
  DRIVERS[idx] = { ...DRIVERS[idx], status: next };
  return DRIVERS[idx];
}

export async function getDriverStats() {
  if (isFirebaseConfigured) {
    const stats = await getDocument("settings", "driverStats");
    if (stats) return stats;
  }

  await delay(250);
  return {
    totalInspections: 118,
    inspectionsThisMonth: 22,
    damageRate: "3.2%",
    avgCompletionTime: "6m 45s",
    missedAssignments: 2,
    successRate: "9.2%",
  };
}

export async function getDriverCurrentAssignment() {
  if (isFirebaseConfigured) {
    const assignments = await getCollection("assignments");
    if (assignments.length) return assignments[0];
  }

  await delay(250);
  return {
    van: "Van-19",
    vin: "4Y1SL65848Z",
    assignmentTime: "08:15 AM",
    inspectionStatus: "In Progress",
  };
}

export async function updateDriver(id, payload) {
  return upsertDriver({ ...payload, id });
}
