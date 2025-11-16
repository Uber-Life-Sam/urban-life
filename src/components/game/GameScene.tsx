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
  playerRotation: number; // Y rotation in radians (number)
  isMoving: boolean;
  cameraOffset: [number, number, number];
  onBuildingClick: (building: Building) => void;
  onNPCPositionsUpdate: (positions: Array<[number, number, number]>) => void;

  playerRef: any;
  cameraRef: any;
}

const NPCController = ({
  routine,
  color,
  timeOfDay,
  onPositionUpdate,
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

const VehicleController = ({ path, color, shouldStop }: { path: any; color: string; shouldStop: boolean; }) => {
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
  const isDawn = timeOfDay >= 5 && timeOfDay < 7;
  const isDusk = timeOfDay >= 18 && timeOfDay < 20;

  const [trafficLightStates, setTrafficLightStates] = useState(trafficLights);
  const [npcPositions, setNpcPositions] = useState<Array<[number, number, number]>>([]);

  const getLightingValues = () => {
    const hour = timeOfDay;
    let ambientIntensity = 0.6;
    let directionalIntensity = 1;
    if (hour < 5 || hour >= 20) {
      ambientIntensity = 0.15;
      directionalIntensity = 0.1;
    } else if (hour >= 5 && hour < 7) {
      const progress = (hour - 5) / 2;
      ambientIntensity = 0.15 + 0.45 * progress;
      directionalIntensity = 0.1 + 0.9 * progress;
    } else if (hour >= 7 && hour < 18) {
      ambientIntensity = 0.6;
      directionalIntensity = 1;
    } else if (hour >= 18 && hour < 20) {
      const progress = (hour - 18) / 2;
      ambientIntensity = 0.6 - 0.45 * progress;
      directionalIntensity = 1 - 0.9 * progress;
    }
    return { ambientIntensity, directionalIntensity };
  };

  const { ambientIntensity, directionalIntensity } = getLightingValues();

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLightStates((prev) =>
        prev.map((light) => {
          let newState: "red" | "yellow" | "green";
          if (light.direction === "north-south") {
            if (light.state === "green") newState = "yellow";
            else if (light.state === "yellow") newState = "red";
            else newState = "green";
          } else {
            if (light.state === "green") newState = "yellow";
            else if (light.state === "yellow") newState = "red";
            else newState = "green";
          }
          return { ...light, state: newState };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      <Canvas camera={{ position: [10, 8, 10], fov: 60 }} shadows>
        <Suspense fallback={null}>
          <Sky
            distance={450000}
            sunPosition={[
              Math.cos((timeOfDay / 24) * Math.PI * 2) * 100,
              Math.sin((timeOfDay / 24) * Math.PI * 2) * 100,
              0,
            ]}
            inclination={0.6}
            azimuth={0.25}
          />

          <ambientLight intensity={ambientIntensity} />

          <directionalLight
            position={[
              Math.cos((timeOfDay / 24) * Math.PI * 2) * 20,
              Math.sin((timeOfDay / 24) * Math.PI * 2) * 20 + 5,
              10,
            ]}
            intensity={directionalIntensity}
            color={isNight ? "#b8c5d6" : "#ffffff"}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {isNight && <hemisphereLight color="#4a5f8a" groundColor="#1a1a2e" intensity={0.2} />}

          <CityEnvironment timeOfDay={timeOfDay} isNight={isNight} />

          <PlayerLand position={[0, 0, -30]} />
          <PlayerHouse position={[0, 0, -30]} />

          {/* Player with ref */}
          <Player ref={playerRef} /* position removed, ref will control position */ rotation={playerRotation} isMoving={isMoving} />

          {/* Clickable Buildings */}
          {buildings.map((building) => (
            <ClickableBuilding key={building.id} building={building} onClick={onBuildingClick} />
          ))}

          {/* NPCs */}
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
            <TrafficLight key={light.id} position={light.position} state={light.state} />
          ))}

          {/* Vehicles */}
          {roadPaths.map((path, index) => {
            const light = trafficLightStates.find((l) => l.id === path.trafficLightId);
            const shouldStop = light?.state === "red" || light?.state === "yellow";
            const vehicleColors = [
              ["#ff5555", "#cc3333", "#ff8888"],
              ["#5555ff", "#3333cc", "#8888ff"],
              ["#55ff55", "#33cc33", "#88ff88"],
              ["#ffff55", "#cccc33", "#ffff88"],
            ];
            return (
              <group key={`vehicles-${index}`}>
                <VehicleController key={`${path.id}-1`} path={path.waypoints} color={vehicleColors[index % 4][0]} shouldStop={shouldStop} />
                <VehicleController key={`${path.id}-2`} path={path.waypoints.map((wp) => ({ x: wp.x, z: wp.z }))} color={vehicleColors[index % 4][1]} shouldStop={shouldStop} />
              </group>
            );
          })}

          {/* CameraController sets cameraRef.current internally */}
          <PerspectiveCamera makeDefault position={[10, 8, 10]} />
          <CameraController ref={cameraRef} target={playerPosition} offset={cameraOffset} followRotation={playerRotation} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameScene;
