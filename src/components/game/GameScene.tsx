import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Suspense } from 'react';
import CityEnvironment from './CityEnvironment';
import Player from './Player';
import CameraController from './CameraController';

interface GameSceneProps {
  timeOfDay: number;
  playerPosition: [number, number, number];
  playerRotation: number;
  isMoving: boolean;
}

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
          
          <CameraController target={playerPosition} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameScene;
