import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import CityEnvironment from './CityEnvironment';
import Player from './Player';
import CameraController from './CameraController';
import NPC from './NPC';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';
import ClickableBuilding from './ClickableBuilding';
import PlayerHouse from './PlayerHouse';
import PlayerLand from './PlayerLand';
import { useNPCMovement } from '@/hooks/useNPCMovement';
import { useVehicleMovement } from '@/hooks/useVehicleMovement';
import { npcRoutines, NPC_COLORS } from '@/data/npcRoutines';
import { buildings, Building } from '@/data/buildings';
import { trafficLights, roadPaths } from '@/data/roadNetwork';

interface GameSceneProps {
  timeOfDay: number;
  playerPosition: [number, number, number];
  playerRotation: number;
  isMoving: boolean;
  cameraOffset: [number, number, number];
  onBuildingClick: (building: Building) => void;
  onNPCPositionsUpdate: (positions: Array<[number, number, number]>) => void;
}

const NPCController = ({ 
  routine, 
  color, 
  timeOfDay,
  onPositionUpdate 
}: { 
  routine: any; 
  color: string; 
  timeOfDay: number;
  onPositionUpdate: (pos: [number, number, number]) => void;
}) => {
  const { position, rotation } = useNPCMovement(routine, timeOfDay);
  
  useEffect(() => {
    onPositionUpdate(position);
  }, [position, onPositionUpdate]);
  
  return <NPC position={position} rotation={rotation} color={color} />;
};

const VehicleController = ({ 
  path, 
  color,
  shouldStop 
}: { 
  path: any; 
  color: string;
  shouldStop: boolean;
}) => {
  const { position, rotation } = useVehicleMovement(path, 3, shouldStop);
  return <Vehicle position={position} rotation={rotation} color={color} />;
};

const GameScene = ({ 
  timeOfDay, 
  playerPosition, 
  playerRotation, 
  isMoving,
  cameraOffset,
  onBuildingClick,
  onNPCPositionsUpdate 
}: GameSceneProps) => {
  const isNight = timeOfDay < 6 || timeOfDay > 18;
  const [trafficLightStates, setTrafficLightStates] = useState(trafficLights);
  const [npcPositions, setNpcPositions] = useState<Array<[number, number, number]>>([]);
  
  // Traffic light cycle - coordinated for realistic traffic flow
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLightStates((prev) => 
        prev.map((light) => {
          let newState: 'red' | 'yellow' | 'green';
          
          // North-South lights change together
          // East-West lights change together (opposite to North-South)
          if (light.direction === 'north-south') {
            if (light.state === 'green') newState = 'yellow';
            else if (light.state === 'yellow') newState = 'red';
            else newState = 'green';
          } else {
            // East-West is opposite
            if (light.state === 'green') newState = 'yellow';
            else if (light.state === 'yellow') newState = 'red';
            else newState = 'green';
          }
          
          return { ...light, state: newState };
        })
      );
    }, 4000); // Faster cycle for more dynamic traffic
    return () => clearInterval(interval);
  }, []);
  
  // Update NPC positions for collision detection
  useEffect(() => {
    onNPCPositionsUpdate(npcPositions);
  }, [npcPositions, onNPCPositionsUpdate]);
  
  const handleNPCPosition = (index: number) => (pos: [number, number, number]) => {
    setNpcPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = pos;
      return newPositions;
    });
  };
  
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [10, 8, 10], fov: 60 }}
        shadows
      >
        <Suspense fallback={null}>
          <Sky
            distance={450000}
            sunPosition={[
              Math.cos((timeOfDay / 24) * Math.PI * 2) * 100,
              Math.sin((timeOfDay / 24) * Math.PI * 2) * 100,
              0
            ]}
            inclination={0.6}
            azimuth={0.25}
          />
          
          <ambientLight intensity={isNight ? 0.2 : 0.6} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={isNight ? 0.3 : 1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <CityEnvironment />
          
          {/* Player's Land and House */}
          <PlayerLand position={[0, 0, -30]} />
          <PlayerHouse position={[0, 0, -30]} />
          
          <Player position={playerPosition} rotation={playerRotation} isMoving={isMoving} />
          
          {/* Clickable Buildings */}
          {buildings.map((building) => (
            <ClickableBuilding
              key={building.id}
              building={building}
              onClick={onBuildingClick}
            />
          ))}
          
          {/* NPCs with daily routines */}
          {npcRoutines.map((routine, index) => (
            <NPCController
              key={`npc-${index}`}
              routine={routine}
              color={NPC_COLORS[index % NPC_COLORS.length]}
              timeOfDay={timeOfDay}
              onPositionUpdate={handleNPCPosition(index)}
            />
          ))}
          
          {/* Traffic Lights */}
          {trafficLightStates.map((light) => (
            <TrafficLight
              key={light.id}
              position={light.position}
              state={light.state}
            />
          ))}
          
          {/* Vehicles - Multiple vehicles per path for realistic traffic */}
          {roadPaths.map((path, index) => {
            const light = trafficLightStates.find(l => l.id === path.trafficLightId);
            const shouldStop = light?.state === 'red' || light?.state === 'yellow';
            const vehicleColors = [
              ['#ff5555', '#cc3333', '#ff8888'],
              ['#5555ff', '#3333cc', '#8888ff'],
              ['#55ff55', '#33cc33', '#88ff88'],
              ['#ffff55', '#cccc33', '#ffff88'],
            ];
            
            return (
              <>
                <VehicleController
                  key={`${path.id}-1`}
                  path={path.waypoints}
                  color={vehicleColors[index % 4][0]}
                  shouldStop={shouldStop}
                />
                <VehicleController
                  key={`${path.id}-2`}
                  path={path.waypoints.map(wp => ({ x: wp.x, z: wp.z }))}
                  color={vehicleColors[index % 4][1]}
                  shouldStop={shouldStop}
                />
              </>
            );
          })}
          
          <CameraController target={playerPosition} offset={cameraOffset} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameScene;
