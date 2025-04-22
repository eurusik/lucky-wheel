import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

// Types for Wheel
import { WheelItem, SpinStats } from '../types';

export interface FirestoreWheelData {
  lastRotation?: number;
  id: string;
  name: string;
  items: WheelItem[];
  spinStats: SpinStats;
}

const WHEELS_COLLECTION = 'wheels';

// Create or update a wheel
export async function saveWheelToFirestore(wheel: FirestoreWheelData) {
  await setDoc(doc(db, WHEELS_COLLECTION, wheel.id), wheel);
}

// Get a wheel by id
export async function getWheelFromFirestore(id: string): Promise<FirestoreWheelData | null> {
  const snap = await getDoc(doc(db, WHEELS_COLLECTION, id));
  if (snap.exists()) return snap.data() as FirestoreWheelData;
  return null;
}

// Get all wheels
export async function getAllWheelsFromFirestore(): Promise<FirestoreWheelData[]> {
  const snap = await getDocs(collection(db, WHEELS_COLLECTION));
  return snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as FirestoreWheelData);
}

// Delete a wheel
export async function deleteWheelFromFirestore(id: string) {
  await deleteDoc(doc(db, WHEELS_COLLECTION, id));
}
