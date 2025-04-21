import { DATA_SOURCE } from '../config';
import { db } from '../firebase';
import { SectorImmunity } from '../types';
import { collection, setDoc, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const IMMUNITY_STORAGE_KEY = 'wheel_immunities';

// Helper for Firestore path
function getImmunityCollectionRef(wheelId: string) {
  return collection(db, 'wheels', wheelId, 'immunities');
}

export async function getImmunities(wheelId: string): Promise<SectorImmunity[]> {
  if (DATA_SOURCE === 'firebase') {
    const colRef = getImmunityCollectionRef(wheelId);
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.data() as SectorImmunity);
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
  const newImmunity: SectorImmunity = {
    sectorIndex,
    name,
    createdAt: new Date().toISOString(),
  };
  if (DATA_SOURCE === 'firebase') {
    const colRef = getImmunityCollectionRef(wheelId);
    // Check if immunity for this sectorIndex exists, if so update, else add
    const snap = await getDocs(colRef);
    let updated = false;
    for (const docSnap of snap.docs) {
      if (docSnap.data().sectorIndex === sectorIndex) {
        await setDoc(docSnap.ref, newImmunity, { merge: true });
        updated = true;
      }
    }
    if (!updated) {
      await addDoc(colRef, newImmunity);
    }
  } else {
    // fallback to localStorage logic
    const immunities = await getImmunities(wheelId);
    const existingIndex = immunities.findIndex(im => im.sectorIndex === sectorIndex);
    if (existingIndex >= 0) {
      immunities[existingIndex] = newImmunity;
    } else {
      immunities.push(newImmunity);
    }
    localStorage.setItem(IMMUNITY_STORAGE_KEY, JSON.stringify(immunities));
  }
  return newImmunity;
}

export async function removeImmunity(wheelId: string, sectorIndex: number): Promise<boolean> {
  if (DATA_SOURCE === 'firebase') {
    const colRef = getImmunityCollectionRef(wheelId);
    const snap = await getDocs(colRef);
    let removed = false;
    for (const docSnap of snap.docs) {
      if (docSnap.data().sectorIndex === sectorIndex) {
        await deleteDoc(docSnap.ref);
        removed = true;
      }
    }
    return removed;
  } else {
    const immunities = await getImmunities(wheelId);
    const initialLength = immunities.length;
    const filteredImmunities = immunities.filter(im => im.sectorIndex !== sectorIndex);
    localStorage.setItem(IMMUNITY_STORAGE_KEY, JSON.stringify(filteredImmunities));
    return filteredImmunities.length !== initialLength;
  }
}

export async function clearAllImmunities(wheelId: string): Promise<void> {
  if (DATA_SOURCE === 'firebase') {
    const colRef = getImmunityCollectionRef(wheelId);
    const snap = await getDocs(colRef);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
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
