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
  query,
  limit,
  startAfter,
  orderBy,
  QuerySnapshot,
} from 'firebase/firestore';

// Types for Wheel
import { WheelItem, SpinStats } from '../types';

export interface FirestoreWheelData {
  lastRotation?: number;
  id: string;
  name: string;
  items: WheelItem[];
  spinStats: SpinStats;
  createdAt?: number; // Timestamp of wheel creation
}

const WHEELS_COLLECTION = 'wheels';

// Create or update a wheel
export async function saveWheelToFirestore(wheel: FirestoreWheelData) {
  // Add createdAt timestamp if it's a new wheel (doesn't have createdAt yet)
  if (!wheel.createdAt) {
    wheel.createdAt = Date.now();
  }
  
  await setDoc(doc(db, WHEELS_COLLECTION, wheel.id), wheel);
}

// Get a wheel by id
export async function getWheelFromFirestore(id: string): Promise<FirestoreWheelData | null> {
  const snap = await getDoc(doc(db, WHEELS_COLLECTION, id));
  if (snap.exists()) return snap.data() as FirestoreWheelData;
  return null;
}

// Get all wheels (without pagination - use with caution for large datasets)
export async function getAllWheelsFromFirestore(): Promise<FirestoreWheelData[]> {
  const snap = await getDocs(collection(db, WHEELS_COLLECTION));
  return snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as FirestoreWheelData);
}

// Get wheels with pagination
export async function getWheelsWithPagination(
  pageSize: number = 5,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  wheels: FirestoreWheelData[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  try {
    let wheelQuery;
    
    if (lastDoc) {
      // Get next batch after the last document
      wheelQuery = query(
        collection(db, WHEELS_COLLECTION),
        orderBy('name'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      // Get first batch
      wheelQuery = query(
        collection(db, WHEELS_COLLECTION),
        orderBy('name'),
        limit(pageSize)
      );
    }
    
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(wheelQuery);
    
    // Extract the wheels data
    const wheels = querySnapshot.docs.map(
      (doc) => doc.data() as FirestoreWheelData
    );
    
    // Get the last visible document for next pagination
    const lastVisible = querySnapshot.docs.length > 0 
      ? querySnapshot.docs[querySnapshot.docs.length - 1] 
      : null;
    
    // Check if there are more documents
    const hasMore = querySnapshot.docs.length === pageSize;
    
    return {
      wheels,
      lastDoc: lastVisible,
      hasMore
    };
  } catch (error) {
    console.error('Error getting paginated wheels:', error);
    return {
      wheels: [],
      lastDoc: null,
      hasMore: false
    };
  }
}

// Delete a wheel
export async function deleteWheelFromFirestore(id: string) {
  await deleteDoc(doc(db, WHEELS_COLLECTION, id));
}
