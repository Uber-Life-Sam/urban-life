import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Suspense } from 'react';
import CityEnvironment from './CityEnvironment';
import Player from './Player';
import CameraController from './CameraController';
import NPC from './NPC';
import { useNPCMovement } from '@/hooks/useNPCMovement';
import { npcRoutines, NPC_COLORS } from '@/data/npcRoutines';

interface GameSceneProps {
  timeOfDay: number;
  playerPosition: [number, number, number];
  playerRotation: number;
  isMoving: boolean;
}

const NPCController = ({ routine, color, timeOfDay }: { routine: any; color: string; timeOfDay: number }) => {
  const { position, rotation } = useNPCMovement(routine, timeOfDay);
  return <NPC position={position} rotation={rotation} color={color} />;
};

const GameScene = ({ timeOfDay, playerPosition, playerRotation, isMoving }: GameSceneProps) => {
  const isNight = timeOfDay < 6 || timeOfDay > 18;
  
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
          <Player position={playerPosition} rotation={playerRotation} isMoving={isMoving} />
          
          {/* NPCs with daily routines */}
          {npcRoutines.map((routine, index) => (
            <NPCController
              key={`npc-${index}`}
              routine={routine}
              color={NPC_COLORS[index % NPC_COLORS.length]}
              timeOfDay={timeOfDay}
            />
          ))}
          
          <CameraController target={playerPosition} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameScene;
