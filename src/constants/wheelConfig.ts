import { WheelItem, WheelConfig } from '../types';

export const DEFAULT_WHEEL_CONFIG: WheelConfig = {
  innerRadius: 200,
  outerRadius: 220,
  spins: 5,
  spinDuration: 5000,
};

// Maximum number of sectors/items allowed in a wheel
export const MAX_ITEMS = 14;

export const OUTER_SECTORS_COUNT = 10;
export const STAR_IMMUNITY_MESSAGE = 'Sectors with immunity cannot be selected';

export const defaultTeamMembers: WheelItem[] = [
  { id: '1', name: 'Natasha', color: 'hsl(0, 70%, 80%)' },
  { id: '2', name: 'Alice', color: 'hsl(36, 70%, 80%)' },
  { id: '3', name: 'Andrew', color: 'hsl(72, 70%, 80%)' },
  { id: '4', name: 'Taras', color: 'hsl(108, 70%, 80%)' },
  { id: '5', name: 'Kostya', color: 'hsl(144, 70%, 80%)' },
  { id: '6', name: 'Sergey', color: 'hsl(180, 70%, 80%)' },
  { id: '7', name: 'Eugene', color: 'hsl(216, 70%, 80%)' },
  { id: '8', name: 'Victor', color: 'hsl(252, 70%, 80%)' },
  { id: '9', name: 'Anton', color: 'hsl(288, 70%, 80%)' },
  { id: '10', name: 'Ed', color: 'hsl(324, 70%, 80%)' },
];

export const generateRandomColor = (): string => {
  const hue = Math.random() * 360;
  return `hsl(${hue}, 70%, 80%)`;
};
