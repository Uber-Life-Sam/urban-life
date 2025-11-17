export interface Interior {
  id: string;
  name: string;
  type: 'house' | 'shop' | 'office' | 'restaurant';
  exitPosition: [number, number, number]; // Where player spawns when exiting
  furniture: FurnitureItem[];
}

export interface FurnitureItem {
  id: string;
  type: 'table' | 'chair' | 'bed' | 'shelf' | 'counter';
  position: [number, number, number];
  rotation: number;
  color?: string;
}

export const interiors: Record<string, Interior> = {
  player_house: {
    id: 'player_house',
    name: 'Your House',
    type: 'house',
    exitPosition: [0, 0, -30],
    furniture: [
      { id: 'bed_1', type: 'bed', position: [-3, 0.5, -3], rotation: 0, color: '#8B4513' },
      { id: 'table_1', type: 'table', position: [2, 0.5, 2], rotation: 0, color: '#654321' },
      { id: 'chair_1', type: 'chair', position: [2, 0.5, 3], rotation: Math.PI, color: '#654321' },
    ],
  },
  shop: {
    id: 'shop',
    name: 'General Store',
    type: 'shop',
    exitPosition: [10, 0, 10],
    furniture: [
      { id: 'counter_1', type: 'counter', position: [0, 0.5, -4], rotation: 0, color: '#8B7355' },
      { id: 'shelf_1', type: 'shelf', position: [-4, 1, -3], rotation: Math.PI / 2, color: '#654321' },
      { id: 'shelf_2', type: 'shelf', position: [4, 1, -3], rotation: -Math.PI / 2, color: '#654321' },
    ],
  },
};
