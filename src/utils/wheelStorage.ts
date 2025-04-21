import { WheelItem, SpinStats } from '../types';

export interface StoredWheelData {
  id: string;
  name: string;
  items: WheelItem[];
  spinStats: SpinStats;
}

const STORAGE_KEY = 'wheels';

export function getAllWheels(): Record<string, StoredWheelData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveWheel(wheel: StoredWheelData) {
  const all = getAllWheels();
  all[wheel.id] = wheel;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getWheelById(id: string): StoredWheelData | undefined {
  const all = getAllWheels();
  return all[id];
}
