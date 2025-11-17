// src/components/game/GameScene.tsx
import { Canvas } from "@react-three/fiber";
import { Sky, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
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
  playerRotation: number; // Y rotation (radians)
  isMoving: boolean;
  cameraOffset: [number, number, number];
  onBuildingClick: (building: Building) => void;
  onNPCPositionsUpdate: (positions: Array<[number, number, number]>) => void;
  playerRef: any;
  cameraRef: any;
}

const NPCController = ({ routine, color, timeOfDay, onPositionUpdate }:{
  routine:any; color:string; timeOfDay:number; onPositionUpdate:(p:[number,number,number])=>void;
}) => {
  const { position, rotation } = useNPCMovement(routine, timeOfDay);
  useEffect(()=>{ onPositionUpdate(position); }, [position, onPositionUpdate]);
  return <NPC position={position} rotation={rotation} color={color} />;
};

const VehicleController = ({ path, color, shouldStop }: { path:any; color:string; shouldStop:boolean }) => {
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
  cameraRef
}: GameSceneProps) => {
  const isNight = timeOfDay < 6 || timeOfDay > 19;

  const [trafficLightStates, setTrafficLightStates] = useState(trafficLights);
  const [npcPositions, setNpcPositions] = useState<Array<[number,number,number]>>([]);

  useEffect(() => {
    const iv = setInterval(() => {
      setTrafficLightStates(prev => prev.map(light => {
        let newState: "red"|"yellow"|"green";
        if (light.state === "green") newState = "yellow";
        else if (light.state === "yellow") newState = "red";
        else newState = "green";
        return { ...light, state: newState };
      }));
    }, 4000);
    return ()=>clearInterval(iv);
  }, []);

  useEffect(()=>{ onNPCPositionsUpdate(npcPositions); }, [npcPositions, onNPCPositionsUpdate]);

  const handleNPCPosition = (index:number) => (pos:[number,number,number])=>{
    setNpcPositions(prev=>{
      const copy = [...prev];
      copy[index] = pos;
      return copy;
    });
  };

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[10,8,10]} fov={60} />
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
          <ambientLight intensity={isNight ? 0.15 : 0.6} />
          <directionalLight
            position={[Math.cos((timeOfDay / 24) * Math.PI * 2) * 20, Math.sin((timeOfDay / 24) * Math.PI * 2) * 20 + 5, 10]}
            intensity={isNight ? 0.1 : 1}
            color={isNight ? "#b8c5d6" : "#ffffff"}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <CityEnvironment timeOfDay={timeOfDay} isNight={isNight} />
          <PlayerLand position={[0,0,-30]} />
          <PlayerHouse position={[0,0,-30]} />

          {/* IMPORTANT: Player receives ref and its internal position is controlled by the movement hook */}
          <Player ref={playerRef} rotation={playerRotation} isMoving={isMoving} />

          {buildings.map(b => (
            <ClickableBuilding key={b.id} building={b} onClick={onBuildingClick} />
          ))}

          {npcRoutines.map((r, i) => (
            <NPCController key={i} routine={r} color={NPC_COLORS[i % NPC_COLORS.length]} timeOfDay={timeOfDay} onPositionUpdate={handleNPCPosition(i)} />
          ))}

          {trafficLightStates.map(light => (
            <TrafficLight key={light.id} position={light.position} state={light.state} />
          ))}

          {roadPaths.map((path, idx) => {
            const light = trafficLightStates.find(l => l.id === path.trafficLightId);
            const shouldStop = light?.state === "red" || light?.state === "yellow";
            const vehicleColors = [
              ["#ff5555","#cc3333","#ff8888"],
              ["#5555ff","#3333cc","#8888ff"],
              ["#55ff55","#33cc33","#88ff88"],
              ["#ffff55","#cccc33","#ffff88"]
            ];
            return (
              <group key={`vehicles-${idx}`}>
                <VehicleController key={`${path.id}-1`} path={path.waypoints} color={vehicleColors[idx % 4][0]} shouldStop={shouldStop} />
                <VehicleController key={`${path.id}-2`} path={path.waypoints.map(wp => ({ x: wp.x, z: wp.z }))} color={vehicleColors[idx % 4][1]} shouldStop={shouldStop} />
              </group>
            );
          })}

          {/* Camera controller: followRotation = player's Y rotation so camera stays behind player and mouse lets user look around */}
          <CameraController ref={cameraRef} target={playerPosition} offset={cameraOffset} followRotation={playerRotation} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameScene;
