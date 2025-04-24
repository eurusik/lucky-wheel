import { DATA_SOURCE } from '../config';
import * as wheelStorage from './wheelStorage';
import {
  saveWheelToFirestore,
  getWheelFromFirestore,
  getAllWheelsFromFirestore,
  getWheelsWithPagination,
  deleteWheelFromFirestore,
  FirestoreWheelData,
} from './wheelFirestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// Unified interface for wheel data operations
export async function saveWheel(wheel: FirestoreWheelData) {
  if (DATA_SOURCE === 'firebase') {
    return saveWheelToFirestore(wheel);
  } else {
    return wheelStorage.saveWheel(wheel);
  }
}

export async function getWheelById(id: string): Promise<FirestoreWheelData | null> {
  if (DATA_SOURCE === 'firebase') {
    return getWheelFromFirestore(id);
  } else {
    return wheelStorage.getWheelById(id) ?? null;
  }
}

export async function getAllWheels(): Promise<FirestoreWheelData[]> {
  if (DATA_SOURCE === 'firebase') {
    return getAllWheelsFromFirestore();
  } else {
    return Object.values(wheelStorage.getAllWheels());
  }
}

// Check if a wheel with the given name already exists
export async function wheelNameExists(name: string): Promise<boolean> {
  const wheels = await getAllWheels();
  return wheels.some(wheel => wheel.name.toLowerCase() === name.toLowerCase());
}

// Get wheels with pagination
export async function getWheelsPage(pageSize: number = 5, lastDoc?: QueryDocumentSnapshot<DocumentData>) {
  if (DATA_SOURCE === 'firebase') {
    return getWheelsWithPagination(pageSize, lastDoc);
  } else {
    // For localStorage, we'll simulate pagination
    const allWheels = Object.values(wheelStorage.getAllWheels());
    const startIndex = lastDoc ? parseInt(lastDoc.id) : 0;
    const endIndex = startIndex + pageSize;
    const wheels = allWheels.slice(startIndex, endIndex);
    
    // Create a mock lastDoc for localStorage
    const mockLastDoc = wheels.length > 0 ? {
      id: endIndex.toString(),
      exists: () => true,
      data: () => ({})
    } as unknown as QueryDocumentSnapshot<DocumentData> : null;
    
    return {
      wheels,
      lastDoc: mockLastDoc,
      hasMore: endIndex < allWheels.length
    };
  }
}

// Update an existing wheel (same as save for both sources)
export async function updateWheel(wheel: FirestoreWheelData) {
  return saveWheel(wheel);
}

// Remove a wheel by id
export async function removeWheel(id: string) {
  if (DATA_SOURCE === 'firebase') {
    return deleteWheelFromFirestore(id);
  } else if (typeof wheelStorage.deleteWheel === 'function') {
    return wheelStorage.deleteWheel(id);
  } else {
    // fallback: remove from localStorage manually
    const all = wheelStorage.getAllWheels();
    delete all[id];
    localStorage.setItem('wheels', JSON.stringify(all));
    return;
  }
}
