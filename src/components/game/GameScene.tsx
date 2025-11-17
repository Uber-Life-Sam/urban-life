// src/components/game/GameScene.tsx
import { Canvas } from "@react-three/fiber";
import { Sky, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import CityEnvironment from "./CityEnvironment";
import Player from "./Player";
import CameraController from "./CameraController";
import NPC from "./NPC";
import TrafficLight from "./TrafficLight";
import Vehicle from "./Vehicle";
import ClickableBuilding from "./ClickableBuilding";
import PlayerHouse from "./PlayerHouse";
import PlayerLand from "./PlayerLand";
import { useNPCMovement } from "@/hooks/useNPCMovement";
import { useVehicleMovement } from "@/hooks/useVehicleMovement";
import { npcRoutines, NPC_COLORS } from "@/data/npcRoutines";
import { buildings, Building } from "@/data/buildings";
import { trafficLights, roadPaths } from "@/data/roadNetwork";

interface GameSceneProps {
  timeOfDay: number;
  playerPosition: [number, number, number];
  playerRotation: number; // Y rotation in radians (number)
  isMoving: boolean;
  cameraOffset: [number, number, number];
  onBuildingClick: (building: Building) => void;
  onNPCPositionsUpdate?: (positions: Array<[number, number, number]>) => void;
  playerRef: any;
  cameraRef: any;
}

const NPCController = ({ routine, color, timeOfDay, onPositionUpdate }: any) => {
  const { position, rotation } = useNPCMovement(routine, timeOfDay);
  useEffect(() => { onPositionUpdate && onPositionUpdate(position); }, [position, onPositionUpdate]);
  return <NPC position={position} rotation={rotation} color={color} />;
};

const VehicleController = ({ path, color, shouldStop }: any) => {
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
  onNPCPositionsUpdate,
  playerRef,
  cameraRef,
}: GameSceneProps) => {
  const isNight = timeOfDay < 6 || timeOfDay > 19;
  const [trafficLightStates, setTrafficLightStates] = useState(trafficLights);
  const [npcPositions, setNpcPositions] = useState<Array<[number, number, number]>>([]);

  useEffect(() => {
    const i = setInterval(() => {
      setTrafficLightStates((prev) => prev.map((l) => {
        let ns = l.state === "green" ? "yellow" : l.state === "yellow" ? "red" : "green";
        return { ...l, state: ns };
      }));
    }, 4000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => { onNPCPositionsUpdate && onNPCPositionsUpdate(npcPositions); }, [npcPositions, onNPCPositionsUpdate]);

  const handleNPCPosition = (index: number) => (pos: [number, number, number]) => {
    setNpcPositions((prev) => { const n = [...prev]; n[index] = pos; return n; });
  };

  // default camera offset if not provided
  const camOffset: [number, number, number] = cameraOffset ?? [0, 2.4, -5.5];

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [10, 6, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Sky distance={450000} sunPosition={[
            Math.cos((timeOfDay / 24) * Math.PI * 2) * 100,
            Math.sin((timeOfDay / 24) * Math.PI * 2) * 100,
            0
          ]} inclination={0.6} azimuth={0.25} />

          <ambientLight intensity={isNight ? 0.2 : 0.6} />
          <directionalLight position={[10, 20, 10]} intensity={isNight ? 0.4 : 1.0} castShadow />

          <CityEnvironment timeOfDay={timeOfDay} isNight={isNight} />
          <PlayerLand position={[0, 0, -30]} />
          <PlayerHouse position={[0, 0, -30]} />

          {/* Player: ref used by movement hook to move group directly */}
          <Player ref={playerRef} /* position removed - controlled by hook */ rotation={playerRotation} isMoving={isMoving} />

          {/* Buildings */}
          {buildings.map((b) => <ClickableBuilding key={b.id} building={b} onClick={onBuildingClick} />)}

          {/* NPCs */}
          {npcRoutines.map((r, i) => (
            <NPCController key={i} routine={r} color={NPC_COLORS[i % NPC_COLORS.length]} timeOfDay={timeOfDay} onPositionUpdate={handleNPCPosition(i)} />
          ))}

          {/* Traffic lights */}
          {trafficLightStates.map((l) => <TrafficLight key={l.id} position={l.position} state={l.state} />)}

          {/* Vehicles */}
          {roadPaths.map((path, idx) => {
            const light = trafficLightStates.find((l) => l.id === path.trafficLightId);
            const shouldStop = light?.state === "red" || light?.state === "yellow";
            return (
              <group key={`veh-${idx}`}>
                <VehicleController key={`${path.id}-1`} path={path.waypoints} color="#ff5555" shouldStop={shouldStop} />
                <VehicleController key={`${path.id}-2`} path={path.waypoints.map((wp: any)=>({x: wp.x, z: wp.z}))} color="#55ff55" shouldStop={shouldStop} />
              </group>
            );
          })}

          {/* Camera: PerspectiveCamera + our controller */}
          <PerspectiveCamera makeDefault position={[10, 6, 10]} />
          <CameraController ref={cameraRef} target={playerPosition} offset={camOffset} followRotation={playerRotation} />

        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameScene;
