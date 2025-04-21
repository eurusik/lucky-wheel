import { DATA_SOURCE } from '../config';
import { db } from '../firebase';
import { SectorImmunity } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const IMMUNITY_STORAGE_KEY = 'wheel_immunities';

// Helper for Firestore path
function getImmunityDocRef(wheelId: string) {
  return doc(db, 'wheels', wheelId, 'meta', 'immunities');
}

export async function getImmunities(wheelId: string): Promise<SectorImmunity[]> {
  if (DATA_SOURCE === 'firebase') {
    const docRef = getImmunityDocRef(wheelId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return (snap.data().immunities || []) as SectorImmunity[];
    }
    return [];
  } else {
    try {
      const stored = localStorage.getItem(IMMUNITY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting immunities from localStorage:', error);
      return [];
    }
  }
}

export async function addImmunity(wheelId: string, sectorIndex: number, name: string): Promise<SectorImmunity> {
  const immunities = await getImmunities(wheelId);
  const existingIndex = immunities.findIndex(im => im.sectorIndex === sectorIndex);
  const newImmunity: SectorImmunity = {
    sectorIndex,
    name,
    createdAt: new Date().toISOString(),
  };
  if (existingIndex >= 0) {
    immunities[existingIndex] = newImmunity;
  } else {
    immunities.push(newImmunity);
  }
  if (DATA_SOURCE === 'firebase') {
    const docRef = getImmunityDocRef(wheelId);
    await setDoc(docRef, { immunities }, { merge: true });
  } else {
    localStorage.setItem(IMMUNITY_STORAGE_KEY, JSON.stringify(immunities));
  }
  return newImmunity;
}

export async function removeImmunity(wheelId: string, sectorIndex: number): Promise<boolean> {
  const immunities = await getImmunities(wheelId);
  const initialLength = immunities.length;
  const filteredImmunities = immunities.filter(im => im.sectorIndex !== sectorIndex);
  if (DATA_SOURCE === 'firebase') {
    const docRef = getImmunityDocRef(wheelId);
    await setDoc(docRef, { immunities: filteredImmunities }, { merge: true });
  } else {
    localStorage.setItem(IMMUNITY_STORAGE_KEY, JSON.stringify(filteredImmunities));
  }
  return filteredImmunities.length !== initialLength;
}

export async function clearAllImmunities(wheelId: string): Promise<void> {
  if (DATA_SOURCE === 'firebase') {
    const docRef = getImmunityDocRef(wheelId);
    await setDoc(docRef, { immunities: [] }, { merge: true });
  } else {
    localStorage.removeItem(IMMUNITY_STORAGE_KEY);
  }
}

export async function hasSectorImmunity(wheelId: string, sectorIndex: number): Promise<boolean> {
  const immunities = await getImmunities(wheelId);
  return immunities.some(im => im.sectorIndex === sectorIndex);
}

export async function getSectorImmunity(wheelId: string, sectorIndex: number): Promise<SectorImmunity | null> {
  const immunities = await getImmunities(wheelId);
  return immunities.find(im => im.sectorIndex === sectorIndex) || null;
}
