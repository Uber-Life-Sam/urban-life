import { NPCRoutine } from '@/hooks/useNPCMovement';

// Define NPC colors
export const NPC_COLORS = [
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
];

// Define routines for different NPCs
export const npcRoutines: NPCRoutine[] = [
  // Office Worker - goes to work in the morning
  {
    morningPath: [
      { x: -8, z: -8 },
      { x: -5, z: -5 },
      { x: 0, z: -3 },
      { x: 5, z: -5 },
    ],
    dayPath: [
      { x: 5, z: -5 },
      { x: 8, z: -8 },
      { x: 8, z: -5 },
      { x: 5, z: -5 },
    ],
    eveningPath: [
      { x: 5, z: -5 },
      { x: 0, z: -3 },
      { x: -5, z: -5 },
      { x: -8, z: -8 },
    ],
    nightPath: [
      { x: -8, z: -8 },
      { x: -8, z: -8 },
    ],
  },
  // Shopkeeper - stays near stores
  {
    morningPath: [
      { x: -10, z: 5 },
      { x: -8, z: 5 },
      { x: -10, z: 5 },
    ],
    dayPath: [
      { x: -10, z: 5 },
      { x: -8, z: 8 },
      { x: -10, z: 8 },
      { x: -10, z: 5 },
    ],
    eveningPath: [
      { x: -10, z: 5 },
      { x: -12, z: 3 },
      { x: -10, z: 5 },
    ],
    nightPath: [
      { x: -12, z: 3 },
      { x: -12, z: 3 },
    ],
  },
  // Delivery Person - moves around the city
  {
    morningPath: [
      { x: 0, z: 0 },
      { x: 8, z: 8 },
      { x: -8, z: 8 },
      { x: 0, z: 0 },
    ],
    dayPath: [
      { x: 0, z: 0 },
      { x: 10, z: -10 },
      { x: -10, z: -10 },
      { x: -10, z: 10 },
      { x: 10, z: 10 },
      { x: 0, z: 0 },
    ],
    eveningPath: [
      { x: 0, z: 0 },
      { x: 5, z: 5 },
      { x: 0, z: 0 },
    ],
    nightPath: [
      { x: 8, z: 0 },
      { x: 8, z: 0 },
    ],
  },
  // Pedestrian 1 - casual walker
  {
    morningPath: [
      { x: 3, z: 3 },
      { x: 6, z: 3 },
      { x: 6, z: 6 },
      { x: 3, z: 6 },
    ],
    dayPath: [
      { x: 3, z: 6 },
      { x: 0, z: 8 },
      { x: -3, z: 6 },
      { x: 0, z: 3 },
      { x: 3, z: 6 },
    ],
    eveningPath: [
      { x: 3, z: 6 },
      { x: 6, z: 6 },
      { x: 6, z: 3 },
      { x: 3, z: 3 },
    ],
    nightPath: [
      { x: 3, z: 3 },
      { x: 3, z: 3 },
    ],
  },
  // Pedestrian 2 - night shift worker
  {
    morningPath: [
      { x: -5, z: 8 },
      { x: -5, z: 8 },
    ],
    dayPath: [
      { x: -5, z: 8 },
      { x: -5, z: 8 },
    ],
    eveningPath: [
      { x: -5, z: 8 },
      { x: -3, z: 5 },
      { x: 0, z: 3 },
      { x: 5, z: 5 },
    ],
    nightPath: [
      { x: 5, z: 5 },
      { x: 8, z: 3 },
      { x: 5, z: 0 },
      { x: 5, z: 5 },
    ],
  },
];
