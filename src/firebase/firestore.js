import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./client";

function requireFirestore() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured");
  }
}

export async function getCollection(collectionName) {
  requireFirestore();
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getDocument(collectionName, id) {
  requireFirestore();
  const snap = await getDoc(doc(db, collectionName, String(id)));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createDocument(collectionName, payload) {
  requireFirestore();
  const ref = await addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return getDocument(collectionName, ref.id);
}

export async function setDocument(collectionName, id, payload) {
  requireFirestore();
  await setDoc(
    doc(db, collectionName, String(id)),
    { ...payload, updatedAt: serverTimestamp() },
    { merge: true },
  );
  return getDocument(collectionName, id);
}

export async function updateDocument(collectionName, id, payload) {
  requireFirestore();
  await updateDoc(doc(db, collectionName, String(id)), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
  return getDocument(collectionName, id);
}

export async function removeDocument(collectionName, id) {
  requireFirestore();
  await deleteDoc(doc(db, collectionName, String(id)));
  return { ok: true };
}
