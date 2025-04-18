import { TeamMember, WheelConfig } from '../types';

export const DEFAULT_WHEEL_CONFIG: WheelConfig = {
  innerRadius: 200,
  outerRadius: 220,
  spins: 5,
  spinDuration: 5000,
};

export const OUTER_SECTORS_COUNT = 10;
export const STAR_IMMUNITY_MESSAGE = 'Sectors with immunity cannot be selected';

export const defaultTeamMembers: TeamMember[] = [
  { id: '1', name: 'Наташа', color: 'hsl(0, 70%, 80%)' },
  { id: '2', name: 'Аліса', color: 'hsl(36, 70%, 80%)' },
  { id: '3', name: 'Андрій', color: 'hsl(72, 70%, 80%)' },
  { id: '4', name: 'Тарас', color: 'hsl(108, 70%, 80%)' },
  { id: '5', name: 'Костя', color: 'hsl(144, 70%, 80%)' },
  { id: '6', name: 'Сергій', color: 'hsl(180, 70%, 80%)' },
  { id: '7', name: 'Женя', color: 'hsl(216, 70%, 80%)' },
  { id: '8', name: 'Вітя', color: 'hsl(252, 70%, 80%)' },
  { id: '9', name: 'Антон', color: 'hsl(288, 70%, 80%)' },
  { id: '10', name: 'Ед', color: 'hsl(324, 70%, 80%)' },
];

export const generateRandomColor = (): string => {
  const hue = Math.random() * 360;
  return `hsl(${hue}, 70%, 80%)`;
};
