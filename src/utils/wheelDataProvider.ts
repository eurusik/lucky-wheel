import { DATA_SOURCE } from '../config';
import * as wheelStorage from './wheelStorage';
import {
  saveWheelToFirestore,
  getWheelFromFirestore,
  getAllWheelsFromFirestore,
  deleteWheelFromFirestore,
  FirestoreWheelData,
} from './wheelFirestore';

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
