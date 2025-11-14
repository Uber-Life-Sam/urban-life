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
  {
    id: 'light-1',
    position: [0, 0.5, 0],
    state: 'green',
    direction: 'north-south',
  },
  {
    id: 'light-2',
    position: [0, 0.5, 0],
    state: 'red',
    direction: 'east-west',
  },
];

export const roadPaths: RoadPath[] = [
  {
    id: 'path-1',
    waypoints: [
      { x: -15, z: 0 },
      { x: -2, z: 0 },
      { x: 2, z: 0 },
      { x: 15, z: 0 },
    ],
    trafficLightId: 'light-2',
  },
  {
    id: 'path-2',
    waypoints: [
      { x: 0, z: -15 },
      { x: 0, z: -2 },
      { x: 0, z: 2 },
      { x: 0, z: 15 },
    ],
    trafficLightId: 'light-1',
  },
];
