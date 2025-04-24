import { WheelItem, SpinStats } from '../types';

export interface StoredWheelData {
  lastRotation?: number;
  id: string;
  name: string;
  items: WheelItem[];
  spinStats: SpinStats;
  createdAt?: number; // Timestamp of wheel creation
}

const STORAGE_KEY = 'wheels';

export function getAllWheels(): Record<string, StoredWheelData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveWheel(wheel: StoredWheelData) {
  // Add createdAt timestamp if it's a new wheel (doesn't have createdAt yet)
  if (!wheel.createdAt) {
    wheel.createdAt = Date.now();
  }
  
  const all = getAllWheels();
  all[wheel.id] = wheel;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getWheelById(id: string): StoredWheelData | undefined {
  const all = getAllWheels();
  return all[id];
}

export function deleteWheel(id: string): void {
  const all = getAllWheels();
  delete all[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
