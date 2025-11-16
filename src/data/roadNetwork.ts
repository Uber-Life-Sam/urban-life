export interface TrafficLightState {
  id: string;
  position: [number, number, number];
  state: 'red' | 'yellow' | 'green';
  direction: 'north-south' | 'east-west';
}

export interface RoadPath {
  id: string;
  waypoints: Array<{ x: number; z: number }>;
  trafficLightId?: string;
}

export const trafficLights: TrafficLightState[] = [
  // North-South lights (green)
  {
    id: 'light-north',
    position: [1.5, 0.5, -1.5],
    state: 'green',
    direction: 'north-south',
  },
  {
    id: 'light-south',
    position: [-1.5, 0.5, 1.5],
    state: 'green',
    direction: 'north-south',
  },
  // East-West lights (red)
  {
    id: 'light-east',
    position: [1.5, 0.5, 1.5],
    state: 'red',
    direction: 'east-west',
  },
  {
    id: 'light-west',
    position: [-1.5, 0.5, -1.5],
    state: 'red',
    direction: 'east-west',
  },
];

export const roadPaths: RoadPath[] = [
  // East to West (top lane)
  {
    id: 'path-east-west-1',
    waypoints: [
      { x: 20, z: -0.5 },
      { x: 10, z: -0.5 },
      { x: 2, z: -0.5 },
      { x: -2, z: -0.5 },
      { x: -10, z: -0.5 },
      { x: -20, z: -0.5 },
    ],
    trafficLightId: 'light-east',
  },
  // West to East (bottom lane)
  {
    id: 'path-west-east-1',
    waypoints: [
      { x: -20, z: 0.5 },
      { x: -10, z: 0.5 },
      { x: -2, z: 0.5 },
      { x: 2, z: 0.5 },
      { x: 10, z: 0.5 },
      { x: 20, z: 0.5 },
    ],
    trafficLightId: 'light-west',
  },
  // North to South (left lane)
  {
    id: 'path-north-south-1',
    waypoints: [
      { x: -0.5, z: -20 },
      { x: -0.5, z: -10 },
      { x: -0.5, z: -2 },
      { x: -0.5, z: 2 },
      { x: -0.5, z: 10 },
      { x: -0.5, z: 20 },
    ],
    trafficLightId: 'light-north',
  },
  // South to North (right lane)
  {
    id: 'path-south-north-1',
    waypoints: [
      { x: 0.5, z: 20 },
      { x: 0.5, z: 10 },
      { x: 0.5, z: 2 },
      { x: 0.5, z: -2 },
      { x: 0.5, z: -10 },
      { x: 0.5, z: -20 },
    ],
    trafficLightId: 'light-south',
  },
];
